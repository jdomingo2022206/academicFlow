const { Router } = require('express');
const { check } = require('express-validator');
const { addMeCourse } = require('../controllers/student.controller');
const {validateCampus} = require('../middlewares/validate-campus');
const router = Router();

router.post('/addMeCourse', [
    check('studentMail', 'El correo del estudiante es obligatorio').isEmail(),
    check('courseName', 'El nombre del curso es obligatorio').not().isEmpty(),
    validateCampus
], addMeCourse);

module.exports = router;