const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ");
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'somesuperkey');
    }catch (e) {
        req.isAuth = false;
        return next();
    }

    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();

}