const Question = require('../models/Question');

const getRandomQuestions = async (count = 5) => {
  const questions = await Question.aggregate([{ $sample: { size: count } }]);
  return questions;
};

module.exports = {
  getRandomQuestions,
};
