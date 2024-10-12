const express = require('express')

const {
    getAllLetters,
    postLetter
} = require('../controllers/letterController')


const router = express.Router()

// GET all letters
router.get('/', getAllLetters)
// POST a new letter
router.post('/', postLetter)

module.exports = router