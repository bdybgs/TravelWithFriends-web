import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import Card from "./Card";
import { getAllTrips, getUserIdByEmail, updateStatus, deleteUser, getUserTrips } from "../../services/admin.service";
import TripPopup from "./TripPopup";
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const AdminPanel: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [rows, setRows] = useState(3);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');

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
        console.log("Fetched user ID:", id);
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

  const handleDeleteUser = async () => {
    try {
      await deleteUser(email);
      alert("Пользователь успешно удален");
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      alert("Ошибка при удалении пользователя");
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

  const handleSearch = async () => {
    try {
      const userTrips = await getUserTrips(searchEmail);
      setTrips(userTrips);
    } catch (error) {
      console.error("Ошибка при поиске трипов пользователя:", error);
      alert("Ошибка при поиске трипов пользователя");
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.userManagement}>
        <h2>Управление пользователями</h2>
        <div className={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email пользователя"
            className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => handleSetStatus(2)}>Активировать подписку</button>
            <button className={styles.button} onClick={() => handleSetStatus(0)}>Отключить подписку</button>
            <button className={styles.button} onClick={handleDeleteUser}>Удалить пользователя</button>
          </div>
        </div>
      </div>
      <div className={styles.tripCards}>
      <p>Отобразить путешествия пользователя:</p>
        <div className={styles.searchContainer}>
          
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Введите email"
            className={styles.input}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <SearchOutlined />
          </button> 
          </div>
        <div className={styles.cardGrid}>
          {trips.slice(0, rows * 4).map((trip) => (
            <Card
              key={trip.id}
              title={trip.title}
              city={trip.city}
              text={`${trip.days.length} дней`}
              author={trip.creatorName}
              participants={trip.participants}
              onClick={() => handleCardClick(trip)}
              tripId={trip.id}
            />
          ))}
        </div>
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
    </div>
  );
};

export default AdminPanel;
