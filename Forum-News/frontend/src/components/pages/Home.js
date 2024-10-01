import React from "react";
import MyPosts from "./Post/MyPostsList.js";
import CommunityPosts from "./Post/PostsList.js";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div>
      <div className={styles.postsListContainer}>
        <div className={styles.myPostsContainer}>
          <MyPosts />
        </div>
        <div className={styles.communityPostsContainer}>
          <CommunityPosts />
        </div>
      </div>
    </div>
  );
};

export default Home;
