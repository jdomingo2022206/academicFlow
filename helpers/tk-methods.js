const jwt = require('jsonwebtoken');
const User = require('../models/user');

isToken = async (req, res) => {
    const token = req.headers['x-access-token'] ;
    if (!token) {
        return res.status(403).json({ msg: 'No se proporcionó un token.' });
    }
    const user = await verifyToken(token, res);
    return user;
}

verifyToken = async (token, res) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await Usuario.findOne({_id: decoded.id});
        if (!user) {return res.status(404).json({ msg: 'El usuario no existe.' });}
        if (!user.estado) {return res.status(400).json({ msg: 'El usuario no está activo.'});}
        return user;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'El token ha expirado, porfavor vuelve a iniciar sesion.' });
        }else{
            return res.status(401).json({ msg: 'Token no válido.' });
        }
    }

}

module.exports = {
    isToken
}