
//import jsonwebtoken
const jwt=require('jsonwebtoken')

//import user model
const db = require('./db')

database={
    1000: { acno: 1000, uname: "Neer", password: 1000, balance: 5000,transaction:[] },
    1001: { acno: 1001, uname: "Vyom", password: 1001, balance: 5000,transaction:[] },
    1002: { acno: 1002, uname: "Laisha", password: 1002, balance: 5000,transaction:[] }
  }

//   register definition


const register=(acno,password,uname)=> {
//asynchronous
   
return db.User.findOne({acno})
.then(user=>{
  console.log(user);
  if(user)
  {
    return {
      statusCode:422,
      status:false,
      message:"already exist!!! please log in..."
    }
  }
  else{
    const newUser=new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction:[]
    })
newUser.save()
return{
  statusCode:200,
  status:true,
  message:"register successfully"
  }
}
})
}
   
      
  //login
const login=(acno,password)=>{
  //asynchronous
  return db.User.findOne({acno,password})
  .then(user=>{
    if(user){
    currentAcno=acno
    currentUname=user.uname
    
//token generation
    const token=jwt.sign({
      currentAcno:acno
    },'supersecretkey123')
      

      return{
      statusCode:200,
      status:true,
      message:"successfully log in",
      currentAcno,
      currentUname,
      token
      }
    }
    else{
      return {
        statusCode:422,
        status:false,
        message:"incorrect password/account number"
      }
    }

  })
    
}
 // /deposit
 const deposit=(acno, password,amt)=>{
  var amount = parseInt(amt)
  //asynchronous
  return db.User.findOne({acno, password})
  .then(user=>{
    if(user){
      user.balance+=amount
      user.transaction.push({
        amount:amount,
        type:"CREDIT"
      })
      user.save()
      return{
        
        statusCode:200,
        status:true,
        message:amount+"successfully deposited..and new balance is : "+user.balance
      }
      
    }
    else{
    return{
      
      statusCode:422,
      status:false,
      message:"incorrect password/Account number"
    }
  }

  })
  }

    
  
  
 //withdraw

 const withdraw=(req,acno, password, amt)=> {
  var amount = parseInt(amt)
  var currentAcno =req.currentAcno
   //asynchronous
   return db.User.findOne({acno, password})
   .then(user=>{
     if(currentAcno!=acno){
     return{ 
      statusCode:422,
      status:false,
      message:"operation denied"
    }
  }
     if(user){
       if(user.balance>amount){
        user.balance-=amount
        user.transaction.push({
          amount:amount,
          type:"DEBIT"
        })
        user.save()
        return{
          statusCode:200,
          status:true,
          message:amount+"successfully debited..and new balance is : "+user.balance
        }
       }
       else{
         return{
          statusCode:422,
          status:false,
          message:"insufficient balance"
         }
       }   
     }
     else{
     return{
       
       statusCode:422,
       status:false,
       message:"incorrect password/Account number"
     }
   }
   })
  


  }
const getTransaction=(acno)=>{
  //asynchronous 
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return{
        statusCode:200,
        status:true,
        transaction:user.transaction
    }}
    else{
      return{
        statusCode:422,
        status:false,
        message:"user does not exist"
      }
    }
  })
}

const deleteAcc=(acno)=>{
  //asynchronous
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return{
        statusCode:422,
        status:false,
        message:"operation failed"
      }
    }
    return{
      statusCode:200,
      status:true,
      message:"the requested ac number"+acno+"delete successfully"
    }
  })
}
 


module.exports={
    register,login,deposit,withdraw,getTransaction,deleteAcc
}
 