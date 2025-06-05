// server.js or app.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB (if you're using mongoose, otherwise skip this)
mongoose.connect('mongodb://localhost:27017/goofdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// GitHub webhook route
app.post('/github-webhook', (req, res) => {
  console.log('📬 GitHub Webhook received!');
  console.log('Payload:', req.body);
  res.status(200).send('Webhook received');
});

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
