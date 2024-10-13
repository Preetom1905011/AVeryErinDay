const express = require('express')

const {
    getAllPoems,
    getPoems,
    postPoem
} = require('../controllers/poemController')


const router = express.Router()

// GET all poems
router.get('/', getPoems)
// POST a new poem
router.post('/', postPoem)

module.exports = router