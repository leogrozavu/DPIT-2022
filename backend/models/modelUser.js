const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        trim: true
    },
    userId: String,
})

module.exports = mongoose.model('user', userSchema)