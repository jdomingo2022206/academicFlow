const User = require('../models/user');
const Course = require('../models/course');
const { existCourseByName} = require('../helpers/db-validators');
const {isToken} = require('../helpers/tk-methods');


const createMyCourse = async (req, res) => {
    try {   
        const { courseName, desc } = req.body;  
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        const course = new Course({ courseName, desc, teacherId: user._id, teacherName: user.nombre, teacherMail:user.correo});
        await course.save();
        res.status(200).json({ course });
    } catch (error) {
        console.error('Error al crear el curso:', error);
        res.status(500).json({ msg: 'Hubo un error al crear el curso.' });
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

const deleteMeCourse = async (req, res) => {
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
    createMyCourse,
    myCourses,
    deleteMeCourse
}