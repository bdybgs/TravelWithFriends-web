import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css"
import logo from "./logo.webp";
import icon from "./icon.webp";
import { AuthContext } from '../../hoc/AuthProvider';
import { logout } from "../../services/auth.service";
import { sendEvent } from "../../utils/Metriks"

const Header = () => {
    const auth = useContext(AuthContext);

    const { isAdmin } = useContext(AuthContext);
    console.log("isAdmin"+isAdmin);

    const handleLogout = () => {
        logout();
        if (auth?.signout) {
            auth.signout(() => {
                // Перенаправление или другие действия после выхода
            });
        }
    };
    const handleProfileClick = () => {
        sendEvent('reachGoal', 'ClickProfile');
    };
    return (
        <header className={styles.primary}>
            <Link to="/">
                <img src={logo} alt="Логотип" className={styles.logo} />
            </Link>
            <nav>
                <ul>
                    <Link to="/publicatedtrips">Путешествия</Link>
                    <Link to="/about">Контакты</Link>
                    {auth?.user ? (
                        <>
                            <Link to="/profile" onClick={handleProfileClick}>Профиль</Link>
                            <Link to="/profile" state={{ openCreatePopup: true }}>
                                Создать
                            </Link>
                            {isAdmin && <Link to="/admin">Управление</Link>}
                            <Link to={"/#"} onClick={handleLogout}>Выход</Link>
                        </>
                    ) : (
                        <Link to="/login">
                            Вход
                        </Link>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
