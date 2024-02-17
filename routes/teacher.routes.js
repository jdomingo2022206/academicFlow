const { Router } = require('express');
const { check } = require('express-validator');
const { createMyCourse, myCourses, deleteMeCourse} = require('../controllers/teacher.controller');
const {validateCampus} = require('../middlewares/validate-campus');
const router = Router();

router.post('/createMyCourse', [
    check('courseName', 'El nombre del curso es obligatorio').not().isEmpty(),
    validateCampus
], createMyCourse);

router.get('/myCourses',myCourses);

router.post('/deleteMeCourse', [
    check('courseName', 'El nombre del curso es obligatorio').not().isEmpty(),
    validateCampus
], deleteMeCourse);

module.exports = router;