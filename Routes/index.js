const v1Router = require('./v1')
const express=require('express')
const apiRouter= express.Router()





apiRouter.use('/v1',v1Router);

module.exports=apiRouter