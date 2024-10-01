import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/posts", { userId, content });
      resetForm();
    } catch (error) {
      console.error("Erro ao criar o post:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setUserId("");
  };

  return (
    <div>
      <h1>Criar Novo Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID do Usuário:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label>Conteúdo do Post:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Criar Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
