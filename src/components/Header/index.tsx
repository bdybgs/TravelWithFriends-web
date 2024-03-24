import React from "react";
import styles from "./index.module.css"
import logo from "./logo.webp";

const Header = () => {
    return (
        <header className={styles.primary}>
            <a href="/">
            <img src={logo} alt="Логотип" className={styles.logo} />
            </a>
            <nav>
                <ul>
                    <a href="/" >Главная</a>
                   <a href="/contacts">Контакты</a>
                    <a href="/about">О нас</a>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
