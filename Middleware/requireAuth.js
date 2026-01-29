const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function requireAuth(req, res, next){
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    //Checks to see if token is missing
    if(type !== "Bearer" || !token){
        return res.status(401).json({ok:false, error:"Missing Token"});
    }

    try{
        req.user = jwt.verify(token, JWT_SECRET);
        next(); //Token is valid, proceed to next middleware or route handler
    }
    catch{
        return res.status(401).json({ok:false, error:"Invalid Token"});
    }
}