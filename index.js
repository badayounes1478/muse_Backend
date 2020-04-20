const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())
mongoose.connect('mongodb+srv://Roshan:roshan@cluster0-hetj0.mongodb.net/Muse?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true},(err, db)=>{
    if (err) throw err;
    console.log('connected to the database')
})

app.use('/user',require('./Routes/User'))
app.use('/design',require('./Routes/designes'))

app.listen(process.env.PORT || '4000',()=>{
    console.log('connected')
})

