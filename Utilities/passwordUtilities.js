const bcrypt= require('bcrypt');

const hashPassword= async(password)=>{
    //const salt= await bcrypt.genSalt();
    const hashedPassword= await bcrypt.hash(password,10);
    return hashedPassword;
}

const comparePassword= async(password,hashedPassword)=>{
    const passwordMatch= await bcrypt.compare(password,hashedPassword)
    return passwordMatch;
}


module.exports={hashPassword,comparePassword}