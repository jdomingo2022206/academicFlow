const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CNN, {});
        console.log('RESOLVE: [DataBase connected successful]');
    }catch(e){
        throw new Error('FAIL: [DataBase connected unsuccessful]', e);
    }
};

module.exports = {
    dbConnection
}