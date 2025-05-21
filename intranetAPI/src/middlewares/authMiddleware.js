const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Co23pi08cO';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(403).json({message: 'Token requerido'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.status(401).json({message: 'Token inválido'});

        req.user = user;
        next();
    });
};

module.exports = verificarToken;