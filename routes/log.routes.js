const { Router } = require('express');
const { check } = require('express-validator');
const { usersLog, usersLogB, login } = require('../controllers/log.controller');
const { validateCampus } = require('../middlewares/validate-campus');
const router = Router();

router.get("/", usersLog);

router.get("/cryp", usersLogB);

// router.post(
//     '/login',
//     [
//         check('correo','Este no es un correo válido').isEmail(),
//         check('password','La contraseña es obligatoria').not().isEmpty(),
//         validarCampos
//     ], login);
router.post(
    "/login", login);

module.exports = router;