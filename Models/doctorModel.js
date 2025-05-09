const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    dob:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true 
    },
    qualification:{
        type: String,
        required: true 
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    
    department: {
        type: String,
        required: true
    },
    availableDays: {
        type: String,
        required: true
    },
    timings: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
      }
}, { timestamps: true })

module.exports = new mongoose.model('doctors', doctorSchema)