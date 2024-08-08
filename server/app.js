require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/rooms', roomRoutes);
app.use('/api/game', gameRoutes);

module.exports = app;
