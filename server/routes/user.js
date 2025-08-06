const { Router } = require("express");
const userRouter = Router();
const { UserModel, CoursesModel } = require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { JWT_USER_PASSWORD } = require("../config");
const { User } = require("../middlewares/user");


userRouter.post("/signup", async (req, res)=>{

    //! Input Validation using Zod
    const requiredBody = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
      firstName: z.string().min(3).max(100),
      lastName: z.string().min(3).max(100),
    });

    //! Parsing the Data
    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            msg: "Incorrect Format:",
            error: parsedData.error
        })
    }

    //! Destructuring the validated data
    const { email, password, firstName, lastName } = parsedData.data;

    //! Hashing passowrd
    
    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await UserModel.findOne({ email: email });
        if(existingUser){
            return res.status(409).json({
                msg: "User with this email already exists."
            })
        }

        await UserModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
        })

        return res.status(201).json({
            msg: "Signup Completed"
        })
    }catch(e){
        console.error("Database error during SignUp: ", e);
        res.status(500).json({
            msg: "An unexpected error occured during signUp",
            error: e.message
        })
    }

})



userRouter.post("/signin", async (req, res)=>{

    const { email, password } = req.body;

    // finding user in DB
    const user = await UserModel.findOne({ email:email })

    if(!user){
        res.status(403).json({
            msg: "User could not be found"
        })
    }

    // matching passowrds
    const passwordMatch = bcrypt.compare(password, user.password);

    // returning token
    if(passwordMatch){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_PASSWORD)
        res.json({ token: token })
    }else{
        msg: "Incorrect Credentials"
    }

})



userRouter.get("/purchases", User, async (req, res)=>{

    const userId = req.userId;

    const purchases = await PurchasesModel.find({
            userId: userId
    })


    //! ugly way to show the purchases to the user
    const coursesData = await CoursesModel.find({
        _id: { $in: purchases.map(x => x.courseId) }
    })

    res.json({
        purchases,
        courseData
    })
})


module.exports = userRouter;


//! 5) here we don't have to write user in the routes as it'll already added in the route from the index file
//! 6) go back to index.js

//! 20) import auth middleware for user and use it. (everything working fine) go to admin route

//! 27) make the purchase routes so that user can be able to make a purchase

//! 28) go to course.js

//! 36) here in the purchases endpoint the user should be able to see all of their purchases.

//! 37) now if the user looks at it's purchases, according to our code right now, they'll only be able to see only the courseId and their id, as our db only contains those two things.

//! 38) we want out user to see the course content as well, so the ugly way to do this is in purhcases endpoint.

//! 39) the better way to do this is using referencing in mongo DB covered in the offline video




//! Good to haves: - 

//! --->  Use cookies instead of JWT for auth
//! --->  Add a rate limiting middleware
//! --->  Frontend in React