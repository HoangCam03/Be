const express = require('express');


const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.post('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser);
router.get('/getalluser', authMiddleware, userController.getAllUser);
router.get('/get-details/:id', authMiddleware, userController.getDetailUser);
router.post('/refresh-token', userController.refreshToken);
router.delete('/delete-many-user/', authMiddleware, userController.deleteManyUser);








module.exports = router;