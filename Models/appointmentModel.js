const mongoose=require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientname:{
        type:String,
        required:true,
        unique:true
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors', // Reference to doctor model
        required: false
    },
    date: {
        type: Date,
        required: true,
        
    },
    time: {
        type: String,
        required: true,
         
    },
    status: {
        type: String,
        required: true
    }

},{timestamps:true})


module.exports= new mongoose.model('appointments',appointmentSchema)