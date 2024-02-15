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
        //check("name","El nombre es obligatorio").not().isEmpty(),
        check("name").custom(existentCourse),
        check("desc","La descripcion debe ser mayor a 15 caracteres").isLength({min: 15,}),
        check("teacher","Este no es un correo válido").isEmail(),
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
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("name").custom(existentCourse),
        check("desc","La descripcion debe ser mayor a 15 caracteres").isLength({min: 15,}),
        check("teacher","Este no es un correo válido").isEmail(),
        validateCampus
        //check("teacher").custom(teacherValid),
    ], coursePost); 
 
module.exports = router;