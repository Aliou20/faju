const express = require('express')
const { getRendezvous, addRendezvous, updateRendezvous, deleteRendezvous} = require('../controllers/rendezvousControllers')
const router = express.Router()     

router.get('/' , getRendezvous)
router.post('/' , addRendezvous)
router.put('/:id', updateRendezvous);
router.delete('/:id', deleteRendezvous);



module.exports = router