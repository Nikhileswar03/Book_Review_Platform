const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// A simple welcome route for the API root
app.get('/', (req, res) => {
    res.send('BookWise API is running...');
});

// Mount routers
// In a full implementation, you would have separate route files for users, auth, reviews, etc.
app.use('/api/books', require('./routes/api/books'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));