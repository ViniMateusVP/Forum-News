const { DataTypes } = require("sequelize");
const db = require('../db/conn');
const bcrypt = require('bcrypt');

const User = db.define('User', {
    idusers: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userpassword: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('userpassword', hashedPassword);
        }
    }
});

module.exports = User;
