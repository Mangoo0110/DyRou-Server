const mongoose = require("mongoose");

const PersonalRoutineSchema = mongoose.Schema({
    routineId : {
        required :true,
        type : String,
        trim : true
    },
    eventIds : {
        type : [String],
        default : [],
    }
},
{
    timestamps : true
});
const PersonalRoutine = mongoose.model("PersonalRoutines", PersonalRoutineSchema);
module.exports = PersonalRoutine;
