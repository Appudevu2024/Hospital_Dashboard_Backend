const authStaff= require('../../Middlewares/authStaff')
const { createStaff,staffLogin,staffLogout,staffDetails, updateStaffdata,deleteStaff,loggedin,listAllStaffs } = require('../../Controllers/staffsController');
const upload=require('../../Middlewares/multer')
const authDoctor = require('../../Middlewares/authDoctor');
const express=require('express');
const authAdmin = require('../../Middlewares/authAdmin');
const patientRouter = require('./patientRoutes');
const staffRouter= express.Router();


staffRouter.post('/register',authAdmin,upload.single('image'),createStaff)

staffRouter.post('/login', staffLogin)
staffRouter.get('/staffpanel', authStaff,loggedin)

staffRouter.get('/logout', staffLogout)


staffRouter.post('/staffDetails',authAdmin,staffDetails)
staffRouter.get('/liststaffs',authAdmin,listAllStaffs);


staffRouter.put('/updateStaff',authAdmin,upload.single('image'),updateStaffdata)

staffRouter.delete('/deleteStaff',deleteStaff)


staffRouter.use('/patients',patientRouter)


module.exports=staffRouter