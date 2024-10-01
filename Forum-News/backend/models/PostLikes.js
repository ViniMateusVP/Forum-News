const { DataTypes } = require("sequelize")
const db = require('../db/conn')

const PostLikes = db.define('PostLikes', {
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts',
            key: 'idposts'
        },
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'idusers',
        },
        primaryKey: true
    }
});

module.exports = PostLikes;
