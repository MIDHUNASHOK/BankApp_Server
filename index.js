//import express
const { request } = require('express');
const express= require('express')
const dataservice=require('./services/data.service')
const jwt=require('jsonwebtoken')
const cors=require('cors')

//create an app using express

const app=express()
//use cors to specify origin
app.use(cors({
    origin:'http://localhost:4200'
}))
//to parse json
app.use(express.json())

//resolve http req from client
//GET- to read data
app.get('/',(req,res)=>{
    res.send("get method")
})



//applicatin specific midleware
const appMidleware=(req,res,next)=>{
    console.log("application specific midleware");
    next()
}
app.use(appMidleware)


//bankapp -API

//to verify token-middleware
const jwtMiddleware=(req,res,next)=>{
try {   const token =req.headers["x-access-token"]
    //verify token
const data=jwt.verify(token,'supersecretkey123')
req.currentAcno=data.currentAcno
next()}
catch{
    res.status(422).json({
        status:false,
        message:"please log in"
    })
}
}
  //register API:
  app.post('/register',(req,res)=>{
      //asynchronous
      const result=dataservice.register(req.body.acno,req.body.password,req.body.uname)//fn calling 
    .then(result=>{
        res.status(result.statusCode).json(result)
    })

})

   //login API:
   app.post('/login',(req,res)=>{
    dataservice.login(req.body.acno,req.body.password)//fn calling 
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})

 //deposit API:
 app.post('/deposit',jwtMiddleware,(req,res)=>{
     //asynchronous

    dataservice.deposit(req.body.acno,req.body.password,req.body.amt)//fn calling
    .then(result=>{
        res.status(result.statusCode).json(result)

    }) 

})

//withdraw API:

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    //asynchronous
    dataservice.withdraw(req,req.body.acno,req.body.password,req.body.amt)//fn calling 
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})

//transaction API

app.post('/transaction',jwtMiddleware,(req,res)=>{
    const result=dataservice.getTransaction(req.body.acno)//fn calling
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})
//deleteAcc API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    //asynchronous
    dataservice.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})




  
    

app.get('/',(req,res)=>{
    res.status(401). send("get method")
})

//set up the port number

app.listen(3000,()=>{
    console.log("server started at port no:3000");
})

