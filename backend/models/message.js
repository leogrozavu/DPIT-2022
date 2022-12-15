const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    id: String,
    referencePost: Number,
    sender: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    attachments: [String],
    date:{
        type: Date,
        default: () => Date.now(),
        immutable : true
    }
})

module.exports = mongoose.model('message', messageSchema)