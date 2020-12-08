const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Registrationssss',
{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : true
})
.then(()=>{
    console.log('connected')
})
.catch((e)=>{
    console.log('not connected')
})