const express = require('express');
const router = express.Router();
const { createAppointment, getAllAppointments,updateAppointment,deleteAppointment } = require('../../Controllers/appointmentController');
const authAnyUser = require('../../Middlewares/authAnyUser');

// Allow admin, doctor, and staff to create and view appointments
router.post('/', authAnyUser, createAppointment);
router.get('/', authAnyUser, getAllAppointments);
router.put('/', authAnyUser, updateAppointment);
router.delete('/', authAnyUser, deleteAppointment);

module.exports = router;