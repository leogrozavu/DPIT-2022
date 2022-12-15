const mongoose = require('mongoose')


const userProfileSchema = new mongoose.Schema({

    firstName:{
        type: String,
        trim: true
    },
    secondName:{
        type: String,
        trim: true
    },
    image : String,
    user: String,
    description:{
        type: String
    },
    phoneNum:{
        type: String
    },
    userId: Number,
})

module.exports = mongoose.model('userProfile', userProfileSchema)