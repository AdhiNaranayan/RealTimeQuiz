const Room = require('../models/Room');
const User = require('../models/Users'); 

const createRoom = async (req, res) => {
  const { roomName, username } = req.body;

  if (!roomName || !username) {
    return res.status(400).json({ message: 'Room name and username are required' });
  }

  try {
    const user = await User.create({ username });
    const room = await Room.create({
      name: roomName,
      users: [user._id],
      ActiveStatus:true,
      IfDeleted:false
    });

    res.status(201).json({ room });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error creating room', error: err.message });
  }
};

const joinRoom = async (req, res) => {
  const { roomId, username } = req.body;

  if (!roomId || !username) {
    return res.status(400).json({ message: 'Room ID and username are required' });
  }

  try {
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.users.length >= 2) {
      return res.status(400).json({ message: 'Room is full' });
    }
    
    const user = await User.create({ username });
    room.users.push(user._id);
    await room.save();

    res.status(200).json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Error joining room', error: err.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ActiveStatus:true,IfDeleted:false}).populate('users', 'username');
    res.status(200).json({ rooms , TotalRooms:rooms.length});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms', error: err.message });
  }
};


const startGame = async (req, res) => {
  const { roomId } = req.params;
  const { questions } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Questions are required to start the game' });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.gameState !== 'waiting') {
      return res.status(400).json({ message: 'Game already in progress or finished' });
    }

    room.gameState = 'in-progress';
    room.questions = questions; // Store questions in the room
    room.startTime = new Date(); // Track when the game started
    await room.save();

    // Emit event to clients if using Socket.IO
    // io.to(roomId).emit('gameStarted', { questions });

    res.status(200).json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Error starting game', error: err.message });
  }
};



const submitAnswer = async (req, res) => {
  
  const { roomId } = req.params;
  const { userId, questionIndex, answer } = req.body;

  if (!userId || questionIndex === undefined || answer === undefined) {
    return res.status(400).json({ message: 'User ID, question index, and answer are required' });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room || room.gameState !== 'in-progress') {
      return res.status(400).json({ message: 'Game not in progress' });
    }
    if (questionIndex >= room.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }
    const correctAnswer = room.questions[questionIndex].answer;
    const isCorrect = answer === correctAnswer;

    let userAnswer = room.userAnswers.find(ua => ua.userId.toString() === userId.toString());
    if (!userAnswer) {
      userAnswer = { userId, answers: [] };
      room.userAnswers.push(userAnswer);
    }
    
    userAnswer.answers.push({ questionIndex, answer, isCorrect });
    await room.save();

    res.status(200).json({ isCorrect });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting answer', error: err.message });
  }
};



const endGame = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId).populate('users');
    if (!room || room.gameState !== 'in-progress') {
      return res.status(400).json({ message: 'Game is not in progress or already ended' });
    }

    // Calculate final scores
    room.userAnswers.forEach(async (userAnswer) => {
      const user = await User.findById(userAnswer.userId);
      if (user) {
        const score = userAnswer.answers.reduce((total, answer) => {
          return total + (answer.isCorrect ? 10 : 0); // Example scoring logic
        }, 0);
        user.score = score;
        await user.save();
      }
    });

    room.gameState = 'finished';
    room.endTime = new Date();
    await room.save();

    // Optionally, delete the room or perform cleanup
    // await Room.findByIdAndDelete(roomId);

    // Emit event to clients if using Socket.IO
    // io.to(roomId).emit('gameEnded', { scores: room.userAnswers });

    res.status(200).json({ message: 'Game ended successfully', room });
  } catch (err) {
    res.status(500).json({ message: 'Error ending game', error: err.message });
  }
};



const deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
   
    room.ActiveStatus = false,
    room.IfDeleted = true
    await room.save();

    // Optionally notify clients if the room is deleted
    // io.to(roomId).emit('roomDeleted', { message: 'The room has been deleted' });

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room', error: err.message });
  }
};


module.exports = {
  createRoom,
  joinRoom,
  startGame,
  getRooms,
  submitAnswer,
  endGame,
  deleteRoom
};
