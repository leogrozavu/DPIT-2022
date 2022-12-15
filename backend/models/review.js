const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    reviews:[{
        rating: Number,
        comment: String
    }],
    id: String
})

module.exports = mongoose.model('reviews', reviewSchema)