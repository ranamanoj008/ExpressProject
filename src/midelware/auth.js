const jwt = require('jsonwebtoken')
const Registration = require('../models/Registration')

const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        
        const user = await Registration.findOne({_id:verifyUser._id})
        
        req.token = token;
        req.user = user;

        next();
    }catch(error){
        res.send(error)
    }

}

// const genRanpass = (length)=>{
//     let result           = '';
//     let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let charactersLength = characters.length;
//     for ( let i = 0; i < length; i++ ) {
//        result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

// genRanpass(5);

module.exports = auth;