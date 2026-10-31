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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://passend.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

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
  password: 1024,
  category: 50
};

const isValidPasswordEntry = ({ id, site, identifierType, identifier, password, category, favorite }) => {
  return (
    typeof id === 'string' &&
    typeof site === 'string' &&
    typeof identifier === 'string' &&
    typeof password === 'string' &&
    (category === undefined || typeof category === 'string') &&
    (favorite === undefined || typeof favorite === 'boolean') &&
    allowedIdentifierTypes.includes(identifierType) &&
    id.trim().length > 0 &&
    site.trim().length > 0 &&
    identifier.trim().length > 0 &&
    password.length > 0 &&
    id.length <= maxFieldLengths.id &&
    site.length <= maxFieldLengths.site &&
    identifier.length <= maxFieldLengths.identifier &&
    password.length <= maxFieldLengths.password &&
    (category === undefined || category.trim().length <= maxFieldLengths.category)
  )
}

const getCategory = (category) => {
  const normalizedCategory = typeof category === 'string' ? category.trim() : ''
  return normalizedCategory || 'General'
}

const recordActivity = async (userId, action, details = {}) => {
  try {
    await client.db(dbName).collection('activity').insertOne({
      userId,
      action,
      details,
      createdAt: new Date()
    })
  } catch (error) {
    console.error("Failed to record activity:", error.message)
  }
}

app.get('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({ userId }).toArray();
    // Decrypt the passwords before sending to React
    const decryptedPasswords = findResult.flatMap(item => {
      try {
        return [{
          ...item,
          site: decrypt(item.site),
          username: decrypt(item.username),
          identifier: decrypt(item.identifier || item.username),
          password: decrypt(item.password),
          category: getCategory(item.category),
          favorite: item.favorite === true,
          createdAt: item.createdAt || null,
          updatedAt: item.updatedAt || null
        }]
      } catch {
        console.error("Skipped invalid vault entry:", item.id || 'unknown')
        return []
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

    const { id, site, identifierType, identifier, password, category, favorite } = req.body;
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
      password: encrypt(password),
      category: getCategory(category),
      favorite: favorite === true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(passwordData);
    await recordActivity(userId, 'created', { id });
    res.send({ success: true, result: insertResult })
  } catch (error) {
    console.error("Failed to save password:", error.message);
    res.status(500).json({ error: "Failed to save" });
  }
});

app.patch('/favorite', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const { id, favorite } = req.body;
    if (typeof id !== 'string' || !id.trim() || typeof favorite !== 'boolean') {
      return res.status(400).json({ error: "Invalid favorite update" });
    }

    const collection = client.db(dbName).collection('passwords');
    const updateResult = await collection.updateOne(
      { id, userId },
      { $set: { favorite, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Password entry not found" });
    }

    await recordActivity(userId, favorite ? 'favorited' : 'unfavorited', { id });
    res.send({ success: true, favorite });
  } catch (error) {
    console.error("Failed to update favorite:", error.message);
    res.status(500).json({ error: "Failed to update favorite" });
  }
});

app.patch('/', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const { id, site, identifierType, identifier, password, category, favorite } = req.body;
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
          password: encrypt(password),
          category: getCategory(category),
          favorite: favorite === true,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Password entry not found" });
    }

    await recordActivity(userId, 'updated', { id });
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
    await recordActivity(userId, 'deleted', { id });
    res.send({ success: true, result: deleteResult })
  } catch (error) {
    console.error("Failed to delete password:", error.message);
    res.status(500).json({ error: "Failed to delete" });
  }
})

app.get('/activity', async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    const activities = await client.db(dbName).collection('activity')
      .find({ userId }, { projection: { _id: 0, userId: 0 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    res.json(activities);
  } catch (error) {
    console.error("Failed to fetch activity:", error.message);
    res.status(500).json({ error: "Failed to fetch activity" });
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
