//const { logout } = require('../../Controllers/doctorController');
const authAdmin= require('../../Middlewares/authAdmin')
const upload=require('../../Middlewares/multer');
const { registerDoctor,login,logout,doctorDetails,listAllDoctors, updateDoctordata,deleteDoctor, loggedin } = require('../../Controllers/doctorController');

const authDoctor = require('../../Middlewares/authDoctor');
const express= require('express')
const doctorRouter= express.Router();


doctorRouter.post('/register',authAdmin,upload.single('image'),registerDoctor)

doctorRouter.post('/login', login)
doctorRouter.get('/doctorpanel', authDoctor,loggedin)

doctorRouter.get('/logout', logout)


doctorRouter.post('/doctorDetails',authAdmin,doctorDetails)
doctorRouter.get('/listdoctors',listAllDoctors);


doctorRouter.put('/updateDoctor',authAdmin,upload.single('image'),updateDoctordata)

doctorRouter.delete('/deleteDoctor',authAdmin,deleteDoctor)




module.exports=doctorRouter