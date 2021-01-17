require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const path = require('path'); 
const hbs = require('hbs');
require('./db/connection');
const Registration = require('./models/Registration');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require('./midelware/auth');
const nodemailer = require('nodemailer');

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))


app.get('/' , (req,res)=>{
    res.render('index.hbs')
})

app.get('/about' , (req,res)=>{
    res.render('about')
})

app.get('/weather', auth , (req,res)=>{
    res.render('weather')
})

// form starts

// registration 
app.get('/register', (req,res)=>{
    res.render('login')
})

app.post('/register', async(req,res)=>{
    try{
        const data = new Registration({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        }) 

        const token = await data.genAuthToken();
        
        res.cookie('jwt', token);
        
        const userData = await data.save()
        
        res.render('index')
    }catch(error){
        res.send(error)
    }
})

// login 
app.get('/login', (req,res)=>{
    res.render('login')
})  

app.get('/logout', auth, async(req,res)=>{
    try{
        res.clearCookie('jwt')
        console.log('logout successfully')
        await req.user.save();
        res.render('index');
    }catch(error){
        res.send(error)
    }
})

app.post('/login', async(req,res)=>{

    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Registration.findOne({ email:email })

    const matchPass = bcrypt.compare(password, userEmail.password);

    const token = await userEmail.genAuthToken();
    
    res.cookie('jwt', token);

    if(matchPass){
        res.render('weather')
    }else{
        res.send('invalid user')
    }
})

// fogot Password

app.get('/forgot', (req,res)=>{
    res.render('Forgot')
}) 

const genRanpass = (length)=>{
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


app.post('/forgot', async(req,res)=>{
    try{
        // let email = req.body.email;
        // let user = req.body.username;
    
        let email = req.body.email;
        let user = req.body.username;
    
        // console.log(username);
        // console.log(email);
    
        let validUser = await Registration.findOne( {$and: [ { email : email}, {username : user}]})
        // console.log(validUser)
    
        // ********************************************************
    
        if(validUser){
            
        const transporter = nodemailer.createTransport({
            host : 'smtp.gmail.com',
            port : 587,
            secure : false,
            auth : {
                user : 'rana.manoj008@gmail.com',
                pass : 'secrethai@123'
            }
        })
    
        // const mailOption = {
        //     from : 'rana.manoj008@gmail.com',
        //     to : 'rana.manoj008@gmail.com',
        //     subject : "demo hai bs",
        //     text : genRanpass(8)
        // }
        
        const mailOption = {
            from : 'rana.manoj008@gmail.com',
            to : 'rana.manoj008@gmail.com',
            subject : "demo hai bsss....",
            text : '**************',
            html: '<p>Click <a href="http://localhost:8000/reset/:email ' + email + '">here</a> to reset your password</p>'
    
        }
    
        transporter.sendMail(mailOption,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                // console.log(data.response)
            res.send('password reset mail has been sent to your email address.')
            
            }
        })
        }else{
            console.log(`user does not exist`)
        }
    
        // **************************************************************
    
        // if(validUser){
        //     res.send('password reset mail has been sent to your email address.')
        // }
    
    }catch(e){
        console.log(e)
    }
})

app.get('/reset/:email', async(req,res)=>{
    res.render('reset')
})

app.post('/reset/:email', async(req,res)=>{
    try{
        
        const pass = req.body.password;
        const Cpass = req.body.Cpassword;
        

        // if(pass === Cpass){
        //     const email = req.params.email;
        //      await Registration.findOneAndUpdate(email, req.body, {new:false})   
        //     res.render('login')
        //     console.log('updated')

        // }

    }catch(e){
        console.log(e)
    }
})

// app.post('/forgot', async(req,res)=>{
//     try{
//         // let email = req.body.email;
//         // let user = req.body.username;
    
//         let email = req.body;
//         let user = req.body;
    
//         // console.log(username);
//         // console.log(email);
    
//         let validUser = await Registration.findOne( {$and: [ { email : email}, {username : user}]})
//         // console.log(validUser)
    
//         // ********************************************************
    
//         if(validUser){
            
//         const transporter = nodemailer.createTransport({
//             host : 'smtp.gmail.com',
//             port : 587,
//             secure : false,
//             auth : {
//                 user : 'rana.manoj008@gmail.com',
//                 pass : 'secrethai@123'
//             }
//         })
    
//         // const mailOption = {
//         //     from : 'rana.manoj008@gmail.com',
//         //     to : 'rana.manoj008@gmail.com',
//         //     subject : "demo hai bs",
//         //     text : genRanpass(8)
//         // }
        
//         const mailOption = {
//             from : 'rana.manoj008@gmail.com',
//             to : 'rana.manoj008@gmail.com',
//             subject : "demo hai bsss....",
//             text : '**************',
//             html: '<p>Click <a href="http://localhost:8000/register">here</a> to reset your password</p>'
    
//         }
    
//         transporter.sendMail(mailOption,(err,data)=>{
//             if(err){
//                 console.log(err)
//             }else{
//                 console.log(data.response);
//                 Registration.updateOne({email : email})
//             }
//         })
//         }else{
//             console.log(`user does not exist`)
//         }
    
//         // **************************************************************
    
//         // if(validUser){
//         //     res.render('about')
//         // }
    
//     }catch(e){
//         console.log(e)
//     }
// })


// form ends

app.get('*' , (req,res)=>{
    res.render('error',{
        errorProp: "Opps! Page Not Found"
    })
})


app.listen(port,()=>{
    console.log(`port ${port}`)
})cd