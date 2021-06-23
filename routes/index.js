const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Gener = require('../models/geners')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const books = await Book.find({});
    console.log("a",);
    res.render('index', {
      books: books,
      user:req.session.passport.user,
    })
  } catch {
    res.redirect('/')
  }
})

router.post('/searchBook',ensureAuthenticated, async (req, res) => {
  let{bookName}=req.body;
  try {
    const books = await Book.find({title: { $regex: bookName }});
    res.render('index', {
      books: books,
      user:req.session.passport.user,
    })
  } catch {
    res.redirect('/')
  }
})

module.exports = router