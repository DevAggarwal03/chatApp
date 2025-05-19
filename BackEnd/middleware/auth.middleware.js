const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret; // Or however you're storing it

exports.checkUser = async(req, res, next) => {
    const authHeader = req.headers.token;

    // if (authHeader && authHeader.startsWith("Bearer ")){
    if (authHeader){
        console.log(jwtSecret)
        // const token = authHeader.split(" ")[1];  
        const token = authHeader;  
        try {
            console.log('heelo');
            const tokenData = await jwt.verify(token, jwtSecret);
            req.userData = tokenData;
            console.log('tokenData: '+tokenData.username)
            next(); // Token is valid, continue
        } catch (error) {
            console.error(error);
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token",
            });
        }   
    }else{
        return res.status(401).json({
            success: false,
            message: "Authentication token missing",
        });
    }
    
};
