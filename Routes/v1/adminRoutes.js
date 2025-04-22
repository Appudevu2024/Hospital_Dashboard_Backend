const { register, login, logout, adminDetails,updateAdmindata,deleteAdmin } = require('../../Controllers/adminController')
const upload = require('../../Middlewares/multer')

const adminRouter= require('express').Router()



adminRouter.post('/register',upload.single('image'),register )

adminRouter.post('/login',login)

adminRouter.get('/logout',logout)

adminRouter.get('/adminData',adminDetails)


adminRouter.put('/updateAdmin',updateAdmindata)

adminRouter.delete('/deleteAdmin',deleteAdmin)




module.exports= adminRouter