const express = require('express')
const router = express.Router()
const { getPatient, addPatient, updatePatient, deletePatient, getOnePatient } = require('../controllers/patientsControllers')

router.get('/' , getPatient)
router.get('/:id', getOnePatient)
router.post('/' , addPatient)
router.put('/:id' , updatePatient)
router.delete('/:id', deletePatient)

module.exports = router