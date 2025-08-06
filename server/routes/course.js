const { Router } = require("express");
const { User } = require("../middlewares/user");
const { PurchasesModel } = require("../db");

const courseRouter = Router();



//! make a check that whether the user has bought this course or not
courseRouter.post("/purchases", User, async (req, res) => {
    const { userId, courseId } = req.body;
    
    // make a check here to avoid buying the same course
    await PurchasesModel.create({
        userId: userId,
        courseId: courseId
    })

    res.json({
        msg: "You've successfully bought this course"
    })
})


//!  this is an unauthenticated endpoint that let any user see the courses
courseRouter.get("/preview", async (req, res)=>{
    const courses = CoursesModel.find({});

    res.json({
        courses
    })
})


module.exports = courseRouter;


//! 29) make the routes for the purchases and the preview

//! 30) go to db.js

//! 33) in the post => purchases we should be returning all the courses that are present to buy

//! 34) the preview endpoint doesn't neec to be authenticated because even if the user is not logged in he should be able to see all the courses.

//! 35) go to user route