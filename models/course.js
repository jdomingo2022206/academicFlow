const { Schema, model, now} = require('mongoose');

const CourseSchema = Schema ({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    desc: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    img:{
        type: String
    },
    teacherId: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El profesor es obligatorio']
    },
    teacherName: { 
        type: String,
        required: [true, 'El profesor nombre es obligatorio']
    },
    teacherMail: { 
        type: String,
        required: [true, 'El profesor email es obligatorio']
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'//, 
        //required: [true, 'Al menos un estudiante es obligatorio']
    }],
    estado:{
        type: Boolean,
        default: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Course', CourseSchema);