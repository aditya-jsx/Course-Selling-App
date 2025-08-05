const { Router } = require("express");
const adminRouter = Router();
const { AdminModel, CoursesModel } = require("../db")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { Admin } = require("../middlewares/admin");


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
    const admin = await AdminModel.findOne({ email:email })

    if(!admin){
        res.status(403).json({
            msg: "Admin could not be found"
        })
    }

    // matching passowrds
    const passwordMatch = bcrypt.compare(password, admin.password);

    // returning token
    if(passwordMatch){
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_ADMIN_PASSWORD)
        res.json({ token: token })
    }else{
        msg: "Incorrect Credentials"
    }

})



adminRouter.post("/course", Admin, async (req, res)=>{

    const adminId = req.adminId;

    // now we expect the user to give us 
    const { title, description, imageUrl, price } = req.body;

    // and then we have to put these things in the db
    const course = await CoursesModel.create({
        title: title,
        description: description,
        ImgUrl: imageUrl,
        Price: price, 
        creatorId: adminId
    })
    //! see the video of kirat creating a web3 saas in 6 hours(to understand how to build the pipeline for the user to upload images as well)


    res.json({
        msg: "Course Created",
        creatorId: course._id
    })

})



adminRouter.put("/course", Admin, async (req, res)=>{

    const adminId = req.adminId;
 
    const { title, description, imageUrl, price, courseId } = req.body;

    //! here we'll update the db with the new details, (this updateOne function expects 3 things)
    //! first is what courseId you want to change(and we also have to pass the creatorId, so the function will only find the course if it's made by the person who's trying to change it, otherwise any other person will be able to change it, if the ids dont't match then they'll not be able to edit it)
    try{
        const course = await CoursesModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        ImgUrl: imageUrl,
        Price: price,
    })
    res.json({
        msg: "Course Updated",
        creatorId: course._id
    })
    }catch(e){
        console.error("You can't update this course");
        res.json({
            error: e.message
        })
    } 
    
})



adminRouter.get("/course/all", Admin, async (req, res)=>{

    const adminId = req.adminId;

    const courses = await CoursesModel.find({
        creatorId: adminId
    })

    res.json({
        msg: "Your Courses",
        courses
    })







    // res.json({
    //     msg: "see all courses"
    // })
})


module.exports = adminRouter;








//! 11) now the admin can create a course and also change a course so we need to make endpoints for that as well, and we can also make this strict by using a middleware for all the endpoints after signup and signin.

//! 12) we'll import the Router in the respected route file.(go to db.js)

//! 21) let's create courses now (look at post => course)
//! 22) we should create a .env.example file to show that how our env file looks like but without the important keys

//! 23) the dotenv library has zero dependencies which means it's doesn't depend on any other libraries(we want this because if it depends on any other library and that library has some vulnerability then this library will also have that vulnerability), so it's safe for us to use it to share our important details.


//! 24) now the logic for editing the course (look at put => course)

//! 25) now getting all the courses (look at get => course/all)