const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUserByToken = async (token) => {
    if (!token) return { error: 'Acesso Negado!' };

    const { id: userId } = jwt.verify(token, 'nossosecret');
    return await User.findByPk(userId);
};

module.exports = getUserByToken;