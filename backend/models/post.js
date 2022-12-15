const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postId: String,
    image : [String],
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    location:{
        type: String
    },
    price:{
        type: Number
    },
    author:{
        type: String
    },
    phoneNum:{
        type: String
    },
    createdAt:{
        type: Date,
        default: () => Date.now(),
        immutable : true
    },
    category:{
        type: String
    }
})

module.exports = mongoose.model('posts', postSchema)