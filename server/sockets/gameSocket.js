const { startGame } = require('../controllers/gameController');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('joinRoom', async (roomId, username) => {
      socket.join(roomId);
      const { questions, room } = await startGame(roomId);
      io.to(roomId).emit('startGame', { questions, room });
    });

    socket.on('submitAnswer', async (roomId, userId, answer) => {
      const result = await submitAnswer(roomId, userId, answer);
      io.to(roomId).emit('updateGame', result);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
