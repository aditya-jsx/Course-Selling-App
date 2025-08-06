const { JWT_ADMIN_PASSWORD } = require("../config");
const jwt = require("jsonwebtoken");

function Admin(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            msg: "No token provided"
        })
    }

    try{
        const response = jwt.verify(token, JWT_ADMIN_PASSWORD);
    
        req.adminId = response.id;
        next();
    }catch(e){
        return res.status(401).json({
            msg: "Invalid Token",
            error: e.message // It's helpful to see the specific error
        });
    }
    
}

module.exports = { Admin }



//! 18) make auth middleware for admin to verify token and send the adminId. (go the user middleware)