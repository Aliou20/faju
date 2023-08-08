const express = require('express')
const { sendSms } = require('../controllers/sendSmsControllers')
const router = express.Router()


router.post('/', sendSms)


module.exports = router