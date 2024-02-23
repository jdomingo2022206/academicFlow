const User = require('../models/user');
const Course = require('../models/course');
const { existCourseByName} = require('../helpers/db-validators');
const {isToken} = require('../helpers/tk-methods');


const createMyCourse = async (req, res) => {
    console.log('')
    console.log('--- [NOTES] createMyCourse.teacher')
    try {   
        const { courseName, desc } = req.body;  
        const user = await isToken(req, res);
        if (!user){
            return;
        }
        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        const name = courseName;
        const course = new Course({name, desc, teacherId: user._id, teacherName: user.nombre, teacherMail:user.correo}) 
        await course.save();
        res.status(200).json({ course });
    } catch (error) {
        console.log('Hubo un error al crear el curso.')
        // console.error('Error al crear el curso:', error);
        // res.status(500).json({ msg: 'Hubo un error al crear el curso.' });
    }
        
        
}

const myCourses = async (req, res) => {
    console.log('')
    console.log('--- [NOTES] myCourses.teacher')
    try {
        const user = await isToken(req, res);
        const courses = await Course.find({teacherId: user._id});
        res.status(200).json({ courses });
    } catch (e) {
        console.log('Hubo un error al obtener los cursos del profesor.');
        // res.status(500).json({ msg: 'Hubo un error al obtener los cursos del profesor.' });
        // throw new Error(e);
    }

}

const deleteMeCourse = async (req, res) => {
    console.log('')
    console.log('--- [NOTES] deleteMeCourse.teacher')
    try {
        const { courseName } = req.body;
        const user = await isToken(req, res);
        const course = await existCourseByName(courseName);
        
        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({ msg: 'No estas autorizado.' });
        }
        
        console.log("Id de los teacher course: "+course.teacherId.toString());
        console.log("Id de los teacher usersd: "+user._id);
        if (!course) {
            return res.status(400).json({ msg: `El curso ${courseName} no existe en la base de datos.`});
        } else if (course.teacherId.toString() !== user._id) {
            return res.status(400).json({ msg: `El profesor ${user.nombre} || ${user.correo} no es el dueño del curso ${course.name}.`});
        }
        
        course.estado = false;
        await course.save();
        res.status(200).json({ msg: `El curso ${course.name} ha sido eliminado.` });
    } catch (e) {
        console.log('Hubo un error al eliminar el curso.')
        // res.status(500).json({ msg: 'Hubo un error al eliminar el curso.' });
        // throw new Error(e);
    }
}

const editMyProfile = async (req, res) => {
    try {
        const user = await isToken(req, res);
        const { _id, correo,role,estado,  ...resto} = req.body;
        await User.findByIdAndUpdate(user._id, resto);
        const usuario = await User.findOne({_id: user.id});

        res.status(200).json({ msg: "Tu perfil se a actualizado exitosamente: ", usuario})
        
        
    }catch (e) {
        console.log('Hubo un error al editar el perfil.')
        // res.status(500).json({ msg: 'Hubo un error al editar el perfil.' });
        // throw new Error(e);
    }
}

module.exports = {
    createMyCourse,
    myCourses,
    deleteMeCourse,
    editMyProfile
}