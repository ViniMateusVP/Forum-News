import { useState, useContext, useEffect, useRef } from "react";
import Input from "../../layout/form/Input";
import { Link } from "react-router-dom";
import styles from "../../layout/form/Form.module.css";
import selectStyles from "../../layout/form/Select.module.css";
import { Context } from "../../../context/UserContext";
import stateCity from "../../../data/stateCity";

function CustomSelect({ label, name, options, onChange, isOpen, toggleDropdown, selectedValue }) {
  const [selectedOption, setSelectedOption] = useState(selectedValue || "");

  useEffect(() => {
    setSelectedOption(selectedValue || "");
  }, [selectedValue]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option } });
    toggleDropdown();
  };

  return (
    <div className={selectStyles.select_container}>
      <label>{label}</label>
      <div className={selectStyles.custom_select} onClick={toggleDropdown}>
        <div className={selectStyles.selected_option}>
          {selectedOption || `Selecione uma ${label.toLowerCase()}`}
        </div>
        <div className={`${selectStyles.arrow} ${isOpen ? selectStyles.open : ""}`} />
      </div>
      {isOpen && (
        <ul className={selectStyles.options}>
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Register() {
  const [user, setUser] = useState({});
  const { register } = useContext(Context);
  const [cities, setCities] = useState([]);
  const [openSelect, setOpenSelect] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const selectRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setCities(stateCity[value] || []);
      setUser((prevUser) => ({ ...prevUser, state: value, city: "" }));
      setSelectedState(value);
      setSelectedCity(""); 
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
      if (name === "city") {
        setSelectedCity(value);
      }
    }
  };

  const toggleDropdown = (selectName) => {
    setOpenSelect(openSelect === selectName ? null : selectName);
  };

  const handleOutsideClick = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setOpenSelect(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(user); 
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Nome"
          type="text"
          name="username"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmPassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        />
        <div ref={selectRef}>
          <CustomSelect
            label="Estado"
            name="state"
            options={Object.keys(stateCity)}
            onChange={handleChange}
            isOpen={openSelect === "state"}
            toggleDropdown={() => toggleDropdown("state")}
            selectedValue={selectedState}
          />
          <CustomSelect
            label="Cidade"
            name="city"
            options={cities}
            onChange={handleChange}
            isOpen={openSelect === "city"}
            toggleDropdown={() => toggleDropdown("city")}
            selectedValue={selectedCity}
          />
        </div>
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </section>
  );
}

export default Register;
