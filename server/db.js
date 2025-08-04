const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;


const User = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const Admin = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const Courses = new Schema({
    title: String,
    description: String,
    ImgUrl: String,
    Price: Number,
    creatorId: ObjectId
})

const Purchases = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
    userId: ObjectId
})


const UserModel = mongoose.model('users', User);
const AdminModel = mongoose.model('admin', Admin);
const CoursesModel = mongoose.model('courses', Courses);
const PurchasesModel = mongoose.model('purchases', Purchases);


module.exports = {
    UserModel: UserModel,
    AdminModel: AdminModel,
    CoursesModel: CoursesModel,
    PurchasesModel: PurchasesModel
}





//! this is the schema for our Database

//! 13) make the schema for the users, admin(Course adder), courses, purchases, see excalidraw for the same for the diagram, connect to the mongoose server in the (index.js file).