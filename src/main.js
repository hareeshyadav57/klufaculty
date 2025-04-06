const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = 5000;

app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.get('/faculties', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('KLEF');
    const collection = db.collection('faculty_data');

    const facultyList = await collection.find().toArray();
    res.json(facultyList);
  } catch (error) {
    console.error('Error fetching faculty data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
