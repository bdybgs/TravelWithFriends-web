import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styles from "./index.module.css";
import CreatePopup from "./CreatePopup";
import { createTrip, getCreatorId, getUserTrips } from "../../services/trip.service";
import TripCard from "./TripCard";
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const userEmail = localStorage.getItem("email");
    const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
    const [city, setCity] = useState("");
    const [numOfParticipants, setNumOfParticipants] = useState<number>(0); 
    const [creatorId, setCreatorId] = useState<string>("");
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userEmail) {
            getCrId(userEmail);
        }
    }, [userEmail]);

    useEffect(() => {
        if (userEmail) {
            fetchUserTrips(userEmail);
        }
    }, [userEmail]);

    const handleCreatePopupOpen = () => {
        setCreatePopupOpen(true);
    };

    const handleCreatePopupClose = () => {
        setCreatePopupOpen(false);
    };
    const getCrId = async (email: string) => {
        try {
            const id = await getCreatorId(email);
            console.log(id);
            setCreatorId(id);
        } catch (error) {
            console.error("Ошибка при получении идентификатора создателя:", error);
        }
    };

    const fetchUserTrips = async (email: string) => {
        try {
            const userTrips = await getUserTrips(email);
            setTrips(userTrips);
        } catch (error) {
            console.error("Error fetching user trips:", error);
        }
    };
    
    const handleCreateTrip = () => {
        if (userEmail) {
            // После создания нового трипа обновляем список путешествий
            fetchUserTrips(userEmail);
        } else {
            console.error("Email пользователя не доступен.");
        }
    };
    
    const handleMapClick = (tripId: string) => {
        navigate(`/map/${tripId}`);
    };

    return (
        <div className="container">
            <header className="jumbotron">
                {/*<h3>
                    <strong>{currentUser.username}</strong> Profile
                </h3>*/}
            </header>
            <p>
                {/* Проверяем, что userEmail не равен null, прежде чем его использовать */}
                <strong>Email:</strong> {userEmail ? userEmail : "Email not available"}
            </p>
            <div className={styles.createButton}>
                <button onClick={handleCreatePopupOpen} className={styles.button}>Создать</button>
            </div>
            <strong>Authorities:</strong>
            {/*<ul>
                {currentUser.roles &&
                    currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
            </ul>*/}

            <strong>User Trips:</strong>
            <div className={styles.tripList}>
                {trips.map((trip: any) => (
                    <TripCard
                        key={trip.id}
                        title={trip.title}
                        text={`Город: ${trip.city}`}
                        dateStart={trip.dateStart}
                        dateEnd={trip.dateEnd}
                        participants={trip.participants}
                        author={trip.creatorName} // Используем creatorName в качестве автора
                        onClick={() => {
                            handleMapClick(trip.id);
                        }}
                    />
                ))}
            </div>

            {isCreatePopupOpen && <CreatePopup
                creatorName={userEmail || ""}
                creatorId={creatorId}
                city={city}
                numOfParticipants={numOfParticipants}
                title="" // Пустая строка, так как этот пропс не используется
                dateStart="" // Пустая строка, так как этот пропс не используется
                dateEnd="" // Пустая строка, так как этот пропс не используется
                hotelTitle="" // Пустая строка, так как этот пропс не используется
                isPublicated={false} // Логическое значение, можете передать true или false в зависимости от ваших потребностей
                onClose={handleCreatePopupClose}
                onCreate={handleCreateTrip}
            />}
        </div>
    );
};

export default Profile;
