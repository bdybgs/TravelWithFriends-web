import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { deleteTrip } from "../../services/admin.service";

interface CardProps {
    tripId: string; // Добавляем tripId как уникальный идентификатор путешествия
    title: string;
    city: string;
    text: string;
    author: string;
    participants: string[];
    onClick: () => void; // Добавляем обработчик события onClick
}

const Card: React.FC<CardProps> = ({ tripId, title, city, text, author, participants, onClick }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    const handleDelete = async () => {
        try {
            // Здесь вызываем удаление путешествия с использованием tripId
            await deleteTrip(tripId);
            console.log("Путешествие успешно удалено");
        } catch (error) {
            console.error("Ошибка при удалении путешествия:", error);
        }
    };

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(title)}&format=json&limit=1`);
                const data = await response.json();
                if (data.length > 0) {
                    setCoordinates({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
                }
            } catch (error) {
                console.error("Error fetching coordinates:", error);
            }
        };

        fetchCoordinates();
    }, [title]);

    return (
        <div className={styles.card} onClick={onClick}>            
            <div className={styles.cardContent}>
                <h2>{title}</h2>
                <p>{city}</p>
                <p>{text}</p>
                <p>{participants.join(', ')}</p>
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.authorChip}>{author}</div>
                <div className={styles.deleteButton} onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                }}>
                    Удалить
                </div>
            </div>
        </div>
    );
};

export default Card;
