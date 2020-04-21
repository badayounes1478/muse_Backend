const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()


app.use(bodyparser.json())
app.use(cors())
mongoose.connect(process.env.URL,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true},(err, db)=>{
    if (err) throw err;
    console.log('connected to the database')
})



app.use('/user',require('./Routes/User'))
app.use('/design',require('./Routes/designes'))

app.listen(process.env.PORT || '4000',()=>{

    console.log('connected')
})

