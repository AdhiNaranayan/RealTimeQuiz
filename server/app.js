require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const gameRoutes = require('./routes/gameRoutes');
const UserRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

connectDB();

app.use('/api/rooms', roomRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/user', UserRoutes);

module.exports = app;
