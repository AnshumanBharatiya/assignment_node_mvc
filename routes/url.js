const express = require('express');
const {handelForm, handelRegister, handelLogin, handelDisplayForm} = require('../controllers/url');
const router = express.Router();

router.get('/:formType', handelForm);
router.get('/display-user/:userType/:message', handelDisplayForm);


router.post('/register', handelRegister);
router.post('/login', handelLogin);



module.exports = router;