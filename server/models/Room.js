const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  gameState: { type: String, default: 'waiting' },  // can be 'waiting', 'in-progress', 'finished'
  questions: [{  // Add this field
    question: String,
    options: [String],
    answer: String
  }],
  userAnswers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answers: [
        {
          questionIndex: Number,
          answer: String,
          isCorrect: Boolean
        }
      ]
    }
  ],
  startTime: Date,
  endTime: Date,
  ActiveStatus: Boolean,
  IfDeleted: Boolean
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
