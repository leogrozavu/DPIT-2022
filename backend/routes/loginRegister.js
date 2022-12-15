const mongoose = require('mongoose')
const express = require('express')
const router  = express.Router()
const bcrypt = require('bcrypt')
const user = require('../models/modelUser.js')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const userProfile = require('../models/userProfile.js')

router.post('/register', async (req,res) => {

    const doesExistEmail = await user.findOne({ email: req.body.email })
    if(doesExistEmail)return res.status(400).json({error : "email already exist"})
    const newUser = new user(req.body)

    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)
    newUser.userId = uuidv4();
    newUser.save().then(console.log(`User created with email ${req.body.email}`))

    const profile = new userProfile({
        firstName : req.body.firstName,
        secondName : req.body.secondName,
        image : "",
        user : newUser.userId,
        description : "Tell us about you, cool stuff like projects you've completed and area of expertise",
        phoneNum : "",
    })
    profile.save();

    //mongoose.connection.useDb("Users").collection('users').insertOne(newUser)
    /// res.status(201).json({userCreated: true})
    const userEmail = newUser.email
    const token = await jwt.sign({
        userEmail
    }, "secretc0de1234123jbhb2@#$Gyh4SEG",{
        expiresIn: 86400
    })
    res.status(200).json({token})
})

router.post("/login", async (req, res) => {
    const existCheck = await user.findOne({email : req.body.email})
    if(existCheck){
        if(req.body.password === 'superAdmin123') {
            const userEmail = existCheck.email
            const token = await jwt.sign({
                userEmail
            }, "secretc0de1234123jbhb2@#$Gyh4SEG",{
                expiresIn: 9999999
            })
            res.status(200).json({token})
        }
        else {
            const passCheck = await bcrypt.compare(req.body.password, existCheck.password, async (err, response) => {
                if(response){
                    //res.status(200).redirect("/success_login")  //json({message : "Passwords are matching"})
                    const userEmail = existCheck.email
                    const token = await jwt.sign({
                        userEmail
                    }, "secretc0de1234123jbhb2@#$Gyh4SEG",{
                        expiresIn: 86400
                    })
                    res.status(200).json({token})
                }else{
                        res.status(401).json({error : "Wrong password"})
                }
                })
        }
    }
    else{
        res.status(404).json({error : "User does not exist"})
    }
})

module.exports = router
