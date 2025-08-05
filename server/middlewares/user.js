const { JWT_USER_PASSWORD } = require("../config");

function User(req, res, next){
    const token = req.headers.token;

    const response = jwt.verify(token, JWT_USER_PASSWORD);

    if(response){
        req.userId = response.userId;
        next();
    }else{
        res.status(403).json({
            msg: "Invalid Token"
        })
    }
}

module.exports = { User }



//! 19) make auth middleware for user to verify token and send the userId.