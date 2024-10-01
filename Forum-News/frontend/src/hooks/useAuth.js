import api from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  const handleResponse = (data, successMsg) => {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/");
    return { msgText: successMsg, msgType: "sucess" };
  };

  const handleError = (error) => {
    return { msgText: error.response.data.message, msgType: "error" };
  };

  async function register(user) {
    try {
      const { data } = await api.post("/users/register", user);
      return handleResponse(data, "Cadastro realizado com sucesso!");
    } catch (error) {
      return handleError(error);
    }
  }

  async function login(user) {
    try {
      const { data } = await api.post("/users/login", user);
      return handleResponse(data, "Login realizado com sucesso!");
    } catch (error) {
      return handleError(error);
    }
  }

  function logout() {
    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    navigate("/login");
    return { msgText: "Logout realizado com sucesso!", msgType: "sucess" };
  }

  return { authenticated, register, logout, login };
}
