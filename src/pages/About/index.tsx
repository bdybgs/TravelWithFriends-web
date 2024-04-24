import React from "react";
import styles from "./index.module.css";

const About: React.FC = () => {
  return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.leftCard}`}>
          <h2>Контакты</h2>
          <p>Для связи с нами перейдите по ссылке:</p>
          <form className={styles.contactForm} action="https://vk.com/kkkkk_kk_kkk" target="_blank">
            <button type="submit">Связаться с нами в VK</button>
          </form>
        </div>
        <div className={`${styles.card} ${styles.rightCard}`}>
            <div className={styles.aboutText}>
            <h2>О нас</h2>
            <p>Мы — ваш надежный партнер в мире приключений и неповторимых впечатлений. Наша компания специализируется на комплексном планировании и детальном анализе всех аспектов вашего путешествия, сделав процесс максимально комфортным и беспечным для вас и ваших путешественников.</p>
            <p>Уделите особое внимание анализу расходов. С нашей помощью вы сможете не только наслаждаться каждым моментом, но и четко понимать, как распределяются затраты, делая ваши финансовые вопросы прозрачными и управляемыми.</p>
            <p>С нами вы получаете не просто путеводитель – вы обретаете верного спутника в мире приключений. Предоставьте нам заботу о деталях, чтобы вы могли сосредоточиться на удовольствии и вдохновении. Доверьтесь нам, и ваши мечты о незабвенном путешествии станут реальностью.</p>
          </div>
        </div>
      </div>
  );
};

export default About;