const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({message:"Access denied. No token Porvided.",type:"error"})
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token.", type: "error" });
    }
}
module.exports = authMiddleware;