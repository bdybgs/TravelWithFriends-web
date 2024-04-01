import React from "react";
import styles from "./index.module.css"
import homePic from "./homePic.png";
import {Link} from "react-router-dom";


const Home = () => {
    return (
        <div>
            <div className={styles.primary}>
                <img src={homePic} alt="Логотип" className={styles.picture}/>
                <h1 style={{fontSize: "50px"}}><span className={styles.yellow}>Путеводитель</span> в мире веселья и
                    экономии!
                    <span className={styles.blue}>Путешествуйте</span> с друзьями без лишних забот</h1>
            </div>
            <div className={styles.linkWrapper}>
                <Link to="/map" className={styles.roundedLink}>
                    Создать путешествие
                </Link>
            </div>
        </div>
    )


}
export default Home;