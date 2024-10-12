const express = require('express')

const {
    getAllPoems,
    postPoem
} = require('../controllers/poemController')


const router = express.Router()

// GET all poems
router.get('/', getAllPoems)
// POST a new poem
router.post('/', postPoem)

module.exports = router