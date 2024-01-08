const mongoose = require("mongoose");

const GroupRoutineSchema = mongoose.Schema({
    // routineIdG : {
    //     required :true,
    //     type : String,
    //     trim : true
    // },
    routineAvatar : {
        type : Buffer,
        trim : true,
    },    
    routineName : {
        required : true,
        type : String,
        trim : true,
        default : "unknown"
    },
    readAnyone  : {
        type : Boolean,
        default : false
    },
    writeAnyone : {
        type : Boolean,
        default : false
    },
    admins : {
        required : true,
        type : [String],
        default : [],
    },
    members : {
        required : true,
        type : [String],
        default : [],
    },
    eventIds : {
        required : true,
        type : [String],
        default : [],
    },
    autoFollowers : {
        required : true,
        type : [String],
        default : [],
    },
},
{
    timestamps : true
});
const GroupRoutine = mongoose.model("GroupRoutines", GroupRoutineSchema);
module.exports = GroupRoutine;

// Routine Avatar(Image) :
// Routine Name :
// Read Anyone : True/ False
// Write Anyone : True/ False
// Admin : [User id List]
// Members : [User id List]
// Events : [Event id List]
// AutoFollowers : [User id List]