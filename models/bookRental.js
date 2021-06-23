const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Books'
  },
  timeRental: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
})

module.exports = mongoose.model('BookRental', bookSchema)
