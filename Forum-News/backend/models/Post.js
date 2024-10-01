const { DataTypes } = require("sequelize");
const User = require("./User");
const db = require("../db/conn");

const Post = db.define("Post", {
  idposts: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "idusers",
    },
  },
});

// Relacionamentos
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
