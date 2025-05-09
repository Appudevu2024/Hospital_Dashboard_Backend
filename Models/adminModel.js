const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String, enum: ['admin', 'doctor', 'staff'], default: 'admin' }, 
    image: {
        type: String,
        required: true
      }
    
}, { timestamps: true })


module.exports = new mongoose.model('admin', adminSchema)