//import from packages...
const express = require("express");
const mongoose = require("mongoose");

// import routes
const authRouter = require("./routes/auth.js");
// const userSearchRouter = require("./routes/user_search.js");
const handshakeRouter = require("./routes/handshake.js");
// const userBriefLookRouter = require("./routes/user_brief_look.js");
const groupRoutineRouter = require("./routes/group_routine.js")
const eventsRouter = require("./routes/events.js");
const UserInfoRouter = require("./routes/user_info.js");
///////
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended : true}));

const DB = "mongodb+srv://arrow360degree:110057@cluster0.cvwmbiv.mongodb.net/?retryWrites=true&w=majority";

//middleware
app.use("/DyRou/auth",authRouter);
// app.use(userSearchRouter);
app.use("/DyRou/handshake", handshakeRouter); 
// app.use("/DyRou/userBriefLook", userBriefLookRouter);
app.use("/DyRou/groupRoutine", groupRoutineRouter);
app.use("/DyRou/events", eventsRouter);
app.use("/DyRou/userInfo", UserInfoRouter);

app.listen(PORT, "0.0.0.0", function (){
    console.log("Connected... hi :)");
});

//connection
mongoose
    .connect(DB)
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(`Error : ${e}`); 
    });
