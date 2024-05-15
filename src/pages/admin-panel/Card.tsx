import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import { deleteTrip } from "../../services/admin.service";

interface CardProps {
    tripId: string; // Добавляем tripId как уникальный идентификатор путешествия
    title: string;
    text: string;
    author: string;
    onClick: () => void; // Добавляем обработчик события onClick
}

const Card: React.FC<CardProps> = ({ tripId, title, text, author, onClick }) => {
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
            {/* Добавляем кнопку удаления */}
            <h2>{title}</h2>
            <p>{text}</p>
            <div style={{ width: "100%", height: "200px", position: "relative" }}>
                <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
                    {coordinates && (
                        <iframe
                            title="map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://yandex.ru/map-widget/v1/-/CKVwjCRX?ll=${coordinates.lon},${coordinates.lat}&z=10&l=map`}
                            style={{ border: 0 }}
                            allowFullScreen={true}
                        />
                    )}
                </div>
            </div>
            <div className={styles.authorChip}>{author}</div>
            <div className={styles.deleteButtonContainer} onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }}>
                <div className={styles.deleteButton}>Удалить</div>
            </div>
        </div>
    );
};

export default Card;
