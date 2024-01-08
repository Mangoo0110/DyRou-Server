//import from packages...
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

// import from files...
const UserAuth = require("../models/user_auth");
const UserInfo = require("../models/user_info");
const PersonalRoutine = require("../models/personal_routine");
const JwtHandler = require("../secureme/jwthandler");

const jwtHandler = new JwtHandler();

//mongodb sign-up
authRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password  } = req.body;
        const existingUser = await UserAuth.findOne({ email });
        if(existingUser) {
            console.log("User with same email already exist");
            return res.status(400).json({msg : "User with same email already exist"})
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        let userAuth = new UserAuth({
            email,
            password : hashPassword,
        });
        userAuth = await userAuth.save();
        const token = jwtHandler.generateToken({id: userAuth._id});
        let userInfo = new UserInfo({
            userId : userAuth._id,
            name : name,
            email,
            token,
            personalRoutineId :userAuth._id,
            _id : userAuth._id,
        });
        userInfo = await userInfo.save();
        let pRoutine = await new PersonalRoutine({
            "routineId": userId
        });
        await pRoutine.save();
        res.json({"user" :userInfo});
    } catch (e) {
        res.status(500).json({ error : e.message});
    }
});

authRouter.post("/signin", async (req, res) => {
    try {
        console.log("signin api...");
        const { email, password } = req.body; 
        
        const existingUserAuth = await UserAuth.findOne({ email }); 
        if( !existingUserAuth ) {
            res
                .status(400)
                .json({ msg : "User with this email does not exists!"});
            return;
        }
        const isMatch = await bcryptjs.compare(password, existingUserAuth.password);
        if( !isMatch ) { 
            res
                .status(500)
                .json({ msg : "Incorrect password!"});
            return;
        }
        const existingUserInfo = await UserInfo.findOne({_id : existingUserAuth._id });
        if( !existingUserInfo ) {
            const token = jwtHandler.generateToken({id: existingUserAuth._id});
            let userInfo = new UserInfo({
                userId : existingUserAuth._id,
                userName : "unknown",
                email,
                token,
                personalRoutineId :existingUserAuth._id, 
                _id : userAuth._id,
            });
            userInfo = await userInfo.save();
            existingUserInfo = userInfo; 
        }
        // console.log(existingUserInfo);
        res.json({"user" : existingUserInfo});  
    } catch (error) {
        
        res.status(500).json({ error : error.message, "message" : "failed"});
    }
});

module.exports = authRouter;
