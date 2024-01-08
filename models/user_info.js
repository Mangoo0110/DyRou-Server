const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema({
    userId : {
        required :true,
        type : String,
        trim : true
    },
    userAvatar : {
        type : Buffer,
        trim : true,
    },
    email : {
        required : true,
        type : String,
        trim : true,
        validate : {
            validator : (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message : "Not a valid email address!!" 
        }
    },
    token : {
        required : true,
        type : String,
        trim : true,
    },
    name : {
        required : true,
        type : String,
        trim : true,
        default : "unknown"
    },
    occupation : {
        type : String,
        trim : true,
        default : ""
    },
    flowers : {
        type : String,
        trim : true,
        default : 0,
    },
    friends : {
        required : true,
        type : [String],
        default : [],
    },
    handshakeRequests : {
        required : true,
        type : [String],
        default : [],
    },
    handshakePendings : {
        required : true,
        type : [String],
        default : [],
    },
    groupRoutines : {
        required : true,
        type : [String],
        default : [],
    },
    personalRoutineId : {
        required : true, 
        type : String,
        trim : true,
    }
},
{
    timestamps : true
});
const UserInfo = mongoose.model("UserInfo", userInfoSchema);
module.exports = UserInfo;