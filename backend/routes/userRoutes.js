const express = require('express');
const userControllers = require('../controllers/userControllers');
const checkAuth = require('../middleware/checkAuth');
const {check} = require('express-validator');

const router = express.Router();

router.post('/signup', [check('username').isLength({min: 1}).withMessage('Username is empty.'), check('email').normalizeEmail().isEmail().withMessage('Email is invalid.'), check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')], userControllers.signup);
router.post('/login', userControllers.login);
router.use(checkAuth);
router.get('/', userControllers.getLists);
router.get('/:listId', userControllers.getListById);
router.patch('/update/:listId', userControllers.updateList);
router.patch('/delete/:listId', userControllers.deleteList);
router.patch('/', userControllers.createList);

module.exports = router;