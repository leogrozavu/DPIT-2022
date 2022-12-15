//const userProfileSche = require('../models/userProfile')
const mongoose = require('mongoose')
const express = require('express')
const router  = express.Router()
const user = require('../models/modelUser.js')
const jwt = require('jsonwebtoken')
const userProfile = require('../models/userProfile')
const db = mongoose.connection
const verify = require('../middleware/authToken')

router.post('/create-profile', verify, async (req, res)=>{
    const token = req.header('x-auth-token')
    let payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));
    const existCheck = await user.findOne({email : payload.userEmail})
    const profileCheck = await userProfile.findOne({user : existCheck.userId})
    if(profileCheck)return res.status(409).json({msg : "profile already created"})
    if(existCheck){
        const profile = new userProfile({
            firstName : req.body.firstName,
            secondName : req.body.secondName,
            image : req.body.image,
            user : existCheck.userId,
            description : req.body.description,
            phoneNum : req.body.phoneNum,
        })
        profile.save()
        res.status(200).json({msg : "profile created"})
    }
    else{
        res.status(409).json({error : "User does not exist"})
    }
})

router.post('/create-profile/modify', verify, async (req, res)=>{
    const token = req.header('x-auth-token')
    let payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));
    const existCheck = await user.findOne({email : payload.userEmail})
    const profileCheck = await userProfile.findOne({user : existCheck.userId})
    if(profileCheck){
        await userProfile.findOneAndUpdate(
            {user : existCheck.userId},
            {
            firstName : req.body.firstName,
            secondName : req.body.secondName,
            image : req.body.image,
            description : req.body.description,
            phoneNum : req.body.phoneNum
            }
        )
        return res.status(200).json({msg : "profile updated"})
    }
    if(existCheck){
        return res.status(409).json({msg : "profile wasn't created"})
    }
})

module.exports = router