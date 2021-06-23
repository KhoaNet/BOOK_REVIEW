const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Gener = require('../models/geners')
const BookRental = require('../models/bookRental')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const BookRental = await BookRental.find({});
    res.render('index', {
      books: books,
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/home',ensureAuthenticated, async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('index', {
      books: books,
    })
  } catch {
    res.redirect('/')
  }
})


module.exports = router