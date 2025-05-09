 const jwt= require('jsonwebtoken');
 const createToken = require("../Utilities/generateToken");
 const cookieParser = require('cookie-parser');
 require('dotenv').config();
 
 const authDoctor= (req,res,next)=>{
 try {
     //const {token}=req.cookies;
     //console.log(req.cookies);
     const {doctor_token} = req.cookies ;
    
     if(!doctor_token){
         return res.status(401).json({error:'Jwt not found'});
     }
     
     const verifiedToken=jwt.verify(doctor_token, process.env.JWT_SECRET)
     if(!verifiedToken){
         return res.status(401).json({error:'User not authorized'});
     }
    
 
     if(verifiedToken.role!=='doctor'){
         return res.status(401).json({error:'Access denied'});
     }
 
     req.user=verifiedToken.id;
     next();
 } catch (error) {
     
    return  res.status(error.status || 401).json({ error: error.message || 'User authorization failed' }) 
 }
 }
 
 module.exports=authDoctor;