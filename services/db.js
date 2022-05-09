//to give mongo db connection details
//import mongoose
const mongoose = require('mongoose')

//state connection string
mongoose.connect('mongodb://localhost:27017/bankApp',{
    useNewUrlParser:true
})

//connection model creation
const User = mongoose.model('User',{
    acno: Number, 
    uname:String,
     password:String,
      balance:Number,
      transaction:[]
})

//export model -user
module.exports={
    User
}