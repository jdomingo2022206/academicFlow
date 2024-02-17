const User = require('../models/user');
const Course = require('../models/course');
const { existUserByEmail, existCourseByName, existStudentByEmail } = require('../helpers/db-validators');
const {isToken} = require('../helpers/tk-methods');

addMeCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        const user = await isToken(req, res);
        const courseInfo = await existCourseByName(courseName);
        if (user.role !== 'STUDENT_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        const newUserObject = {
            nombre: user.nombre,
            correo: user.correo,
            role: user.role,
            estado: user.estado
        };
    
        if (!courseInfo) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        } else if (!courseInfo.status === true) {
            return res.status(400).json({ msg: `El curso ${courseInfo.name} no está activo.`});
        } else if (course.students.includes(newUserObject._id)) {
            return res.status(400).json({  msg: `El estudiante ${studentInfo.name} || ${studentInfo.email} ya está inscrito en el curso ${courseInfo.name}.` });
        } else if (courseInfo.students.length >= 10) {
            return res.status(400).json({ msg: `El curso ${courseInfo.name} ya tiene el máximo de estudiantes.`});
        };

        courseInfo.students.push(newUserObject._id);
        await courseInfo.save();

    } catch (e) {
        res.status(500).json({ msg: 'Hubo un error al agregar estudiante al curso.' });
        throw new Error(e);
    }
}

const coursePut = async (req, res) => {
    const { teacher: newTeacherEmail, ...resto } = req.body;

    try {
        const newTeacherInfo = await existUserByEmail(newTeacherEmail);
        if (!newTeacherInfo) {
            return res.status(400).json({ msg: `El profesor ${newTeacherEmail} no existe en la base de datos.`});
        }
        if (!newTeacherInfo.status === true) {
            return res.status(400).json({ msg: `El profesor ${newTeacherInfo.name} || ${newTeacherInfo.email} no está activo.`});
        }
        const updatedFields = {
            ...resto,
            teacherId: newTeacherInfo.id,
            teacherName: newTeacherInfo.name,
            teacherMail: newTeacherInfo.email
        };

        await Course.findByIdAndUpdate(id, updatedFields);

        const updatedCourse = await Course.findOne({ _id: id });

        res.status(200).json({
            msg: 'Curso actualizado exitosamente',
            course: updatedCourse
        });
    } catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).json({ msg: 'Hubo un error al actualizar el curso.' });
        throw new Error(e);
    }
}

module.exports = {
    addMeCourse
}