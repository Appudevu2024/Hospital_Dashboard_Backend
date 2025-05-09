const jwt= require('jsonwebtoken');
const createToken = require("../Utilities/generateToken");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authAdmin= (req,res,next)=>{
try {
    //const {token}=req.cookies;
    //console.log(req.cookies);
    const {Admin_token} = req.cookies ;
   console.log(Admin_token);
    if(!Admin_token){
        return res.status(401).json({error:'Jwt not found'});
    }
    
    const verifiedToken=jwt.verify(Admin_token, process.env.JWT_SECRET)
    if(!verifiedToken){
        return res.status(401).json({error:'Admin not authorized'});
    }
   

    if(verifiedToken.role!=='admin'){
        return res.status(401).json({error:'Access denied'});
    }

    req.admin=verifiedToken.id;
    next();
} catch (error) {
    
   return  res.status(error.status || 401).json({ error: error.message || 'Admin authorization failed' }) 
}
}

module.exports=authAdmin;