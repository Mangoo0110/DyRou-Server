// import from packages...
const express = require("express");

// import from other files...
const JwtHandler = require("../secureme/jwthandler");
const Events = require("../models/event");
const GroupRoutine = require("../models/group_routines");
const PersonalRoutine = require("../models/personal_routine");
const UserInfo = require("../models/user_info");

const eventsRouter = express.Router();
const jwtHandler = new JwtHandler();

eventsRouter.post("/personalRoutine/createNewEvent", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { _id, eventHighlight, eventdescription, startsAt, endsAt, eventFollowers } = req.body;
        let event = new Events({
            eventHighlight,
            eventdescription,
            startsAt, 
            endsAt, 
            eventFollowers
        });
        event = await event.save();
        const followerIds = eventFollowers || [];
        // Iterate over each follower ID and perform an action
        followerIds.forEach(async (followerId) => {
        try {
            await insertEventToPersonalRoutine(followerId, event["_id"]); // here follower's _id is his/her personal routine id.
        } catch (error) {
            console.error(`Error processing follower with ID ${followerId}:`, error);
        }
        });
        res.json("Event created");
        
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

eventsRouter.post("/groupRoutine/createNewEvent", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { _id, eventHighlight, eventdescription, startsAt, endsAt, eventFollowers } = req.body;
        let event = new Events({
            eventHighlight,
            eventdescription,
            startsAt, 
            endsAt, 
            eventFollowers
        });
        event = await event.save();

        const followerIds = eventFollowers || [];
        // Iterate over each follower ID and perform an action
        followerIds.forEach(async (followerId) => {
        try {
            await insertEventToPersonalRoutine(followerId, event["_id"]); // here follower's _id is his/her personal routine id.
        } catch (error) {
            console.error(`Error processing follower with ID ${followerId}:`, error);
        }
        });
        res.json("Event created");
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

eventsRouter.post("/updateEvent", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const { _id, eventHighlight, eventdescription, startsAt, endsAt, eventFollowers } = req.body;
        let event = await Events.findById(_id);
        if(eventHighlight != null) event["eventHighlight"] = eventHighlight;
        if(eventdescription != null) event["eventdescription"] = eventdescription;
        if(startsAt != null) event["startsAt"] = startsAt;
        if(endsAt != null) event["endsAt"] = endsAt;
        if(eventFollowers != null) event["eventFollowers"] = eventFollowers;
        await event.save();
        res.json("Event updated");
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

eventsRouter.post("/deleteEvent", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const {_id} = req.body;
        if(_id == null) {
            res.status(404).json({ "error": "Not enough information" });
            return;
        }
        const followerIds = eventFollowers || [];
        // Iterate over each follower ID and perform an action
        followerIds.forEach(async (followerId) => {
            try {
                await deleteEventFromPersonalRoutine(followerId, _id); // here follower's _id is his/her personal routine id.
            } catch (error) {
                throw new Error(`Error processing follower with ID ${followerId}:`, error);
            }
        });
        await Events.deleteOne({_id : _id});
        res.json("Event deleted")
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

eventsRouter.post("/personalRoutine/getAllEvents", async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const {userId} = req.body;
        if(userId == null) {
            res.status(404).json({ "error": "Not enough information" });
            return;
        }
        const user = await UserInfo.findById(userId);
        if(user){
            const personalRoutine = await PersonalRoutine.findById(user["personalRoutineId"]);
            if(!personalRoutine) {
                let personalRoutine = await new PersonalRoutine({
                    "routineId": userId
                });
                await personalRoutine.save();
            }
            let personalRoutineEvents = [];
            for(let index = 0; index<personalRoutine["eventIds"]; index++){
                let eventId = personalRoutine["eventIds"][index];
                const event = await Events.findById(eventId);
                personalRoutineEvents.push(event);
            }
        }
        else{
            res.status(500).json({"msg": "User not found!"});
            return;
        }

        res.json({"events": personalRoutineEvents});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

eventsRouter.post("/groupRoutine/getAllEvents", async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            res.status(500).json({ error: 'Not a authorized client' });
            return;
        }
        const decodedPayload = jwtHandler.verifyToken(token);
        const {routineId} = req.body;
        if(userId == null) {
            res.status(404).json({ "error": "Not enough information" });
            return;
        }
        const routine = await GroupRoutine.findById(routineId);
        let groupRoutineEvents = [];

        for(let index = 0; index<routine["eventIds"]; index++){
            let eventId = routine["eventIds"][index];
            const event = await Events.findById(eventId);
            groupRoutineEvents.push(event);
        }

        res.json({"events": groupRoutineEvents});
    } catch (error) {
        res.status(500).json({ "error": error + "" });
    }
});

async function insertEventToPersonalRoutine(routineId, eventId){
    let routine = await PersonalRoutine.findById(routineId);
    if(!routine){
        routine = await new PersonalRoutine({
            "routineId": userId
        });
        await routine.save();
    }
    routine["eventIds"].push(eventId);
    await routine.save();
}

async function deleteEventFromPersonalRoutine(routineId, eventId){
    const routine = await PersonalRoutine.findById(routineId);
    if(!routine){
        routine = await new PersonalRoutine({
            "routineId": userId
        });
        await routine.save();
    }
    routine["eventIds"].pull(eventId);
    await routine.save();
}

module.exports = eventsRouter;