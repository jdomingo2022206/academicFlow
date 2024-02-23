const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');
const {isToken} = require('../helpers/tk-methods');
const User = require('../models/user');

const userGet = async (req, res = response ) => {
    console.log('');
    console.log('--- [NOTES] userGet.user')
    try {
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
    } catch (e) {
        console.log('Hubo un error al obtener usuarios.');
        // res.status(500).json({ msg: 'Hubo un error al obtener usuarios.' });
        // throw new Error(e);
    }
} 

const getUserByid = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] getUserById.user')
    try {
        const { id } = req.params;
        const usuario = await Usuario.findOne({_id: id});
        res.status(200).json({
            usuario
        });
    } catch (e) {
        console.log('Hubo un error al obtener el usuario por id.');
        // res.status(500).json({ msg: 'Hubo un error al obtener el usuario por id.' });
        // throw new Error(e);
    }
}

const userPut = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] userPut.user')
    try {
        const { id } = req.params;
        const { _id, password, google, correo, ...resto} = req.body;

        await Usuario.findByIdAndUpdate(id, resto);

        const usuario = await Usuario.findOne({_id: id});

        res.status(200).json({
            msg: 'Usuario Actualizado exitosamente',
            usuario
        })
    } catch (e) {
        console.log('Hubo un error al actualizar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al actualizar usuario.' });
        // throw new Error(e);
    }
}

const userDelete = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] userDelete.user')
    try {
        const {id} = req.params;
        await Usuario.findByIdAndUpdate(id,{estado: false});

        const usuario = await Usuario.findOne({_id: id});

        res.status(200).json({
            msg: 'Usuario eliminado exitosamente',
            usuario
        });
    } catch (e) {
        console.log('Hubo un error al eliminar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al eliminar usuario.' });
        // throw new Error(e);
    }
}

const userPost = async (req, res) =>{
    console.log('');
    console.log('--- [NOTES] userPost.user')
    try {
        const { nombre, correo, password} = req.body;
        const role = "STUDENT_ROLE"
        const usuario = new Usuario({nombre, correo, password, role});

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        res.status(200).json({
            usuario
        });
    } catch (e) {
        console.log('Hubo un error al agregar usuario.');
        // res.status(500).json({ msg: 'Hubo un error al agregar usuario.' });
        // throw new Error(e);
    }
}

const userTeacherPost = async (req, res) =>{
    console.log('');
    console.log('--- [NOTES] userTeacher.user')
    try {
        const { nombre, correo, password } = req.body;
        const role = "TEACHER_ROLE"
        const usuario = new Usuario({nombre, correo, password, role});

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        res.status(200).json({
            usuario
        });
    } catch (e) {
        console.log('Hubo un error al agregar profesor.');
        // res.status(500).json({ msg: 'Hubo un error al agregar profesor.' });
        // throw new Error(e);
    }
}

const editMyProfile = async (req, res) => {
    console.log('');
    console.log('--- [NOTES] editMyProfile.user')
    try { 
        const user = await isToken(req, res);
        const { _id, correo,role,  ...resto} = req.body;
        await User.findByIdAndUpdate(user._id, resto);
        const usuario = await User.findOne({_id: user.id});

        res.status(200).json({ msg: "Tu perfil se a actualizado exitosamente: ", usuario})
        
        
    }catch (e) {
        console.log('Hubo un error al editar el perfil.');
        // res.status(500).json({ msg: 'Hubo un error al editar el perfil.' });
        // throw new Error(e);
    }
}


module.exports = {
    userDelete,
    userPost,
    userTeacherPost,
    userGet,
    getUserByid,
    userPut,
    editMyProfile
}