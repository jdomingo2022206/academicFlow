const { response, json } = require('express');
const Course = require('../models/course');

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
    const { _id, ...resto} = req.body;

    await Course.findByIdAndUpdate(id, resto);

    const course = await Course.findOne({_id: id});

    res.status(200).json({
        msg: 'Curso actualizado exitosamente',
        course
    })
}

const courseDelete = async (req, res) => {
    const {id} = req.params;
    await Course.findByIdAndUpdate(id,{estado: false});

    const course = await Course.findOne({_id: id});

    res.status(200).json({
        msg: 'Usuario eliminado exitosamente',
        course
    });
}

const coursePost = async (req, res) =>{
    const { name, desc, teacher} = req.body;
    //new Course(req.body);
    const course = new Course({name, desc, teacher});

    await course.save();
    res.status(200).json({
        course
    });
}

module.exports = {
    courseDelete,
    coursePost,
    courseGet,
    getCourseByid,
    coursePut
}