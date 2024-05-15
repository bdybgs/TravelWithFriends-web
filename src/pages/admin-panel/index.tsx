import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Card from "./Card";
import { getAllTrips, deleteTrip } from "../../services/admin.service";
import { getCurrentUser } from "../../services/auth.service";
import TripPopup from "./TripPopup";
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [rows, setRows] = useState(3);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    getAllTrips()
        .then((data) => {
          setTrips(data);
        })
        .catch((error) => {
          console.error("Ошибка при получении списка путешествий:", error);
        });
  }, []);

  const handleCardClick = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleClosePopup = () => {
    setSelectedTrip(null);
  };

  const isAuthenticated = () => {
    const userEmail = localStorage.getItem("email");
    return userEmail !== null; // Возвращает true, если пользователь авторизован, и false в противном случае
  };


  const handleCreate = () => {
    if (isAuthenticated()) {
      navigate("/map/000");
    } else {
      // Показать попап с надписью "Авторизуйтесь!"
      alert("Авторизуйтесь!");
    }
  };


  return (
      <div className={styles.container} ref={containerRef}>
        {trips.slice(0, rows * 4).map((trip) => (
            <div key={trip.id} className={styles.row}>
              <Card
                  title={trip.city}
                  text={`${trip.days.length} дней`}
                  author={trip.creatorName}
                  onClick={() => handleCardClick(trip)}
                  tripId={trip.id} // Передаем уникальный идентификатор tripId
              />
            </div>
        ))}
        {selectedTrip && (
            <TripPopup
                creatorName={selectedTrip.creatorName}
                city={selectedTrip.city} // Передаем город и дни путешествия
                days={selectedTrip.days}
                onClose={handleClosePopup}
                onCreate={handleCreate}
            />
        )}
      </div>
  );
};

export default AdminPanel;
