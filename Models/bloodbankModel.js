const mongoose=require('mongoose');

const bloodbankSchema = new mongoose.Schema({
    bloodgroup:{
        type:String,
        required:true,
        unique:true
    },
    noofbagsavailable:{
        type:Number,
        required: true
    }
},{timestamps:true})


module.exports= new mongoose.model('bloodbank',bloodbankSchema)