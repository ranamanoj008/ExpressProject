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

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

console.log(process.env.SECRET_KEY)

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


// form ends

app.get('*' , (req,res)=>{
    res.render('error',{
        errorProp: "Opps! Page Not Found"
    })
})


app.listen(port,()=>{
    console.log(`port ${port}`)
})