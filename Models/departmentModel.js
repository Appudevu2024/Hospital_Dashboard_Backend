const mongoose=require('mongoose');

const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
   description: {
        type: String,
        required: false,
        maxlength: 500 
    }

},{timestamps:true})


module.exports= new mongoose.model('departments',departmentSchema)