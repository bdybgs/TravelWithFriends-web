import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import homePic from "./homePic.png";
import regPic from "./regPic.png";

import { Link } from "react-router-dom";
import { sendEvent } from "../../utils/Metriks";


const Home = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isBackgroundGreen, setIsBackgroundGreen] = useState(false);
    const scrollThreshold = 400; // Уpовень прокрутки, после которого меняется цвет фона
    const transitionDuration = 0.5; // Продолжительность перехода цвета фона

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
            if (position > scrollThreshold) {
                setIsBackgroundGreen(true);
            } else {
                setIsBackgroundGreen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrollThreshold]);

    const backgroundColor = isBackgroundGreen ? "#45DC9C" : "#393E46";

    const containerStyle = {
        background: backgroundColor,
        transition: `background-color ${transitionDuration}s ease`
    };

    const handleClick = () => {       
        sendEvent('reachGoal', 'CreateTripClick');
    };

    return (
        <div className={styles.container} style={containerStyle}>
            <div className={`${styles.primary} `}>
                <img src={homePic} alt="Логотип" className={styles.picture} />
                <h1 style={{ fontSize: "50px" }}>
                    <span className={styles.yellow}>Путеводитель</span> в мире веселья и
                    экономии!
                    <span className={styles.blue}>Путешествуйте</span> с друзьями без
                    лишних забот
                </h1>
            </div>
            <div className={styles.linkWrapper}>
                <Link to="/map" className={styles.roundedLink} onClick={handleClick}>
                    Создать путешествие
                </Link>
            </div>
            <div className={styles.innerContainer}>
            <div className={`${styles.text}`} style = {{left: `10%`}}>
                Шаг 1
                </div>
            <div className={styles.instructionBlock}>
                <h2>Войдите в аккаунт</h2>
                {/* Здесь разместите вашу первую форму */}
                <img src={regPic} alt="Логотип" className={styles.pictureRegistration} />
                <h2>
                    <p>
                        Если у вас нет аккаунта, необходимо зарегистрироваться и авторизоваться.
                    </p>
                     Неавторизованные пользователи
                    не могут использовать полный функционал сайта
                </h2>
            </div>
                <div className={`${styles.text}`} style = {{left: `38%`}}>
                    Шаг 2
                </div>

            <div className={styles.instructionBlock}>
                <h2>Создайте<br/> настройте и сохраните<br/> путешествие</h2>
                <h2>
                    Активности добавленные через строку поиска будут отображаться на карте
                </h2>
            </div>
                <div className={`${styles.text}`} style = {{left: `66%`}}>
                    Шаг 3
                </div>
            <div className={styles.instructionBlock}>
                <h2>Посмотрите статистику</h2>
                <h2>
                Узнайте, кто сколько потратил и кто кому должен из наглядных диаграмм расходов
                </h2>
            </div>

            </div>
        </div>
    );
};

export default Home;
