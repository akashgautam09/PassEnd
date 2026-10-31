require('dotenv').config()
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const { clerkMiddleware, getAuth } = require('@clerk/express');
const { encrypt, decrypt, validateEncryptionKey } = require('./crypto');
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const allowedOrigins = [
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
const client = new MongoClient(process.env.MONGO_URI);

// Database Name
const dbName = 'PassEnd';

validateEncryptionKey();

client.connect()
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

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
    const allowedIdentifierTypes = ['username', 'email', 'phone'];
    if (
      typeof id !== 'string' ||
      typeof site !== 'string' ||
      typeof identifier !== 'string' ||
      typeof password !== 'string' ||
      !allowedIdentifierTypes.includes(identifierType) ||
      !site.trim() ||
      !identifier.trim() ||
      !password
    ) {
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
    res.send({ success: true, result: deleteResult })
  } catch (error) {
    console.error("Failed to delete password:", error.message);
    res.status(500).json({ error: "Failed to delete" });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
