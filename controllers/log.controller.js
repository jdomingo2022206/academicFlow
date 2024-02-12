const { response } = require('express');
const User = require('../models/user');

const usersLog = async (req, res = response ) => {
    const { email, pass } = req.query;
    const user = await User.findOne({correo: email, password: pass});
    if (user) {
        res.status(200).json({
            msg: 'Logeado exitosamente',
            user
        });    
    } else {
        res.status(410).json({
            msg1 : `Error: ` +email+` `+pass,
            msg: 'Credenciales Incorrectas usuarios Log'
        });
    }

    
}

const usersLogB = async (req, res = response ) => {
    const emailB = req.body.correo;
    const  passB = req.body.password;
    const userB = await User.findOne({correo: emailB, password: passB});
    if (userB) {
        res.status(200).json({
            msg: 'Logeado exitosamente',
            userB
        });    
    } else {
        res.status(410).json({
            msg1 : `Error: ` +emailB+` `+passB,
            msg: 'Credenciales Incorrectas usuarios LogB'
        });
    }

    
}

module.exports = {
    usersLog,
    usersLogB
}