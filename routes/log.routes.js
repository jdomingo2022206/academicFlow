const { Router } = require('express');
const { check } = require('express-validator');
const { usersLog, usersLogB } = require('../controllers/log.controller');
const router = Router();

router.get("/", usersLog);

router.get("/cryp", usersLogB);

module.exports = router;