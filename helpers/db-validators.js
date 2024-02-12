const User = require('../models/user');
const Role = require('../models/role');
const Course = require('../models/course');

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

const existentCourseById = async ( id = '') => {
    const existCourse = await Course.findOne({id});
    if(existCourse){
        throw new Error(`El curso con el ${ id } no existe`);
    }
}

const existentCourse = async (name = '') => {
    const existCourse = await Course.findOne({name});
    if(existCourse){
        throw new Error(`El email ${ name } ya fue registrado`);
    }
}

const teacherValid = async (correo='') => {
    const existTeacher = await User.findOne({correo});

    if(!existRole){
        throw new Error(`El profesor ${ correo } no existe en base de datos.` )
    }
}

module.exports = {
    existentEmail,
    existentUserById,
    roleValid,
    existentCourseById,
    existentCourse,
    teacherValid
}