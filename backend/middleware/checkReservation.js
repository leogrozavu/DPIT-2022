const express = require('express')
const router  = express.Router()
const user = require('../models/modelUser.js')
const reservationSchema = require('../models/reservation')

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')
    let payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));
    const existCheck = await user.findOne({email : payload.userEmail})
    const reservationUser = await reservationSchema.findOne({from : existCheck.userId})

    try {
       if(reservationUser.status !== "pending")next()
    } catch (error) {
        return res.status(403).json({error : 'you already made a reservation'})
    }
}