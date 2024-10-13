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

const getPoems = async (req, res) => {
  // Get the page number and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  try {
    // Fetch poems with pagination
    const poems = await Poem.find({})
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit);

    // Get the total count of poems for pagination info
    const totalPoems = await Poem.countDocuments({});

    // Send the poems along with pagination info
    res.status(200).json({
      poems,
      totalPoems,
      totalPages: Math.ceil(totalPoems / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching poems' });
  }
};



// Post a new poem
const postPoem = async (req, res) => {
  try {
    const newPoem = await Poem.insertMany(req.body)
    res.status(200).json(newPoem)
  } catch (error) {
    res.status(400).json({ error: 'Error adding poem' });
  }
};

module.exports = {
    getAllPoems,
    getPoems,
    postPoem
}
