import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Card from "./Card";
import { getAllTrips, getUserIdByEmail, updateStatus } from "../../services/admin.service";
import TripPopup from "./TripPopup";
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [rows, setRows] = useState(3);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
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

  const handleSetStatus = async (status: number) => {
    try {
      if (!userId) {
        const id = await getUserIdByEmail(email);
        console.log("Fetched user ID:", id); // Log the fetched user ID
        setUserId(id);
        await updateStatus(id, { newStatus: status });
      } else {
        await updateStatus(userId, { newStatus: status });
      }
      alert(`Status updated to ${status === 2 ? 'Pro' : 'Regular'}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Ошибка при обновлении статуса:", error);
        alert("Ошибка при обновлении статуса: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred");
      }
    }
  };

  const handleCardClick = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleClosePopup = () => {
    setSelectedTrip(null);
  };

  const isAuthenticated = () => {
    const userEmail = localStorage.getItem("email");
    return userEmail !== null;
  };

  const handleCreate = () => {
    if (isAuthenticated()) {
      navigate("/map/000");
    } else {
      alert("Авторизуйтесь!");
    }
  };

  return (
      <div className={styles.container} ref={containerRef}>
        <div className={styles.inputContainer}>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => handleSetStatus(2)}>Set Pro</button>
            <button className={styles.button} onClick={() => handleSetStatus(0)}>Set Regular</button>
          </div>
        </div>

        {trips.slice(0, rows * 4).map((trip) => (
            <div key={trip.id} className={styles.row}>
              <Card
                  title={trip.city}
                  text={`${trip.days.length} дней`}
                  author={trip.creatorName}
                  onClick={() => handleCardClick(trip)}
                  tripId={trip.id}
              />
            </div>
        ))}
        {selectedTrip && (
            <TripPopup
                creatorName={selectedTrip.creatorName}
                city={selectedTrip.city}
                days={selectedTrip.days}
                onClose={handleClosePopup}
                onCreate={handleCreate}
            />
        )}
      </div>
  );
};

export default AdminPanel;
