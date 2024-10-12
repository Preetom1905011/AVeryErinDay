const Letter = require('../models/letterModel');

// Get all letters, sorted by time
const getAllLetters = async (req, res) => {
  try {
    const letters = await Letter.find({}).sort({ time: -1 });
    res.status(200).json({ letters });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching letters' });
  }
};

// Post a new letter
const postLetter = async (req, res) => {
  try {
    const newLetter = await Letter.create(req.body)
    res.status(200).json(newLetter)
  } catch (error) {
    res.status(400).json({ error: 'Error adding letter' });
  }
};

module.exports = {
    getAllLetters,
    postLetter
}
