const express = require('express');
const cors=require('cors')
const cookieParser= require('cookie-parser');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
const apiRouter = require('./Routes');

// Middleware to parse JSON

app.use(cors({
  origin:'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials:true,
}))


app.use(cookieParser());
app.use(express.json());





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

app.post('/test-body', (req, res) => {
  console.log('Received:', req.body);
  res.json({ received: req.body });
});

// Start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
