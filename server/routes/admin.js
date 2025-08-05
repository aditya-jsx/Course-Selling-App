const { Router } = require("express");
const adminRouter = Router();
const { AdminModel, UserModel } = require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { JWT_ADMIN_PASSWORD } = require("../config")



adminRouter.post("/signup", async (req, res)=>{

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

        const existingAdmin = await AdminModel.findOne({ email: email });
        if(existingAdmin){
            return res.status(409).json({
                msg: "Admin with this email already exists."
            })
        }

        await AdminModel.create({
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



adminRouter.post("/signin", async (req, res)=>{

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
        }, JWT_ADMIN_PASSWORD)
        res.json({ token: token })
    }else{
        msg: "Incorrect Credentials"
    }

})



adminRouter.post("/course", ()=>{
    
})



adminRouter.put("/course", ()=>{

})



adminRouter.get("/course/all", ()=>{

})


module.exports = adminRouter;








//! 11) now the admin can create a course and also change a course so we need to make endpoints for that as well, and we can also make this strict by using a middleware for all the endpoints after signup and signin.

//! 12) we'll import the Router in the respected route file.(go to db.js)