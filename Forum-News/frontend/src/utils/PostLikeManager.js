import axios from "axios";

class PostsLikeManager {
  static getToken() {
    return localStorage.getItem("token");
  }

  static async fetchMyPostsAndLikes(setPosts, setUsers, setLikedPostIds, setMarkers) {
    try {
      const token = this.getToken();
      const postsResponse = await axios.get("http://localhost:5000/posts/getAllMyPosts", {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      setPosts(postsResponse.data.posts);

      const usersResponse = await axios.get("http://localhost:5000/users");
      setUsers(usersResponse.data);

      this.getLikedPosts(setLikedPostIds, setMarkers);
    } catch (error) {
      console.error("Erro ao buscar dados:", error.response ? error.response.data : error.message);
    }
  }

  static async fetchPostsLocals(setPosts, setLikedPostIds, setMarkers) {
    try {
      const token = this.getToken();
      const postsResponse = await axios.get("http://localhost:5000/posts/local", {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      setPosts(postsResponse.data);
      this.getLikedPosts(setLikedPostIds, setMarkers);
    } catch (error) {
      console.error("Erro ao buscar posts locais:", error);
    }
  }

  static async fetchPostsAndLikes(setPosts, setLikedPostIds, setMarkers) {
    try {
      const postsResponse = await axios.get("http://localhost:5000/posts/getAllPosts");
      setPosts(postsResponse.data);
      this.getLikedPosts(setLikedPostIds, setMarkers);
    } catch (error) {
      console.error("Erro ao buscar posts e likes:", error);
    }
  }

  static async getLikedPosts(setLikedPostIds, setMarkers) {
    const token = this.getToken();
    if (token) {
      try {
        const likesResponse = await axios.get("http://localhost:5000/posts/getAllMyPostsLikes", {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        const likedPostIds = likesResponse.data.likedPostIds;
        setLikedPostIds(likedPostIds);
        setMarkers(likedPostIds);
      } catch (error) {
        console.error("Erro ao buscar likes dos posts:", error);
      }
    }
  }

  static async updateScore(userId, value) {
    const token = this.getToken();
    await axios.put(`http://localhost:5000/users/${userId}/score`, { value }, {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    });
  }

  static async likePost(postId, like, posts, setPosts, setLikedPostIds, setMarkers) {
    try {
      const token = this.getToken();
      if (!token) throw new Error("Token não encontrado");

      await axios.put(`http://localhost:5000/posts/${postId}/like`, { like }, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      const updatedPosts = posts.map((post) => {
        if (post.idposts === postId) {
          this.updateScore(post.userId, like); 
          return { ...post, likes: like ? post.likes + 1 : post.likes - 1 };
        }
        return post;
      });

      setPosts(updatedPosts);
      this.updateLikedPostIds(postId, like, setLikedPostIds);
      setMarkers((prevMarkers) => ({ ...prevMarkers, [postId]: like }));
    } catch (error) {
      console.error("Erro ao curtir o post:", error.message || error);
    }
  }

  static updateLikedPostIds(postId, like, setLikedPostIds) {
    if (like) {
      setLikedPostIds((prevLikedIds) => [...prevLikedIds, postId]);
      console.log("Curtir");
    } else {
      setLikedPostIds((prevLikedIds) => prevLikedIds.filter((id) => id !== postId));
      console.log("Descurtir");
    }
  }

  static async toggleLike(postId, posts, setPosts, likedPostIds, setLikedPostIds, setMarkers, loadingLikes, setLoadingLikes, navigate) {
    const token = this.getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (loadingLikes[postId]) return;

    try {
      setLoadingLikes((prev) => ({ ...prev, [postId]: true }));

      const response = await axios.get(`http://localhost:5000/posts/${postId}/checkLike`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      const hasLiked = response.data.hasLiked;
      await this.likePost(postId, !hasLiked, posts, setPosts, setLikedPostIds, setMarkers);
    } catch (error) {
      console.error("Erro ao alternar like:", error.message);
    } finally {
      setLoadingLikes((prev) => ({ ...prev, [postId]: false }));
    }
  }
}

export default PostsLikeManager;
