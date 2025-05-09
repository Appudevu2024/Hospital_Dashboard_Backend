const mongoose = require('mongoose');


const staffSchema = new mongoose.Schema({
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
    contact: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true

    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true

    },
    staffrole: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
      }
}, { timestamps: true });

module.exports = new mongoose.model('staffs', staffSchema);