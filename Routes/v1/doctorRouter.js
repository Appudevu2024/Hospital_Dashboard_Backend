//const { logout } = require('../../Controllers/doctorController');
const authAdmin= require('../../Middlewares/authAdmin')
const { registerDoctor,login,logout,doctorDetails,listAllDoctors, updateDoctordata,deleteDoctor } = require('../../Controllers/doctorController');
const upload=require('../../Middlewares/multer')

const doctorRouter= require('express').Router();


doctorRouter.post('/register',authAdmin,upload.single('image'),registerDoctor)

doctorRouter.post('/login', login)

doctorRouter.get('/logout', logout)


doctorRouter.post('/doctorDetails',doctorDetails)
doctorRouter.get('/listdoctors',listAllDoctors);


doctorRouter.put('/updateDoctor',authAdmin,upload.single('image'),updateDoctordata)

doctorRouter.delete('/deleteDoctor',deleteDoctor)




module.exports=doctorRouter