const { Router } = require('express');
const { check } = require('express-validator');
const { createMyCourse, myCourses, deleteMeCourse, editMyProfile} = require('../controllers/teacher.controller');
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

router.put('/editMyProfile', editMyProfile);

module.exports = router;