const express = require('express');
const design = require('../Schema/designes')
const router = express.Router();

router.post('/create', (req, res) => {
  design.create(req.body).then(data => {
      res.status(201).json({
        message:'Design created successfully'
      })
  })
})

router.get('/', (req, res)=>{
  design.find({}).then(data =>{
    res.send(data)
  })
})


module.exports = router