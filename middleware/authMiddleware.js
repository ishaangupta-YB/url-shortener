const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            if (req.originalUrl !== '/') {
                return res.status(200).redirect('/');
            }
            return next();
        }
        const decodedToken = jwt.verify(token, config.jwtSecret);
        const usr = await User.findById(decodedToken.userId); 
        req.user = usr.email    
        if(!usr){
            throw new Error('User not found');
        }

        if (req.originalUrl === '/') { 
            return res.status(200).redirect('/user/dashboard');
        } 
        next();
    } catch (error) { 
        res.clearCookie("jwt");  
        res.status(401).redirect('/');
    }
};  
