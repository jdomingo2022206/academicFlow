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

    if (existCourse) {
        throw new Error(`El curso ${name} ya fue registrado`);
    }
}

const teacherValid = async (correo='') => {
    const existTeacher = await User.findOne({correo});

    if(!existTeacher){
        throw new Error(`El profesor ${ correo } no existe en base de datos.` )
    }
}

const existUserByEmail  = async (correo='') => {
    try {
        const user = await User.findOne({correo});
        if (user) {
            return {
                id: user._id,
                name: user.nombre,
                email: user.correo,
                status: user.estado
            };
        } else {
            console.log(`El user ${ correo } no existe en base de datos.` );
            //throw new Error(`El user ${ correo } no existe en base de datos.` );
            return null; 
        }
    } catch (error) {
        console.log('Error al buscar usuario por correo electrónico:', error);
        //console.error('Error al buscar usuario por correo electrónico:', error);
        throw error; 
    }
}

const existCourseByName  = async (name='') => {
    try {
        const course = await Course.findOne({name});
        if (course) {
            return {
                id: course._id,
                name: course.name,
                desc: course.desc,
                teacherName: course.teacherName,
                teacherMail: course.teacherMail,
                status: course.estado
            };
        } else {
            console.log(`El curso ${ name } no existe en base de datos.` )
            //throw new Error(`El curso ${ name } no existe en base de datos.` )
            return null; 
        }
    } catch (error) {
        console.log('Error al buscar curso por nombre:', error);
        //console.error('Error al buscar curso por nombre:', error);
        //throw error; 
    }
}

const existStudentByEmail  = async (correo='') => {
    try {
        const user = await User.findOne({correo});
        if (user) {
            return {
                user
            };
        } else {
            console.log(`El estudiante ${ correo } no existe en base de datos.` )
            //throw new Error(`El estudiante ${ correo } no existe en base de datos.` )
            return null; 
        }
    } catch (error) {
        console.log('Error al buscar estudiante por correo electrónico:', error);
        //console.error('Error al buscar estudiante por correo electrónico:', error);
        //throw error; 
    }
}
module.exports = {
    existentEmail,
    existentUserById,
    roleValid,
    existentCourseById,
    existentCourse,
    existUserByEmail,
    teacherValid,
    existCourseByName,
    existStudentByEmail
}