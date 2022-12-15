const mongoose = require('mongoose')

const Reservation = new mongoose.Schema({
    from:{
        type: String,
    },
    to:{
        type: String
    },
    date:{
        year: Number,
        month: Number,
        day: Number
    },
    status:{
        type: String
    },
    postId:{
        type: String
    },
    reservationId: String
})

module.exports = mongoose.model('reservation', Reservation)