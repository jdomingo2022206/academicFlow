const jwt = require('jsonwebtoken');
const User = require('../models/user');

verifyToken = async (token) => {
    if (!token) {
        return res.status(403).json({ msg: 'No se proporcionó un token.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await Usuario.findOne({_id: decoded.id});
        if (!user) {return res.status(404).json({ msg: 'El usuario no existe.' });}
        if (!user.estado) {return res.status(400).json({ msg: 'El usuario no está activo.'});}
        return user;
    } catch (error) {
        return res.status(401).json({ msg: 'No autorizado.' });
    }

}