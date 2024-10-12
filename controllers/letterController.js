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

// Get all letters, sorted by time, with pagination
const getLetters = async (req, res) => {
  // Get the page number and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    // Fetch letters with pagination
    const letters = await Letter.find({})
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit);

    // Get the total count of letters for pagination info
    const totalLetters = await Letter.countDocuments({});

    // Send the letters along with pagination info
    res.status(200).json({
      letters,
      totalLetters,
      totalPages: Math.ceil(totalLetters / limit),
      currentPage: page,
    });
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
    getLetters,
    postLetter
}
