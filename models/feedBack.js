const mongoose = require('mongoose')
const feedBack = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    userReview: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    rating: {
        type: String
    },
    review: {
        type: String
    },
    userName: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    bookName: {
        type: String
    },
})


module.exports = mongoose.model('FeedBacks', feedBack)