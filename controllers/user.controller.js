const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const {isToken} = require('../helpers/tk-methods');

const userGet = async (req, res = response ) => {
    const { limite, desde } = req.query;
    const query = { estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
} 

const getUserByid = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findOne({_id: id});

    res.status(200).json({
        usuario
    });
}

const userPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    await Usuario.findByIdAndUpdate(id, resto);

    const usuario = await Usuario.findOne({_id: id});

    res.status(200).json({
        msg: 'Usuario Actualizado exitosamente',
        usuario
    })
}

const userDelete = async (req, res) => {
    const {id} = req.params;
    await Usuario.findByIdAndUpdate(id,{estado: false});

    const usuario = await Usuario.findOne({_id: id});

    res.status(200).json({
        msg: 'Usuario eliminado exitosamente',
        usuario
    });
}

const userPost = async (req, res) =>{
    const { nombre, correo, password} = req.body;
    const role = "STUDENT_ROLE"
    const usuario = new Usuario({nombre, correo, password, role});

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

const userTeacherPost = async (req, res) =>{
    const { nombre, correo, password } = req.body;
    const role = "TEACHER_ROLE"
    const usuario = new Usuario({nombre, correo, password, role});

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}


module.exports = {
    userDelete,
    userPost,
    userTeacherPost,
    userGet,
    getUserByid,
    userPut
}