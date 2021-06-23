const express = require('express')
const router = express.Router()
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/',ensureAuthenticated, async (req, res) => {
  let users =  await User.find({permissions:1});
  res.render('publiser/index', { title: 'Publiser', users:users, user:req.session.passport.user, })
})

// New Geners route
router.get('/new',ensureAuthenticated, (req, res) => {
  res.render('publiser/new',{errors:[], user:req.session.passport.user,})
})

// New Geners route
router.post('/new', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('publiser/new', {
      errors,
      name,
      email,
      password,
      password2,
      user:req.session.passport.user,
    });
  } else {
    User.findOne({ email: email,permissions:1 }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('publiser/new', {
          errors,
          name,
          email,
          password,
          password2,
          user:req.session.passport.user,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          permissions:1
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/publiser');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


router.get('/view/:id',ensureAuthenticated, async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      res.render('publiser/edit', { name:user.name, email:user.email, user:req.session.passport.user,})
  } catch {
      res.redirect('/publiser')
  }
})

router.get('/delete/:id',ensureAuthenticated, async (req, res) => {
  try {
      await User.findByIdAndRemove(req.params.id);
      res.redirect('/publiser')
  } catch {
      res.redirect('/publiser')
  }
})

module.exports = router