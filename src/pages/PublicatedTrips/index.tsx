import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Card from "./Card";

const PublicatedTrips: React.FC = () => {
    const [rows, setRows] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);

    // Массив из 12 рандомных городов
    const cities = [
        "Москва", "Санкт-Петербург", "Нью-Йорк", "Лондон", "Париж",
        "Токио", "Берлин", "Рим", "Мадрид", "Пекин", "Дубаи", "Сидней"
    ];

    const authors = ["Александр", "Екатерина", "Иван", "Мария", "Дмитрий"];

    useEffect(() => {
        const handleScroll = () => {
            if (
                containerRef.current &&
                window.innerHeight + window.scrollY >=
                    containerRef.current.offsetHeight
            ) {
                setRows((prevRows) => Math.min(prevRows + 1, 3));
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const generateRandomNumberOfDays = () => {
        return Math.floor(Math.random() * 30) + 1; // Генерируем случайное число от 1 до 30
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                    {[...Array(4)].map((_, cardIndex) => (
                        <Card
                            key={cardIndex}
                            title={cities[rowIndex * 4 + cardIndex]} // Передаем случайный город в качестве заголовка
                            text={`${generateRandomNumberOfDays()} дней`}
                            author={authors[Math.floor(Math.random() * authors.length)]} // Генерируем случайное имя автора
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PublicatedTrips;
