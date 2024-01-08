const mongoose = require("mongoose");

const EventsSchema = mongoose.Schema({
    // eventId : {
    //     required :true,
    //     type : String,
    //     trim : true
    // },
    eventHighlight  : {         //eventHighlight, eventdescription, startsAt, endsAt, eventFollowers
        required :true,
        type : String,
        trim : true,
        default : "unknown"
    },    
    eventDescription : {
        type : String,
        trim : true,
    },
    startsAt : {
        type : Date,
        default : Date.now()  
    },
    endsAt : {
        type : Date,
        default : function() {
            return new Date(+ Date() + 60 * 60 * 1000);
        }
    },
    eventFollowers : {
        required : true,
        type : [String],
        default : [],
    },
},
{
    timestamps : true
});
const Events = mongoose.model("Events", EventsSchema);
module.exports = Events;

