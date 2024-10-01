import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/UserContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { authenticated, logout } = useContext(Context);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <h2><Link to="/">Forum News</Link></h2>
      </div>
      <ul>
        {authenticated ? (
          <>
            <li><Link to="/">Fórum</Link></li>
            <li><Link to="/user/ranking">Colaboração</Link></li>
            <li onClick={logout}>Sair</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/register">Cadastrar</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
