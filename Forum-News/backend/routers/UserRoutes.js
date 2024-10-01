const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.get('/ranking', UserController.ranking)
router.put('/:userId/score', UserController.setUserScore);
router.get('/email/:email', UserController.getUserByEmail);

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;