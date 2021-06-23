const mongoose = require('mongoose')
const generSchema = new mongoose.Schema({
    genername: {
        type: String,
        required: true
    }
})

// generSchema.pre('remove', function (next) {
//     Book.find({ gener: this.id }, (err, books) => {
//         if (err) {
//             next(err)
//         } else if (books.length > 0) {
//             next(new Error('This gener still has books'))
//         } else {
//             next()
//         }
//     })
// })


module.exports = mongoose.model('Geners', generSchema)