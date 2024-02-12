const User = require('../models/user');
const Role = require('../models/role');

const existentEmail = async (correo = '') => {
    const existMail = await User.findOne({correo});
    if(existMail){
        throw new Error(`El email ${ correo } ya fue registrado`);
    }
}

const existentUserById = async ( id = '') => {
    const existUser = await User.findOne({id});
    if(existUser){
        throw new Error(`El usuario con el ${ id } no existe`);
    }
}

const roleValid = async (role='') => {
    const existRole = await Role.findOne({role});

    if(!existRole){
        throw new Error(`El role ${ role } no existe en base de datos.` )
    }
}

module.exports = {
    existentEmail,
    existentUserById,
    roleValid
}