const { Router } = require('express');
const { check } = require('express-validator');
const { addMeCourse, myCourses, outMeCourse } = require('../controllers/student.controller');
const {validateCampus} = require('../middlewares/validate-campus');
const router = Router();

router.post('/addMeCourse', [
    check('courseName', 'El nombre del curso es obligatorio').not().isEmpty(),
    validateCampus
], addMeCourse);

router.get('/myCourses',myCourses);

router.post('/outMeCourse', [
    check('courseName', 'El nombre del curso es obligatorio').not().isEmpty(),
    validateCampus
], outMeCourse);

module.exports = router;