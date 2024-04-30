import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";

interface CardProps {
    title: string;
    text: string;
    author: string;
}

const Card: React.FC<CardProps> = ({ title, text, author }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

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
        <div className={styles.card}>
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
        </div>
    );
};

export default Card;
