const User = require('../models/user');
const Course = require('../models/course');
const { existUserByEmail, existCourseByName, existStudentByEmail } = require('../helpers/db-validators');
const {isToken} = require('../helpers/tk-methods');


const addMeCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        const user = await isToken(req, res);
        const course = await existCourseByName(courseName);
        
        if (user.role !== 'STUDENT_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        const newUserObject = {
            id: user._id,
            name: user.nombre,
            mail: user.correo,
            role: user.role,
            status: user.estado
        };

        if (!course) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        } else if (course.estado !== true) {
            return res.status(400).json({ msg: `El curso ${course.name} no está activo.`});
        } else if (course.students.includes(newUserObject.id.toString())) {
            return res.status(400).json({  msg: `El estudiante ${newUserObject.name} || ${newUserObject.mail} ya está inscrito en el curso ${course.name}.` });
        } else if (course.students.length >= 10) {
            return res.status(400).json({ msg: `El curso ${course.name} ya tiene el máximo de estudiantes.`});
        };

        course.students.push(newUserObject.id);
        await course.save();

        return res.status(200).json({ msg: `El estudiante ${newUserObject.name} || ${newUserObject.mail} ha sido agregado al curso ${course.name}.` });
        
    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al agregar estudiante al curso.' });
        throw new Error(e);
    }
}

const myCourses = async (req, res) => {
    try {
        const user = await isToken(req, res);
        const courses = await Course.find({students: user._id});
        res.status(200).json({ courses });
    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al obtener los cursos del estudiante.' });
        throw new Error(e);
    }

}

const outMeCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        const user = await isToken(req, res);
        const course = await existCourseByName(courseName);
        
        if (user.role !== 'STUDENT_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        const newUserObject = {
            id: user._id,
            name: user.nombre,
            mail: user.correo,
            role: user.role,
            status: user.estado
        };
        
        if (!course) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        } else if (course.estado !== true) {
            return res.status(400).json({ msg: `El curso ${course.name} no está activo.`});
        } else if (!course.students.includes(newUserObject.id)) {
            return res.status(400).json({  msg: `El estudiante ${newUserObject.name} || ${newUserObject.mail} no está inscrito en el curso ${course.name}.` });
        }
        
        course.students = course.students.filter(student => String(student) !== String(newUserObject.id));
        await course.save();

        return res.status(200).json({ msg: `El estudiante ${newUserObject.name} || ${newUserObject.mail} ha sido eliminado del curso ${course.name}.` });
        
    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al eliminar estudiante del curso.' });
        throw new Error(e);
    }

}

module.exports = {
    addMeCourse,
    myCourses,
    outMeCourse
}