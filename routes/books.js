const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Gener = require('../models/geners')
const BookRental = require('../models/bookRental')
const FeedBack = require('../models/feedBack')
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', ensureAuthenticated, async (req, res) => {

  try {
    const books = await Book.find({});
    res.render('books/index', {
      books: books,
      user: req.session.passport.user,
    })
  } catch {
    res.redirect('/')
  }
})

// New Book Route
router.get('/new', ensureAuthenticated, async (req, res) => {
  try {
    const geners = await Gener.find({})
    res.render('books/new', {
      geners: geners,
      book: new Book(),
      user: req.session.passport.user
    })
  } catch {
    res.redirect('/books')
  }
})

// Create Book Route
router.post('/new', ensureAuthenticated, async (req, res) => {
  let{title,gener,publishDate,pageCount,description,image}=req.body;
  const book = new Book({
    title: title,
    gener: gener,
    publishDate: new Date(publishDate),
    pageCount: pageCount,
    description: description,
    coverImageType:'',
    author:req.session.passport.user._id
  })
  if(image!=''){
    saveCover(book, image);
  }  
  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`/books`)
  } catch(error) {
      const geners = await Gener.find({})
      res.render('books/new', {
        geners: geners,
        book: new Book(),
        user: req.session.passport.user
      })
  }
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const geners = await Gener.find({})
    res.render('books/edit', {
      book: book,
      geners: geners,
      user: req.session.passport.user
    })
  } catch {
    res.redirect('/books')
  }
})

router.post('/edit', ensureAuthenticated, async (req, res) => {
  let book
  let{title,gener,publishDate,pageCount,description,image,_id}=req.body;
  try {
    book = await Book.findById(_id)
    book.title = title,
      book.gener = gener,
      book.publishDate = new Date(publishDate),
      book.pageCount = pageCount,
      book.description = description
      if(image!=''){
        saveCover(book, image);
      }  
    await book.save()
    res.redirect(`/books`)
  } catch(error) {
    if (book == null) {
      res.redirect('/')
    } else {
      const geners = await Gener.find({})
      res.render('books/edit', {
        book: book,
        geners: geners,
        errorMessage: 'Error updating Authod',
        user: req.session.passport.user
      })
    }
  }
})

router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id);
    res.redirect('/books')
  } catch {
    res.redirect('/books')
  }
})



router.get('/detail/:id', ensureAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const geners = await Gener.find({})
    const feedBacks = await FeedBack.find({bookId:book._id})
    res.render('books/detail', {
      book: book,
      geners: geners,
      user: req.session.passport.user,
      feedBacks:feedBacks
    })
  } catch {
    res.redirect('/')
  }
})


// Create Book Route
router.post('/rating', ensureAuthenticated, async (req, res) => {
  try {
    let { review,star,bookId} = req.body;
    let curentUser = req._passport.session.user;
    let book = await Book.find({_id:bookId});
    const geners = await Gener.find({})
    let mess ;
    if (!review || !star ) {
      mess = 'Please enter all fields';
    }
  
    if (mess) {
      res.render('books/detail', {
        book: book,
        geners: geners,
        user: curentUser,
        mess:mess
      })
    } else {
      const feedBack = new FeedBack({
        bookId: bookId,
        userReview: curentUser._id,
        rating:star,
        review:review,
        userName:curentUser.name,
        bookName:book[0].title
      })
      await feedBack.save();
      res.redirect(`/`)
    }
  } catch (error) {
    res.redirect(`/`)
  }
})

function saveCover(book, coverEncoded){
  if (coverEncoded == null) return 
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}
module.exports = router