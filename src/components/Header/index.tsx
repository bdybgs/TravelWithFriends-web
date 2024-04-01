import React from "react";
import styles from "./index.module.css"
import logo from "./logo.webp";
import { Link } from "react-router-dom"


const Header = () => {
    return (
        <header className={styles.primary}>
            <Link to="/">
            <img src={logo} alt="Логотип" className={styles.logo} />
            </Link>
            <nav>
                <ul>
                    <Link to="/" >Главная</Link>
                   <Link to="/contacts">Контакты</Link>
                    <Link to="/login">Вход</Link>

                </ul>
            </nav>
        </header>
    );
}

export default Header;
