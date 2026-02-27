const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

// Connection URL
const client = new MongoClient(process.env.MONGO_URI);

// Database Name
const dbName = 'PassEnd';
client.connect();

app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

app.post('/', async (req, res) => {
  const passwords = req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const insertResult = await collection.insertOne(passwords);
  res.send({ success: true, result: insertResult })
})

app.delete('/', async (req, res) => {
  const passwords = req.body
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const deletedResult = await collection.deleteOne(passwords);
  res.send({ success: true, result: deletedResult })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
