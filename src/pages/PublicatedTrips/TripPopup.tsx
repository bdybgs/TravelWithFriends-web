import React from "react";
import styles from "./TripPopup.module.css";

interface TripPopupProps {
  creatorName: string;
  city: string;
  days: string[];
  onClose: () => void;
  onCreate: () => void; // Добавляем пропс для обработчика создания
}


const TripPopup: React.FC<TripPopupProps> = ({ creatorName, city, days, onClose, onCreate }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.closeButton} onClick={onClose}>
          &times;
        </div>
        <div className={styles.creatorName}>Создатель: {creatorName}</div>
        <div className={styles.info}>
          <div>Город: {city}</div>
          <div>Количество дней: {days.length}</div>
        </div>
        <div className={styles.daysContainer}>
          <div className={styles.days}>
            {days.map((day, index) => (
              <div key={index} className={styles.day}>
                <h3>День {index + 1}</h3>
                <p>{day.replace(/^Day \d+ - /, "")}</p>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.createButton} onClick={onCreate}>Создать</button> {/* Добавляем кнопку создания */}
      </div>
    </div>
  );
};

export default TripPopup;
