const { response, json } = require('express');
const Course = require('../models/course');
const { existUserByEmail } = require('../helpers/db-validators');

const courseGet = async (req, res = response ) => {
    const { limite, desde } = req.query;
    const query = { estado: true};

    const [total, courses] = await Promise.all([
        Course.countDocuments(query),
        Course.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        courses
    });
} 

const getCourseByid = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findOne({_id: id});

    res.status(200).json({
        course
    });
}

const coursePut = async (req, res) => {
    const { id } = req.params;
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
    }
}


const courseDelete = async (req, res) => {
    const {id} = req.params;
    await Course.findByIdAndUpdate(id,{estado: false});

    const course = await Course.findOne({_id: id});

    res.status(200).json({
        msg: 'Curso eliminado exitosamente',
        course
    });
}

const coursePost = async (req, res) => {
    const { name, desc, teacher } = req.body;  
    try {
        const teacherInfo = await existUserByEmail(teacher);
        if (!teacherInfo) {
            return res.status(400).json({ msg: `El profesor ${teacher} no existe en base de datos.`});
        }
        if (!teacherInfo.status === true) {
            return res.status(400).json({ msg: `El profesor ${teacherInfo.name} || ${teacherInfo.email} no esta acitvo.`});
        }
        const course = new Course({ name, desc, teacherId: teacherInfo.id, teacherName: teacherInfo.name, teacherMail: teacherInfo.email});
        await course.save();
        res.status(200).json({ course });
    } catch (error) {
        console.error('Error al crear el curso:', error);
        res.status(500).json({ msg: 'Hubo un error al crear el curso.' });
    }
}

module.exports = {
    courseDelete,
    coursePost,
    courseGet,
    getCourseByid,
    coursePut
}