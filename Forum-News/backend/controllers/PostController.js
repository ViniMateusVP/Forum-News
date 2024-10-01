const User = require("../models/User");
const Post = require("../models/Post");
const PostLikes = require('../models/PostLikes');
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "O conteúdo do post é obrigatório" });

    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const newPost = await Post.create({ userId: user.idusers, content });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Falha ao criar o post" });
  }
};

const getAllMyPostsLikes = async (req, res) => {
  try {
    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(401).json({ message: 'Acesso Negado!' });

    const likedPostIds = (await PostLikes.findAll({ where: { userId: user.idusers } }))
      .map(like => like.postId);
      
    res.json({ likedPostIds });
  } catch (error) {
    res.status(500).send("Erro ao buscar posts curtidos.");
  }
};

const getAllMyPostslocal = async (req, res) => {
  try {
    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(401).json({ message: "Acesso Negado!" });

    const posts = await Post.findAll({
      include: {
        model: User,
        where: { state: user.state, city: user.city },
        attributes: ["idusers", "username", "state", "city"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts locais" });
  }
};

const addRemovePostLike = async (req, res) => {
  try {
    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(401).json({ message: 'Acesso Negado!' });

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).send("Post não encontrado");

    const like = await PostLikes.findOne({ where: { postId: post.idposts, userId: user.idusers } });

    if (like) {
      await like.destroy();
      post.likes -= 1;
    } else {
      await PostLikes.create({ postId: post.idposts, userId: user.idusers });
      post.likes += 1;
    }

    await post.save();
    res.json({ post, likedByCurrentUser: !like });
  } catch (error) {
    res.status(500).send("Erro ao curtir/descadastrar post.");
  }
};

const checkLike = async (req, res) => {
  try {
    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(401).json({ message: 'Acesso Negado!' });

    const like = await PostLikes.findOne({ where: { postId: req.params.postId, userId: user.idusers } });
    res.json({ hasLiked: !!like });
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar curtida" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ include: User });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
};

const getAllMyPosts = async (req, res) => {
  try {
    const user = await getUserByToken(getToken(req));
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const posts = await Post.findAll({
      where: { userId: user.idusers },
      include: { model: User, attributes: ["idusers", "username"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts", detalhes: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { include: User });
    if (post) res.status(200).json(post);
    else res.status(404).json({ error: "Post não encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar post" });
  }
};

const deletePost = async (req, res) => {
  try {
    await PostLikes.destroy({ where: { postId: req.params.id } });

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post não encontrado" });

    await post.destroy();
    res.status(204).json({ message: "Post deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar post" });
  }
};

module.exports = {
  createPost,
  getAllMyPostsLikes,
  getAllMyPostslocal,
  addRemovePostLike,
  checkLike,
  getAllPosts,
  getPostById,
  getAllMyPosts,
  deletePost,
};