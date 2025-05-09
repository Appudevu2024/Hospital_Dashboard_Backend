const express =require('express')
const router = express.Router();
const upload = require('../../Middlewares/multer')
const { register,loggedin, login, logout,adminDetails,updateAdmindata,deleteAdmin } = require('../../Controllers/adminController')
const {addNewBloodGroup, listBloodBankData, deleteBloodGroup,updateBloodgroup}= require('../../Controllers/bloodbankController')
const authAdmin= require('../../Middlewares/authAdmin')
const { addNewDept,listAllDepartments,deleteDepartment,updateDepartment } = require('../../Controllers/departmentController')
const adminRouter= express.Router()
const appointmentRoutes = require('./appointmentRouter');
const patientRouter = require('./patientRoutes');


adminRouter.post('/register',upload.single('image'),register )

adminRouter.post('/login',login)
adminRouter.get('/adminpanel', authAdmin,loggedin)

adminRouter.get('/logout',logout)

adminRouter.post('/adminData',adminDetails)


adminRouter.put('/updateAdmin',updateAdmindata)

adminRouter.delete('/deleteAdmin',deleteAdmin)

adminRouter.post('/addBloodGroup',addNewBloodGroup)

adminRouter.get('/listBloodBank',listBloodBankData)

adminRouter.delete('/deleteBloodgroup',deleteBloodGroup)
adminRouter.put('/updateBloodbank',updateBloodgroup)


adminRouter.post('/addDepartment',addNewDept)

adminRouter.get('/listDepartment',listAllDepartments)

adminRouter.delete('/deleteDepartment',deleteDepartment)
adminRouter.put('/updateDepartment',updateDepartment)
adminRouter.use('/appointments',appointmentRoutes);
adminRouter.use('/patients',patientRouter)


module.exports= adminRouter