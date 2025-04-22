const express = require('express');
const cookieParser= require('cookie-parser');
const app = express();
require('dotenv').config();
const cors=require('cors')

// Middleware to parse JSON
app.use(cookieParser())
app.use(express.json());

app.use(cors({
  origin:'http://localhost:5174',
  methods: 'GET,POST,PUT,DELETE',
  credentials:true
}))
const mongoose = require('mongoose');
const apiRouter = require('./Routes');


// Replace with your actual connection string
//const MONGO_URI = 'mongodb+srv://sandhyababu08:SO8LStVepC9UYkI3@cluster0.94yfr44.mongodb.net/'; // or your MongoDB Atlas URI

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.use('/api',apiRouter);



// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
