const User = require("../models/User");
const Post = require("../models/Post");
const PostLikes = require('../models/PostLikes');
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: !email ? "O e-mail é obrigatório" : "A senha é obrigatória" });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.userpassword))) {
    return res.status(422).json({ message: "E-mail ou senha inválidos!" });
  }

  await createUserToken(user, req, res);
};

const register = async (req, res) => {
  const { username, email, password, confirmPassword, state, city } = req.body;

  if (![username, email, city, state, password, confirmPassword].every(Boolean)) {
    return res.status(422).json({ message: "Todos os campos são obrigatórios!" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ message: "As senhas precisam ser iguais!" });
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
  }

  try {

    const newUser = await User.create({ username, email, state, city, userpassword: password });
    await createUserToken(newUser, req, res);
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário." });
  }
};

const createUser = async (req, res) => {
  const { userusername, userpassword, score } = req.body;
  try {
    const newUser = await User.create({ userusername, userpassword, score });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: Post });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

const ranking = async (req, res) => {
  try {
    const scores = await User.findAll({
      attributes: ["idusers", "username", "score"],
      order: [["score", "DESC"]],
    });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar ranking." });
  }
};

const setUserScore = async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Acesso Negado! Token não fornecido." });
    }

    const user = await User.findOne({ where: { idusers: req.params.userId } });
    user.score += req.body.value ? 1 : -1;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar pontuação do usuário." });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email }, include: Post });
    user ? res.status(200).json(user) : res.status(404).json({ message: "Usuário não encontrado." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      Object.assign(user, req.body);
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json({ message: "Usuário deletado." });
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário." });
  }
};

module.exports = {
  login,
  register,
  createUser,
  getAllUsers,
  ranking,
  setUserScore,
  getUserByEmail,
  updateUser,
  deleteUser,
};
