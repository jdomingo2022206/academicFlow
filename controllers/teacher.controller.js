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
        const courses = await Course.find({teacherId: user._id});
        res.status(200).json({ courses });
    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al obtener los cursos del profesor.' });
        throw new Error(e);
    }

}

const deleteMeCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        const user = await isToken(req, res);
        const course = await existCourseByName(courseName);
        
        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        if (!course) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        } else if (course.teacherId !== user._id) {
            return res.status(400).json({ msg: `El profesor ${user.nombre} || ${user.correo} no es el dueño del curso ${course.name}.`});
        }
        
        course.estado = false;
        await course.save();
        res.status(200).json({ msg: `El curso ${course.name} ha sido eliminado.` });
    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al eliminar el curso.' });
        throw new Error(e);
    }
}

module.exports = {
    createMyCourse,
    myCourses,
    deleteMeCourse
}