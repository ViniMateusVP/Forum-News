import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PostsList.module.css";
import { useNavigate } from "react-router-dom";
import PostLikeManager from "../../../utils/PostLikeManager";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [markers, setMarkers] = useState({});
  const [loadingLikes, setLoadingLikes] = useState({});
  const [users, setUsers] = useState([]);
  const [apiChoice, setApiChoice] = useState("local");
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setShowOptions(false);
      if (apiChoice === "local" && token) {
        await PostLikeManager.fetchPostsLocals(
          setPosts,
          setLikedPostIds,
          setMarkers
        );
      } else {
        await PostLikeManager.fetchPostsAndLikes(
          setPosts,
          setLikedPostIds,
          setMarkers
        );
      }

      const usersResponse = await axios.get("http://localhost:5000/users");
      setUsers(usersResponse.data);
    };
    fetchData();
  }, [apiChoice]);

  const getUser = (userId) => {
    const user = users.find((user) => user.idusers === userId);
    return user ? user : { username: "Unknown", state: "Unknown", city: "Unknown" };
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

  const handleApiChange = (value) => {
    setApiChoice(value);
    setShowOptions(false);
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div>
      <div className={styles.headerContainer}>
        <h1>Community Posts</h1>
        <div
          className={styles.select_container}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <div className={styles.custom_select} onClick={toggleOptions}>
            <div className={styles.selected_option}>
              {apiChoice === "local" ? "Local" : "Global"}
            </div>
            <div
              className={styles.arrow + " " + (showOptions ? styles.open : "")}
            />
            {showOptions && (
              <ul className={styles.options_list}>
                <li
                  className={styles.option}
                  onClick={() => handleApiChange("local")}
                >
                  Local
                </li>
                <li
                  className={styles.option}
                  onClick={() => handleApiChange("all")}
                >
                  Global
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={styles.postsListWrapper}>
        {posts.length > 0 ? (
          posts.map((post) => {
            const userCurrent = getUser(post.userId);
            return (
              <div key={post.idposts} className={styles["post-item"]}>
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
                  <p className={styles.postName}>
                    <strong>{userCurrent.username.toUpperCase()}</strong>
                  </p>
                  <span>Likes: {post.likes}</span>
                </div>
                <div className={styles.postsMiddle}>
                  <p>
                    <strong>{post.content}</strong>
                  </p>
                </div>
                <div className={styles.postsFooter}>
                  <p>
                    <strong>
                      <span>
                        {userCurrent.state.toUpperCase()},{" "}
                        {userCurrent.city.toUpperCase()}
                      </span>
                      : {new Date(post.createdAt).toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default PostsList;
