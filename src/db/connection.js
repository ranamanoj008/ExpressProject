const mongoose = require('mongoose')

mongoose.connect(process.env.DB_MONGO,
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