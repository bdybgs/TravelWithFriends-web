import React from "react";
import styles from "./index.module.css"
import homePic from "./homePic.png";


const Home = () => {
    return (

        <div className={styles.primary}>
            <img src={homePic} alt="Логотип" className={styles.picture}/>
            <h1  style={{ fontSize: "50px" }}><span className={styles.yellow}>Путеводитель</span> в мире веселья и экономии!
                <span className={styles.blue}>Путешествуйте</span> с друзьями без лишних забот</h1>

        </div>
    )


}
export default Home;