const verify = require('../middleware/authToken')
const message = require('../models/message')
const mongoose = require('mongoose')
const express = require('express')
const router  = express.Router()
const user = require('../models/modelUser.js')
const uuid = require('uuid')

module.exports = function (socketIO) {

    
    let users = []

    function emitMessageToUsers(message){
        socketIO.emit('message', message);
        // TODO: Eventually filter, so that message will be sent only to the users that should receive it.
        // Currently everyone receives the message
        // console.log(users,message)
        // users.filter(user => (user.userId === message.sender || user.userId === message.receiver))
    }

    socketIO.on('connection', (socket) => {
        console.log(`${socket.id} user just connected!`)  

        socketIO.emit('new user', "A user connected");

        socket.on("newUser", data => {
            let user = {userId: data.userId, userSocket: socket}
            users.push(user);
        })
    
        socket.on('disconnect', () => {
        console.log('A user disconnected');
          users = users.filter(user => user.userSocket.id !== socket.id)
        socket.disconnect()
        });
    });

    router.get('/contacts', verify, async (req, res) => {

        const token = req.header('x-auth-token')

        let currentUserToken = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));
        let currentUser = await user.findOne({ email: currentUserToken.userEmail})        

        let responseObj = {'currentUser': 
            {
                'userId': currentUser.userId,
                'email': currentUser.email,
            }
        }

        user.find({}, function(err,users) {
            var userMap = []

            users.forEach(function(user) {
                userMap.push({
                    senderName: user.email,
                    sender: user.userId
                })
            })

            responseObj['users'] = userMap;

            res.status(200).json(responseObj);
        })

        // For testing use with 2 users only
        // res.status(200).json([
        //     {senderName: 'Red', sender: '19'},
        //     {senderName: 'Blue', sender: '24'},
        // ])
    })

    router.get('/messages', verify, async (req, res) =>{
        const token = req.header('x-auth-token')

        let currentUserToken = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));
        const currentUser = await user.findOne({ email: currentUserToken.userEmail})

        message.find({}, function(err,messages) {
            var messagesMap = []

            messages.forEach(function (singleMessage) {
                if( (singleMessage.sender == currentUser.userId && singleMessage.receiver == req.query.sender)
                || (singleMessage.sender == req.query.sender && singleMessage.receiver == currentUser.userId)){
                    messagesMap.push(singleMessage);
                }
            })
            res.status(200).json(messagesMap)
            
        })
    })

    router.post('/sendMessage', async (req, res)=>{
        const token = req.header('x-auth-token')
        let currentUserToken = JSON.parse(Buffer.from(token.split(".")[1], "base64url"));

        const currentUser = await user.findOne({ email: currentUserToken.userEmail})
        const targetUser = await user.findOne({ userId: req.body.receiver})
        
        
        if (currentUser && targetUser){
            const newMessage = new message({
                id : uuid.v4(),
                sender: currentUser.userId,
                senderName: currentUser.email,
                receiver: targetUser.userId,
                message: req.body.message, 
                date : req.body.date,
            })
            newMessage.save()
            emitMessageToUsers(newMessage)
            res.status(200).json({msg : "Message sent"})
        }else{
            res.status(200).json({msg : "Ur sent to brazil"})
        }
    })

    return router
}