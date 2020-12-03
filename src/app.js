const express = require('express')
const app = express()
const port = process.env.PORT || 8000 ;
const path = require('path') 
const hbs = require('hbs')



const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(path.join(__dirname, '../public')))

app.get('/' , (req,res)=>{
    res.render('index.hbs')
})

app.get('/about' , (req,res)=>{
    res.render('about')
})

app.get('/weather' , (req,res)=>{
    res.render('weather')
})

app.get('*' , (req,res)=>{
    res.render('error',{
        errorProp: "Opps! Page Not Found"
    })
})


app.listen(port,()=>{
    console.log(`port ${port}`)
})