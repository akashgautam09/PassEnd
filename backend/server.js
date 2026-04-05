require('dotenv').config()
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const { encrypt, decrypt } = require('./crypto');
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173",
  "https://passend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}))

// Connection URL
const client = new MongoClient(process.env.MONGO_URI);

// Database Name
const dbName = 'PassEnd';

client.connect()
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({ userId: userId }).toArray();
    // Decrypt the passwords before sending to React
    const decryptedPasswords = findResult.map(item => {
      return {
        ...item,
        site: decrypt(item.site),
        username: decrypt(item.username),
        password: decrypt(item.password)
      }
    });
    res.json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.post('/', async (req, res) => {
  try {
    const passwordData = req.body;
    passwordData.site = encrypt(passwordData.site);
    passwordData.username = encrypt(passwordData.username);
    passwordData.password = encrypt(passwordData.password);
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(passwordData);
    res.send({ success: true, result: insertResult })
  } catch (error) {
    res.status(500).json({ error: "Failed to save" });
  }
});

app.delete('/', async (req, res) => {
  const { id, userId } = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const deleteResult = await collection.deleteOne({ id: id, userId: userId });
  res.send({ success: true, result: deleteResult })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
