require('dotenv').config()
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const { clerkMiddleware, getAuth } = require('@clerk/express');
const { encrypt, decrypt, validateEncryptionKey } = require('./crypto');
const port = process.env.PORT || 3001
const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error('MONGO_URI is required')
}

const app = express()
let httpServer
let isDatabaseReady = false

app.use(express.json({ limit: '10kb' }))

app.get('/health', (req, res) => {
  res.status(isDatabaseReady ? 200 : 503).json({
    status: isDatabaseReady ? 'ready' : 'starting'
  })
})

const allowedOrigins = [
  "http://localhost:3001",
  "https://passend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    const isLocalDevelopment = origin && /^http:\/\/localhost:\d+$/.test(origin);
    if (!origin || isLocalDevelopment || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}))

app.use(clerkMiddleware())

// Connection URL
const client = new MongoClient(mongoUri);

// Database Name
const dbName = 'PassEnd';
const allowedIdentifierTypes = ['username', 'email', 'phone'];
const maxFieldLengths = {
  id: 100,
  site: 2048,
  identifier: 512,
  password: 1024
};

const isValidPasswordEntry = ({ id, site, identifierType, identifier, password }) => {
  return (
    typeof id === 'string' &&
    typeof site === 'string' &&
    typeof identifier === 'string' &&
    typeof password === 'string' &&
    allowedIdentifierTypes.includes(identifierType) &&
    id.trim().length > 0 &&
    site.trim().length > 0 &&
    identifier.trim().length > 0 &&
    password.length > 0 &&
    id.length <= maxFieldLengths.id &&
    site.length <= maxFieldLengths.site &&
    identifier.length <= maxFieldLengths.identifier &&
    password.length <= maxFieldLengths.password
  )
}

app.get('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({ userId }).toArray();
    // Decrypt the passwords before sending to React
    const decryptedPasswords = findResult.map(item => {
      return {
        ...item,
        site: decrypt(item.site),
        username: decrypt(item.username),
        identifier: decrypt(item.identifier || item.username),
        password: decrypt(item.password)
      }
    });
    res.json(decryptedPasswords);
  } catch (error) {
    console.error("Failed to fetch passwords:", error.message);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.post('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const { id, site, identifierType, identifier, password } = req.body;
    if (!isValidPasswordEntry(req.body)) {
      return res.status(400).json({ error: "Invalid password entry" });
    }

    const passwordData = {
      id,
      userId,
      site: encrypt(site.trim()),
      identifierType,
      identifier: encrypt(identifier.trim()),
      username: encrypt(identifier.trim()),
      password: encrypt(password)
    };
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(passwordData);
    res.send({ success: true, result: insertResult })
  } catch (error) {
    console.error("Failed to save password:", error.message);
    res.status(500).json({ error: "Failed to save" });
  }
});

app.patch('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const { id, site, identifierType, identifier, password } = req.body;
    if (!isValidPasswordEntry(req.body)) {
      return res.status(400).json({ error: "Invalid password entry" });
    }

    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const updateResult = await collection.updateOne(
      { id, userId },
      {
        $set: {
          site: encrypt(site.trim()),
          identifierType,
          identifier: encrypt(identifier.trim()),
          username: encrypt(identifier.trim()),
          password: encrypt(password)
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Password entry not found" });
    }

    res.send({ success: true });
  } catch (error) {
    console.error("Failed to update password:", error.message);
    res.status(500).json({ error: "Failed to update" });
  }
});

app.delete('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });
    const { id } = req.body;
    if (typeof id !== 'string' || !id) {
      return res.status(400).json({ error: "Entry ID is required" });
    }
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const deleteResult = await collection.deleteOne({ id, userId });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Password entry not found" });
    }
    res.send({ success: true, result: deleteResult })
  } catch (error) {
    console.error("Failed to delete password:", error.message);
    res.status(500).json({ error: "Failed to delete" });
  }
})

const shutdown = async (signal) => {
  if (httpServer) {
    await new Promise(resolve => httpServer.close(resolve))
  }
  await client.close()
  console.log(`Shutdown complete after ${signal}`)
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))

const startServer = async () => {
  validateEncryptionKey()
  await client.connect()
  isDatabaseReady = true
  console.log("Successfully connected to MongoDB")

  httpServer = app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })

  httpServer.on('error', async (error) => {
    console.error("HTTP server error:", error.message)
    await client.close()
    process.exitCode = 1
  })
}

startServer().catch(async (error) => {
  console.error("Backend startup failed:", error.message)
  await client.close().catch(() => {})
  process.exitCode = 1
})
