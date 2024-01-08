// import from packages...
const express = require("express");

// import from other files...
const JwtHandler = require("../secureme/jwthandler");
const GroupRoutine = require("../models/group_routines");
const UserInfo = require("../models/user_info");

const groupRoutineRouter = express.Router();
const jwtHandler = new JwtHandler();

groupRoutineRouter.post("/createRoutineGroup", async (req, res) => {
    try {
        console.log("creating grps");
        const { token } = req.headers;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { routineName, admins, members } = req.body;
        console.log(req.body);
        // const admins = [creator];
        const autoFollowers = members;
        // const readAnyone = false;
        let groupRoutine = new GroupRoutine({ 
            routineName, 
            admins, 
            members: members.flat(),
            autoFollowers : autoFollowers.flat()
        });
        groupRoutine = await groupRoutine.save();
        console.log(req.body.members.flat());
        for(let index = 0; index < groupRoutine["members"].length; index++) {
            try {
                let userId = groupRoutine["members"][index].toString();
                console.log(userId);
                let user = await UserInfo.findById(userId);
                console.log(user);
                if(!user["groupRoutines"].includes(groupRoutine["_id"])) {
                    user["groupRoutines"].push(groupRoutine["_id"]);
                }
                await user.save();
            } catch (error) {
                throw new Error(`Error processing follower with ID ${followerId}:`, error);
            }
        }
        res.json({"msg" : "Done"});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

groupRoutineRouter.post("/deleteRoutineGroup", async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { routineIdG} = req.body;
        await GroupRoutine.deleteOne({_id : routineIdG}); 
        res.json("Deleted"); 
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

groupRoutineRouter.post("/getRoutineGroup", async (req, res) => {
    try {
        console.log("getting groups");
        const { token } = req.headers;
        console.log(req.body);

        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { routineId } = req.body;
        const groupRoutine =  await GroupRoutine.findById({_id : routineId});
        
        res.json({"groupRoutine" : groupRoutine});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

groupRoutineRouter.post("/getUserRoutineGroups", async (req, res) => {
    try {
        console.log("getting groups");
        const { token } = req.headers;
        console.log(req.body);

        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { userId } = req.body;
        const user = await UserInfo.findById(userId);
        let groupRoutines = [];
        if(user) {
            let routineIds =  user["groupRoutines"];
            for(let index = 0; index < user["groupRoutines"].length; index++) {
                let routineId = user["groupRoutines"][index];
                const routineGroup =  await GroupRoutine.findById({_id : routineId});
                groupRoutines.push(routineGroup);
            }
        }
        res.json({"groupRoutines" : groupRoutines});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

groupRoutineRouter.post("/updateRoutineGroup", async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { _id, routineName, routineAvatar, admins, members, events, autoFollowers, readAnyone, writeAnyone } = req.body;
        let groupRoutine = await GroupRoutine.findById(_id);
        if(!groupRoutine) {
            res.status(404).json({ error: 'Group is not found' });
            return;
        }
        if(routineName != null) groupRoutine["routineName"] = routineName;
        if(routineAvatar != null) groupRoutine["routineAvatar"] = routineAvatar;
        if(admins != null) groupRoutine["admins"] = admins;
        if(members != null) groupRoutine["members"] = members;
        if(events != null) groupRoutine['events'] = events;
        if(autoFollowers != null) groupRoutine["autoFollowers"] = autoFollowers;
        if(readAnyone != null) groupRoutine["readAnyone"] = readAnyone;
        if(writeAnyone != null) groupRoutine["writeAnyone"] = writeAnyone; 
        await groupRoutine.save();
        res.json({"msg": "Updated"});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});
module.exports = groupRoutineRouter;