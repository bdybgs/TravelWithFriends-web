import React, {ReactNode} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import App from "../../App";
import {inspect} from "util";
import styles from "./index.module.css"
import logo from "./logo.webp";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const fromPage = location.state?.from?.pathname || '/';

    return (

            <div className={styles.container}>
                <img src={logo} alt="Логотип" className={styles.picture}/>
                <h1 className={styles.enter}>Войти в аккаунт</h1>
                <button className={styles.button}>Войти</button>
            {fromPage}
            </div>
    )
}

export {Login}