const express= require('express')
const adminRouter = require('./adminRoutes');
const staffRouter = require('./staffsRoutes');
const doctorRouter = require('./doctorRouter');
//const sharedLogin= require('./sharedLogin')


const v1Router= express.Router();
//v1Router.use('/login',sharedLogin)
v1Router.use('/doctor',doctorRouter)
v1Router.use('/admin',adminRouter)
v1Router.use('/staff',staffRouter)

module.exports=v1Router