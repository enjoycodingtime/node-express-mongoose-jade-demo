var express = require('express');
var IndexController = require('../controllers/index');
var UserController = require('../controllers/user');
var router = express.Router();

/* GET home page. */
router.get('/',  IndexController.index);
router.get('/register',IndexController.renderRegisterPage);
router.post('/register',UserController.register);
router.get('/login',IndexController.login);
router.post('/login',UserController.login);
router.get('/logout',UserController.logout);
router.get('/profile',UserController.viewProfile);
router.post('/profile',UserController.profile);
router.get('/password',UserController.renderPasswordPage);




module.exports = router;
