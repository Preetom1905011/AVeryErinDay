const Poem = require('../models/poemModel');

// Get all poems, sorted by time
const getAllPoems = async (req, res) => {
  try {
    const poems = await Poem.find({}).sort({ time: -1 });
    res.status(200).json({ poems });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching poems' });
  }
};

// Post a new poem
const postPoem = async (req, res) => {
  try {
    const newPoem = await Poem.create(req.body)
    res.status(200).json(newPoem)
  } catch (error) {
    res.status(400).json({ error: 'Error adding poem' });
  }
};

module.exports = {
    getAllPoems,
    postPoem
}
