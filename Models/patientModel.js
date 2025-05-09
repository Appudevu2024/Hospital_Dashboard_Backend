// const mongoose = require('mongoose');
// const patientSchema = new mongoose.Schema({
//     name: String,
//     dateOfBirth: Date,
//     contact: String,
//     doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctors' },
//     appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments' },
//     registeredAt: { type: Date, default: Date.now }
// }, { timestamps: true })

// module.exports = new mongoose.model('patients', patientSchema)
const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  bloodPressure: String,
  temperature: String,
  pulseRate: String,
  respirationRate: String,
  diagnostic: String
}, { _id: false }); // Prevents creating separate _id for each vitals object

const patientSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  contact: String,
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctors' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'appointments' },
  registeredAt: { type: Date, default: Date.now },
  vitals: vitalsSchema // Add vitals field
}, { timestamps: true });

module.exports = mongoose.model('patients', patientSchema);