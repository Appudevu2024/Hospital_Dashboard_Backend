const adminRouter = require('./adminRoutes');
//const courseRouter = require('./courseRoutes');
const doctorRouter = require('./doctorRouter');

const v1Router= require('express').Router();

v1Router.use('/doctor',doctorRouter)
v1Router.use('/admin',adminRouter)
//v1Router.use('/course',courseRouter)

module.exports=v1Router