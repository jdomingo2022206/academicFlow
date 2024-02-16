const { response } = require('express');
const User = require('../models/user');
const { generarteJWT } = require("../helpers/generate-jwt");
const bycriptjs = require('bcryptjs');


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

const login = async (req, res) => {
    const { mail, password} = req.body;
    console.log(mail,password);
    try{
        const user = await User.findOne({ mail });
        console.log(user)
        if(!user){
            return res.status(400).json({
                msg: 'El correo no está registrado'
            })
        }

        // verificar si el user está activo
        if(!user.estado){
            return res.status(400).json({
                msg: 'El user no existe en la base de datos'
            })
        }
        // verificar que la contraseña sea la correcta
        const validPassword = bycriptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generarteJWT(user.id);

        res.status(200).json({
            msg: 'Login ok',
            user,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el admin'
        })
    }
}

module.exports = {
    usersLog,
    usersLogB,
    login
}