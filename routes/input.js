const express=require('express');
const router=express.Router();
const { getInputs,getPolyInputs } = require('../controllers/inputController')

router  
    .route('/')
    .post(getInputs)

router  
    .route('/poly')
    .post(getPolyInputs)

module.exports = router;