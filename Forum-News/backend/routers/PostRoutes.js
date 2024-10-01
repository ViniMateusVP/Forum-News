const express = require("express");
const PostController = require("../controllers/PostController");
const router = express.Router();

const verifyToken = require('../helpers/verify-token');


router.get("/getAllMyPosts", verifyToken, PostController.getAllMyPosts);
router.get("/getAllPosts", PostController.getAllPosts);
router.get("/getAllMyPostsLikes", verifyToken, PostController.getAllMyPostsLikes);
router.get('/local', verifyToken, PostController.getAllMyPostslocal);

router.put("/:id/like", PostController.addRemovePostLike);
router.get("/:postId/checkLike", PostController.checkLike);

router.post("/", PostController.createPost);
router.delete("/:id", PostController.deletePost);
router.get("/:id", PostController.getPostById);

module.exports = router;
