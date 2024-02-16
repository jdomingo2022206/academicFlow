const User = require('../models/user');
const Course = require('../models/course');
const { existUserByEmail, existCourseByName, existStudentByEmail } = require('../helpers/db-validators');

addMeCourse = async (req, res) => {
    const { studentMail, courseName } = req.body;
    try {
        const studentInfo = await existUserByEmail(studentMail);
        const studentObj = await existStudentByEmail(studentMail);
        const courseInfo = await existCourseByName(courseName);
        if (studentInfo&&studentObj) {
            /*if (!studentInfo) {
                return res.status(400).json({ msg: `El estudiante ${studentMail} no existe en la base de datos.`});
            }*/
            if (!studentInfo.status === true) {
                return res.status(400).json({ msg: `El estudiante ${studentInfo.name} || ${studentInfo.email} no está activo.`});
            }    
        } else {
            return res.status(400).json({ msg: `El estudiante ${studentMail} no existe en la base de datos.`});
        }
        
        if (!courseInfo) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        }
        if (!courseInfo.status === true) {
            return res.status(400).json({ msg: `El curso ${courseInfo.name} no está activo.`});
        }
        const studentInCourse = courseInfo.students.find(student => student.toString() === studentInfo.id.toString());
        if (studentInCourse) {
            return res.status(400).json({ msg: `El estudiante ${studentInfo.name} || ${studentInfo.email} ya está inscrito en el curso ${courseInfo.name}.`});
        }
        courseInfo.students.push(studentObj);
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