const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/User');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;


    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        console.log("decoded",decoded);
        

        const user = await User.findById(decoded.id).select('-password').lean();

        console.log("user",user);
        
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        // req.user = {
        //     _id: decoded.id, 
        //     name: decoded.name,
        //     email: decoded.email,
        //     isStaff: decoded.isStaff,
        // };

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateToken;