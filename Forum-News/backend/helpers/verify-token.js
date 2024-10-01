const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

const checkToken = (req, res, next) => {
    const token = getToken(req);
    
    if (!token) {
        return res.status(401).json({ message: 'Acesso Negado!' });
    }

    try {
        req.user = jwt.verify(token, 'nossosecret');
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido!' });
    }
};

module.exports = checkToken;
