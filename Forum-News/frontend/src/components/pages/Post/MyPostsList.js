import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MyPostsList.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import PostLikeManager from "../../../utils/PostLikeManager";

const MyPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [markers, setMarkers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLikes, setLoadingLikes] = useState({});
  const [users, setUsers] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const { authenticated } = useAuth();
  const [fadeOutPostId, setFadeOutPostId] = useState(null);
  const navigate = useNavigate();

  const handleError = (error) => {
    console.error("An error occurred:", error.message || error);
    setErrorMessage("Erro ao processar a solicitação. Tente novamente.");
  };
  useEffect(() => {
    const fetchData = async () => {
      await PostLikeManager.fetchMyPostsAndLikes(
        setPosts,
        setUsers,
        setLikedPostIds,
        setMarkers
      );
    };
    fetchData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/posts/",
        { content: newPostContent },
        { headers: { Authorization: `Bearer ${JSON.parse(token)}` } }
      );
      setPosts([data, ...posts]);
      setNewPostContent("");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    setFadeOutPostId(postId);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      setTimeout(() => {
        setPosts(posts.filter((post) => post.idposts !== postId));
        setFadeOutPostId(null);
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setFadeOutPostId(null);
    }
  };

  const handleToggleLike = (postId) => {
    PostLikeManager.toggleLike(
      postId,
      posts,
      setPosts,
      likedPostIds,
      setLikedPostIds,
      setMarkers,
      loadingLikes,
      setLoadingLikes,
      navigate
    );
  };

  return (
    <div className={styles.scrollablePostsContainer}>
      <h1>Meus Posts</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.postsListWrapper}>
          {authenticated ? (
            <>
              <div className={styles.postForm}>
                <form
                  onSubmit={handleCreatePost}
                  className={styles.createPostForm}
                >
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Escreva seu post..."
                    className={styles.newPostTextArea}
                  />
                  <button
                    type="submit"
                    className={styles.createPostButton}
                    disabled={isLoading}
                  >
                    Criar Post
                  </button>
                </form>
              </div>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    className={styles.postItem}
                    key={post.idposts}
                    style={{
                      opacity: fadeOutPostId === post.idposts ? 0 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <p>{post.content}</p>

                    <div
                      className={styles.deleteContainer}
                      onClick={() => handleDelete(post.idposts)}
                    >
                      <div className={styles.deleteIcon}>
                        <span>&#128465;</span>{" "}
                      </div>
                    </div>

                    <div
                      className={styles.markerContainer}
                      onClick={() => handleToggleLike(post.idposts)}
                    >
                      <div
                        className={`${styles.marker} ${
                          likedPostIds.includes(post.idposts) ||
                          markers[post.idposts]
                            ? styles.active
                            : ""
                        }`}
                      />
                    </div>
                    <div className={styles.postHeader}>
                      <span>Likes: {post.likes}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noPostsMessage}>
                  <p>Nenhum post disponível</p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noPostsMessage}>
              <p>Faça login ou registre-se.</p>
              <button
                onClick={() => navigate("/login")}
                className={styles.navigationButton}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className={styles.navigationButton}
              >
                Registro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPostsList;
