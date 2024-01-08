// import from packages...
const express = require("express");

// import from other files...
const UserInfo = require("../models/user_info");
const JwtHandler = require("../secureme/jwthandler");
const { userInfo } = require("os");
const { json } = require("stream/consumers");

const handshakeRouter = express.Router();
const jwtHandler = new JwtHandler();
handshakeRouter.post("/request", async(req, res)=>{
    try {
        const {token} = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);

        const {userId, requestingUserId} = req.body;
        console.log(userId);
        console.log(requestingUserId);

        let userInfo = await UserInfo.findById(userId);
        if (!userInfo) {
            res.status(404).json({ error: 'User not found' });
            return null;
        }
        
        let requestingUserInfo  = await UserInfo.findById(requestingUserId);
        if (!requestingUserInfo) {
            res.status(404).json({ error: 'Requested User not found' });
            return null;
        }
        
        const fieldName1 = "handshakeRequests";
        const fieldName2 = "handshakePendings";
        const fieldName3 = "friends";
        
        if(userInfo[fieldName1].includes(requestingUserId)) {
            res.status(500).json({"error" : "Can not perform this action. Users are already in handshake waiting list"});
            return null;
        }
        if(userInfo[fieldName3].includes(requestingUserId)) {
            res.status(500).json({"error" : "Can not perform this action. Requested user is already in user's friend list!"});
            return null;
        }
        if(requestingUserInfo[fieldName2].includes(userId)) {
            res.status(500).json({"error" : "Can not perform this action. Users are already in handshake waiting list"});
            return null;
        }
        if(requestingUserInfo[fieldName3].includes(userId)) {
            res.status(500).json({"error" : "Can not perform this action. User is already in requested user's friend list!"});
            return null;
        }
        if(!userInfo[fieldName2].includes(requestingUserId)) {
            userInfo[fieldName2].push(requestingUserId);
        }
        if(!requestingUserInfo[fieldName1].includes(userId)) {
            requestingUserInfo[fieldName1].push(userId);
        }
        await userInfo.save();
        await requestingUserInfo.save();
        res.json({message : "Request sent from " + userInfo["email"] + " to " + requestingUserInfo["email"] });
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
});

handshakeRouter.post("/accept", async(req, res)=>{
    try {
        const {token} = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);

        const {userId, acceptingUserId} = req.body;
        console.log(userId);
        console.log(acceptingUserId);

        let userInfo = await UserInfo.findById(userId);
        if (!userInfo) {
            res.status(404).json({ error: 'User not found' });
            return null;
        }
        
        let acceptingUserInfo  = await UserInfo.findById(acceptingUserId);
        if (!acceptingUserInfo) {
            res.status(404).json({ error: 'Pending User not found' });
            return null;
        }
        
        const fieldName1 = "handshakeRequests";
        const fieldName2 = "handshakePendings";
        const fieldName3 = "friends";

        if(userInfo[fieldName2].includes(acceptingUserId) && acceptingUserInfo[fieldName1].includes(userId)){
            if(userInfo[fieldName2].includes(acceptingUserId)) {
                userInfo[fieldName2].pull(acceptingUserId);
            }
            if(userInfo[fieldName1].includes(acceptingUserId)) {
                userInfo[fieldName1].pull(acceptingUserId);
            }
            if(acceptingUserInfo[fieldName1].includes(userId)) {
                acceptingUserInfo[fieldName1].pull(userId);
            }
            if(acceptingUserInfo[fieldName2].includes(userId)) {
                acceptingUserInfo[fieldName2].pull(userId);
            }
            if(!userInfo[fieldName3].includes(acceptingUserId)) {
                userInfo[fieldName3].push(acceptingUserId);
            }
            if(!acceptingUserInfo[fieldName3].includes(userId)) {
                acceptingUserInfo[fieldName3].push(userId);
            }
            await userInfo.save();
            await acceptingUserInfo.save();
            res.json({message : userInfo["email"] + " accepted handshake of " + acceptingUserInfo["email"] });
        }
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
});

handshakeRouter.post("/cancel", async(req, res)=>{
    try {
        const {token} = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);

        const {userId, requestingUserId} = req.body;
        console.log(userId);
        console.log(requestingUserId);
        let userInfo = await UserInfo.findById(userId);
        if (!userInfo) {
            res.status(404).json({ error: 'User not found' });
            return null;
        }
        
        let requestingUserInfo  = await UserInfo.findById(requestingUserId);
        if (!requestingUserInfo) {
            res.status(404).json({ error: 'Requested User not found' });
            return null;
        }
        
        const fieldName1 = "handshakeRequests";
        const fieldName2 = "handshakePendings";

        if(userInfo[fieldName2].includes(requestingUserId)) {
            userInfo[fieldName2].pull(requestingUserId);
        }
        if(requestingUserInfo[fieldName1].includes(userId)) {
            requestingUserInfo[fieldName1].pull(userId); 
        }
        await userInfo.save();
        await requestingUserInfo.save();
        res.json({message : "Request from " + userInfo["email"] + " to " + requestingUserInfo["email"] + " is cancelled"});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
});

handshakeRouter.post("/removeFriend", async(req, res)=>{ 
    try {
        const { token } = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);

        const {userId, friendUserId} = req.body;
        console.log(userId);
        console.log(friendUserId);
        let userInfo = await UserInfo.findById(userId); 
        if (!userInfo) {
            res.status(404).json({ error: 'User not found' });
            return null;
        }
        
        let friendUserInfo  = await UserInfo.findById(friendUserId);
        if (!friendUserInfo) {
            res.status(404).json({ error: 'Requested User not found' });
            return null;
        }
        
        const fieldName1 = "handshakeRequests";
        const fieldName2 = "handshakePendings";
        const fieldName3 = "friends";

        if(userInfo[fieldName3].includes(friendUserId)) {
            userInfo[fieldName2].pull(friendUserId);
        }
        if(friendUserInfo[fieldName3].includes(userId)) {
            friendUserInfo[fieldName3].pull(userId);
        }
        await userInfo.save();
        await friendUserInfo.save();
        res.json({message : "From " + userInfo["email"] + " friend list " + friendUserInfo["email"] + " is removed"});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
});

module.exports = handshakeRouter;
