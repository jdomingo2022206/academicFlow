const { Router } = require('express');
const { check } = require('express-validator');
const { validateCampus } = require('../middlewares/validate-campus');
const { existentEmail, existentUserById, roleValid} = require('../helpers/db-validators');
const { userDelete, userPost, userTeacherPost, userGet, getUserByid, userPut, editMyProfile } = require('../controllers/user.controller');
const router = Router();

router.get("/", userGet);

router.put('/editMyProfile', editMyProfile);

router.get(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existentUserById),
        validateCampus
    ], getUserByid);

router.put(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existentUserById),
        validateCampus
    ], userPut);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existentUserById),
            validateCampus
        ], userDelete);

        
router.post(
    "/", 
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existentEmail),
        check("role").custom(roleValid),
    ], userPost); 

router.post(
    "/teacher", 
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existentEmail),
        validateCampus,
    ], userTeacherPost); 



module.exports = router;