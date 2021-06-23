const express = require('express')
const router = express.Router()
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const Gener = require('../models/geners')
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

router.get('/', ensureAuthenticated, async (req, res) => {
  let geners = await Gener.find();
  res.render('geners/index', {
    title: 'imooc Homepage',
    geners: geners,
    user: req.session.passport.user,
  })

})

// New Geners route
router.get('/new', ensureAuthenticated, (req, res) => {
  let gener = {
    genername: ''
  };
  res.render('geners/new', {
    gener,
    user: req.session.passport.user,
  })
})


router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const gener = await Gener.findById(req.params.id);
    res.render('geners/edit', {
      gener: gener,
      user: req.session.passport.user,
    })
  } catch {
    res.redirect('/geners')
  }
})
router.post('/edit', ensureAuthenticated, async (req, res) => {
  let gener
  try {
    gener = await Gener.findById(req.body._id)
    gener.genername = req.body.genername
    await gener.save()
    res.redirect(`/geners`)
  } catch {
    if (gener == null) {
      res.redirect('/')
    } else {
      res.render('geners/edit', {
        gener: gener,
        errorMessage: 'Error updating Authod',
        user: req.session.passport.user,
      })
    }
  }
})


router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Gener.findByIdAndRemove(req.params.id);
    res.render('geners/edit', {
      gener: gener,
      user: req.session.passport.user,
    })
  } catch {
    res.redirect('/geners')
  }
})

// Create geners
router.post('/new', ensureAuthenticated, async (req, res) => {
  let gener = new Gener({
    genername: req.body.genername
  });
  try {
    await gener.save()
    res.redirect(`/geners`)
  } catch {
    res.render('geners/new', {
      gener: gener,
      errorMessage: 'Error creating Authod',
      user: req.session.passport.user,
    })
  }
})

module.exports = router