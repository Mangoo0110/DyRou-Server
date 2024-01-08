//import from packages...
const express = require("express");
const UserInfoRouter = express.Router();

// import from files...
const UserInfo = require("../models/user_info");
const JwtHandler = require("../secureme/jwthandler");
const { userInfo } = require("os");

const jwtHandler = new JwtHandler();

UserInfoRouter.post("/updateUserInfo", async (req, res) => {
    console.log("Profile updating");
    try{
        const { token } = req.headers;
        const {
            userId,
            name,
            email,
            occupation,
            personalRoutineId,
            friends,
            events,
            userAvatar,
            flowers,
            handshakeRequests,
            handshakePendings,
            groupRoutines,

        } = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        let user = await UserInfo.findById({_id : userId});
        user["name"] = name;
        user["occupation"] = occupation;
        await user.save();
        res.json({"user" : user,  "msg":"Profile updated"});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
    
});

UserInfoRouter.get("/userSearchByName/:searchedUserName", async (req, res) => {
    try{
        console.log("searching");
        const { searchedUserName } = req.params;
        const { token } = req.headers;
        if(!token){
             res.status(500).json({error : 'Not a authorized client'});
             return;
        } 
        const decodedPayload = jwtHandler.verifyToken(token);
        //console.log(decodedPayload['id']);
        const users = await UserInfo.
                    find({name : { $regex: `^${searchedUserName}`, $options: 'i' },
                    _id: { $ne: decodedPayload["id"] }},
                    {name : 1, occupation : 1, userid : 1, email : 1 },);
        
        res.send({"users" : users,},);
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
    
});

UserInfoRouter.get("/userBriefInfo", async (req, res) => {
    try{
        const { token } = req.headers;
        const {userId} = req.body;
        if(!token){
             res.status(500).json({error : 'Not a authorized client'});
             return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const user = await UserInfo.findById({_id : userId},
                                            { userId: 1, name: 1, occupation: 1, flowers : 1, _id: 0 });
        res.json({"user" : user});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
    
});

UserInfoRouter.post("/userFullInfo", async (req, res) => {
    try{
        console.log("userFullInfo");
        const { token } = req.headers;
        const {userId} = req.body;
        if(!token){
             res.status(500).json({error : 'Not a authorized client'});
             return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const user = await UserInfo.findById({_id : userId});
        res.json({"user" : user});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
    
});

UserInfoRouter.post("/friends", async (req, res) => {
    console.log("friend search");
    try{
        
        const { token } = req.headers;
        const {userId} = req.body;
        if(!token){
            res.status(500).json({error : 'Not a authorized client'});
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const user = await UserInfo.findById({_id : userId});

        const friendPromises = user["friends"].map(async (id) => {
            const friend = await UserInfo.findById(
                {_id: id}, 
                { userId: 1, name: 1, occupation: 1, flowers : 1, _id: 0 });
            console.log(friend);
            return friend;
            });
        const friends = await Promise.all(friendPromises);
        console.log(friends);
        res.json({"friends" : friends});
    } catch (error) {
        res.status(500).json({"error" : error + ""});
    }
    
});

module.exports = UserInfoRouter;