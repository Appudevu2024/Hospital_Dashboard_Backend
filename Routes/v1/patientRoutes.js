const express = require('express');
const router = express.Router();
const {  getAllPatients,getPatientById , deletePatient,updatePatientVitals  } = require('../../Controllers/patientController');
const authAnyUser = require('../../Middlewares/authAnyUser');

// Allow admin, doctor, and staff to create and view appointments
router.get('/:id', authAnyUser, getPatientById);
router.get('/', authAnyUser, getAllPatients);
router.put('/:id/vitals', authAnyUser, updatePatientVitals );
router.delete('/', authAnyUser, deletePatient);

module.exports = router;