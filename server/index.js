require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")
const courseRouter = require("./routes/course")
app.use(express.json());


app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

const db_link = process.env.DB_LINK;

async function main(){
    await mongoose.connect(db_link);
    app.listen(3000);
}

main();




//! start with index.js

//! 1) now we'll structure our backend using express Router, all the files with a similar endpoint will go inside a file, like all the routes with (user) in it, will go the file routes/user.js
//! 2) and similarly all the routes with a (admin) will go to the file /routes/admin.js
//! 3) and similarly all the routes with a (course) will go to the file /routes/course.js
//! 4) go to user.js


//! 7) if a request comes on the endpoint /user then it'll automatically go to the userRouter.(same for the other ones like admin and course as well)


//! 8) it has one more advantage that if we have two versions of our backend then (/api/v1/user) could be running on production while we can add one more verison (/api/v2/user) and work on this version for different things, we just have to change the routes here not everywhere, and it'll redirect the routes to the respective file(when we want out frontend to hit the v1 endpoints then we'll just update it in the frontend)

//! 9) now like user.js make changes for the course.js and admin.js (go to these files and come back to this)

//! 10) now go to admin.js

//! 14) we should await the call to the mongoose before listening on the port.
//! 15) we can make an async function main which should make sure that the connection is setup first then the backend should start listening.
//! 16) because there is no purpose for the backend to start if it is not connected to the database.