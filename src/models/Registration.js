const mongoose = require('mongoose')
const { default: validator } = require('validator')
const validate = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const RegistrationSchema = new mongoose.Schema({
    username : {
        type : String,
        required :true
    },
    email :{
        type : String,
        required :true,
        unique : true,
        validate(val){
            if(!validator.isEmail){
                throw new Error('invalid email');
            }
        }
    },
    password : {
        type : String,
        required : true
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

RegistrationSchema.methods.genAuthToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    }catch(e){
        console.log(e);
    }
}

RegistrationSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

// model

const Registration = new mongoose.model('Registration', RegistrationSchema )

module.exports = Registration;