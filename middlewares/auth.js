const jwt = require('jsonwebtoken');
const SECRET = "yourSecretKey";
const { validationResult } = require('express-validator');
const { registerValidator, loginValidator } = require('../middlewares/validators');
const { success, error } = require('../utils/response');


exports.verifyUser = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token) return res.status(403).send("login required");


    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).send("Invalid token");
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin ){
        return res.status(403).send("Admin access only");
    }
    next();
}
