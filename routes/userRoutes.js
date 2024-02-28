const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/dashboard',authMiddleware,userController.dashboard)
router.post('/shorten',authMiddleware,userController.shorten) 
router.get('/getData',authMiddleware,userController.getData) 
router.delete('/delete',authMiddleware,userController.deleteLink) 
router.put('/edit',authMiddleware,userController.edit) 

module.exports = router;