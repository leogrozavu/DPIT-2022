const express = require('express')
const mongoose = require('mongoose')
//const dbConnection = require('./db/connection')
//const loginRegister = require('./routes/loginRegister')
const user = require('../models/modelUser.js')
const sendMail = require('../middleware/sendEmail')
const bcrypt = require('bcrypt')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const jwtSecret = 'secretc0de1234123jbhb2@#$Gyh4SEG'

router.post('/forgot-password', async (req,res)=>{
    const existCheck = await user.findOne({email : req.body.email})
    if(existCheck){
        const secret = jwtSecret + existCheck.password
        const payload = {
            email: existCheck.email,
            id: existCheck.userId,
        }
        const token = jwt.sign(payload, secret, {expiresIn: '30m'})
        const link = `http://localhost:3000/reset-password/${existCheck.userId}/${token}`
        sendMail(existCheck.email, link)
        res.send(`Email sent to ${existCheck.email}`)
    }
    else{
        res.status(404).json({error : "User does not exist"})
    }
})

router.get('/reset-password/:id/:token', async (req,res)=>{
    const {id, token} = req.params

    const existCheck = await user.findOne({userId : id})
    if(existCheck){
        const secret = jwtSecret + existCheck.password
        const payload = jwt.verify(token, secret)
       //here must be rendered reset password page with confirm password also
    }
    else{
        res.status(404).json({error : "User does not exist"})
    }
})

router.post('/reset-password/:id/:token', async (req,res)=>{
    const {id, token} = req.params
    const newPassword = req.body.password
    const existCheck = await user.findOne({userId : id})
    if(existCheck){
        const secret = jwtSecret + existCheck.password
        const payload = await jwt.verify(token, secret)
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(newPassword, salt)
        await user.findOneAndUpdate({password : existCheck.password,}, {password : hashedPass,})
        res.status(400).send('Password changed')
    }
    else{
        res.status(404).json({error : "User does not exist"})
    }
})

module.exports = router