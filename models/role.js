const {Schema, model} = require('mongoose');

const RoleSchema = Schema ({
    role:{
        type:String,
        required: [true, "El ROLE es obligatorio"]
    }
});

module.exports = model ('Role', RoleSchema);