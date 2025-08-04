const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db")


adminRouter.post("/signup", ()=>{

})



adminRouter.post("/signin", ()=>{

})



adminRouter.post("/course", ()=>{
    
})



adminRouter.put("/course", ()=>{

})



adminRouter.get("/course/all", ()=>{

})


module.exports = { adminRouter : adminRouter }








//! 11) now the admin can create a course and also change a course so we need to make endpoints for that as well, and we can also make this strict by using a middleware for all the endpoints after signup and signin.

//! 12) we'll import the Router in the respected route file.(go to db.js)