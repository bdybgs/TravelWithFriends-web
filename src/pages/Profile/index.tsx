import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from "./index.module.css";
import CreatePopup from "./CreatePopup";
import { createTrip, getCreatorId, getUserTrips, getUserStatus } from "../../services/trip.service";
import TripCard from "./TripCard";
import Tooltip from "./Tooltip";

const Profile: React.FC = () => {
    const userEmail = localStorage.getItem("email");
    const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
    const [city, setCity] = useState("");
    const [numOfParticipants, setNumOfParticipants] = useState<number>(0);
    const [creatorId, setCreatorId] = useState<string>("");
    const [userId, setUserId] = useState<string>('');
    const [userStatus, setUserStatus] = useState<number | null>(null);
    const [trips, setTrips] = useState([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (userEmail) {
            getCrId(userEmail);
            fetchUserIdAndStatus(userEmail);
        }

        if (location.state?.openCreatePopup) {
            setCreatePopupOpen(true);
        }
    }, [userEmail, location.state]);

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
            // Проверяем статус пользователя
            if (userStatus === 0) { // Стандартный статус
                if (trips.length >= 5) { // Проверяем лимит на количество путешествий
                    alert('Вы достигли лимита на количество путешествий (5).');
                    return;
                }
            } else if (userStatus === 2) { // Про статус
                if (trips.length >= 15) { // Проверяем лимит на количество путешествий
                    alert('Вы достигли лимита на количество путешествий (15).');
                    return;
                }
            }

            fetchUserTrips(userEmail);
        } else {
            console.error("Email пользователя не доступен.");
        }
    };


    const handleMapClick = (tripId: string) => {
        navigate(`/map/${tripId}`);
    };

    const fetchUserIdAndStatus = async (email: string) => {
        try {
            const id = await getCreatorId(email);
            setUserId(id);

            const status = await getUserStatus(id);
            console.log("статус получен:", status);
            setUserStatus(status);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Произошла ошибка при получении статуса пользователя.');
            console.error("Error fetching user status:", error);
        }
    };

    const renderStatus = () => {
        if (userStatus === 0) {
            return "Стандартный";
        } else if (userStatus === 2) {
            return "Pro";
        } else {
            return "Загрузка статуса...";
        }
    };

    return (
        <div className="profileContainer">
            <header className="jumbotron">
                {/*<h3>
                    <strong>{currentUser.username}</strong> Profile
                </h3>*/}
            </header>

            <div className={styles.userInfo}>
                <p>
                    <strong>Email:</strong> {userEmail ? userEmail : "Email not available"}
                </p>
                <p>
                    <strong>Status:</strong> {renderStatus()}
                    <span
                        className={styles.tooltipIcon}
                        onMouseEnter={() => setTooltipVisible(true)}
                        onMouseLeave={() => setTooltipVisible(false)}
                    >
                        ?
                    </span>
                    {isTooltipVisible && (
                        <Tooltip userStatus={userStatus} />
                    )}
                </p>
            </div>

            <div className={styles.createButton}>
                <button onClick={handleCreatePopupOpen} className={styles.button}>Создать</button>
            </div>

            <div className={styles.tripList}>
                {trips.map((trip: any) => (
                    <TripCard
                        key={trip.id}
                        title={trip.title}
                        text={`Город: ${trip.city}`}
                        dateStart={trip.dateStart}
                        dateEnd={trip.dateEnd}
                        participants={trip.participants}
                        author={trip.creatorName}
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
                title=""
                dateStart=""
                dateEnd=""
                hotelTitle=""
                isPublicated={false}
                onClose={handleCreatePopupClose}
                onCreate={handleCreateTrip}
            />}
            {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
    );
};

export default Profile;
