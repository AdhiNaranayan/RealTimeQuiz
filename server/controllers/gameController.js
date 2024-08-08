const Room = require('../models/Room');
const User = require('../models/Users');
const { getRandomQuestions } = require('../utils/questions');

const startGame = async (roomId) => {
  const room = await Room.findById(roomId).populate('users');
  if (room && room.users.length === 2) {
    const questions = await getRandomQuestions();
    room.gameState = 'in-progress';
    await room.save();
    return { questions, room };
  }
  throw new Error('Game cannot be started');
};

const submitAnswer = async (roomId, userId, answer) => {
  const user = await User.findById(userId);
  const room = await Room.findById(roomId);

  if (room.gameState !== 'in-progress') {
    throw new Error('Game is not in progress');
  }

  // Compare the answer and update score
  // Assume we keep track of the current question index
  const currentQuestion = await getCurrentQuestion(roomId);
  if (answer === currentQuestion.answer) {
    user.score += 10;
    await user.save();
  }

  // Proceed to the next question or end game
  const nextQuestion = await getNextQuestion(roomId);
  if (nextQuestion) {
    return { nextQuestion };
  } else {
    room.gameState = 'finished';
    await room.save();
    return { result: 'Game Over', room };
  }
};

module.exports = {
  startGame,
  submitAnswer,
};
