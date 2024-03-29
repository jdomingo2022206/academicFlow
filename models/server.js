const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/academic/user';
        this.studentPath = '/academic/student';
        this.teacherPath = '/academic/teacher';
        this.logPath = '/academic/log';
        this.coursePath = '/academic/course';

        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.userPath, require('./../routes/user.routes'));
        this.app.use(this.studentPath, require('./../routes/student.routes'));
        this.app.use(this.teacherPath, require('./../routes/teacher.routes'));
        this.app.use(this.logPath, require('./../routes/log.routes'));
        this.app.use(this.coursePath, require('./../routes/course.routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Sever on and listen in the port: ', this.port);
        });
    }
}
module.exports = Server;
