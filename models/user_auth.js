const mongoose = require("mongoose");


const userAuthSchema = mongoose.Schema(
    {
        email : {
            required : true,
            type : String,
            trim : true,
            validate : {
                validator : (value) => {
                    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return value.match(re);
                },
                message : 'Please enter a valid email address',
            },
        },
        password : {
            required : true,
            type : String,
        }
    },
    {
        timestamps : true
    });
const UserAuth = mongoose.model("UserAuth", userAuthSchema);
module.exports = UserAuth;