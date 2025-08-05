const { JWT_ADMIN_PASSWORD } = require("../config");
const jwt = require("jsonwebtoken");

function Admin(req, res, next){
    const token = req.headers.token;

    const response = jwt.verify(token, JWT_ADMIN_PASSWORD);

    if(response){
        req.adminId = response.id;
        next();
    }else{
        res.status(403).json({
            msg: "Invalid Token"
        })
    }
}

module.exports = { Admin }



//! 18) make auth middleware for admin to verify token and send the adminId. (go the user middleware)