import React, { useEffect, useState } from "react";
import styles from "./TripCard.module.css";

interface TripCardProps {
    title: string;
    text: string;
    author: string;
    onClick: () => void; // Добавляем обработчик события onClick
}

const TripCard: React.FC<TripCardProps> = ({ title, text, author, onClick }) => {
    
    return (
        <div className={styles.card} onClick={onClick}> {/* Добавляем обработчик onClick */}
            <h2>{title}</h2>
            <p>{text}</p>
            <div className={styles.authorChip}>{author}</div>
        </div>
    );
};

export default TripCard;
