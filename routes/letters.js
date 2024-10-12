const express = require('express')

const {
    getAllLetters,
    getLetters,
    postLetter
} = require('../controllers/letterController')


const router = express.Router()

// GET all letters
router.get('/', getLetters)
// POST a new letter
router.post('/', postLetter)

module.exports = router