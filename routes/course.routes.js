const { Router } = require('express');
const { check } = require('express-validator');
const { validateCampus } = require('../middlewares/validate-campus');
const { existentCourseById, existentCourse } = require('../helpers/db-validators');
const {courseDelete, coursePost, courseGet, getCourseByid, coursePut} = require('../controllers/course.controller')
const { userDelete, userPost, userTeacherPost, userGet, getUserByid, userPut } = require('../controllers/user.controller');
const router = Router();

router.get("/", courseGet);

router.get(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existentCourseById),
        validateCampus
    ], getCourseByid);

router.put(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existentCourseById),
        validateCampus
    ], coursePut);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existentCourseById),
            validateCampus
        ], courseDelete);

        
router.post(
    "/", 
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("nombre").custom(existentCourse),
        check("descripcion","La descripcion debe ser mayor a 15 caracteres").isLength({min: 15,}),
        check("profesor (correo)","Este no es un correo válido").isEmail(),
        check("profesor (correo)").custom(teacherValid),
    ], coursePost); 
 
module.exports = router;