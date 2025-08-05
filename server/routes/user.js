const { Router } = require("express");

const userRouter = Router();




userRouter.post("/signup", ()=>{

})



userRouter.post("/signin", ()=>{

})



userRouter.get("/purchases", ()=>{

})


module.exports = userRouter;


//! 5) here we don't have to write user in the routes as it'll already added in the route from the index file
//! 6) go back to index.js