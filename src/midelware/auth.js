const jwt = require('jsonwebtoken')
const Registration = require('../models/Registration')

const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "123456789012345678901234567890123")
        
        const user = await Registration.findOne({_id:verifyUser._id})
        
        req.token = token;
        req.user = user;

        next();
    }catch(error){
        res.send(error)
    }

}

module.exports = auth;