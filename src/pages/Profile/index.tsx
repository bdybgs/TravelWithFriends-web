import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styles from "./index.module.css";
import CreatePopup from "./CreatePopup";
import { createTrip, getCreatorId } from "../../services/trip.service";
const Profile: React.FC = () => {
    const userEmail = localStorage.getItem("email");
    const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
    const [city, setCity] = useState("");
    const [numOfParticipants, setNumOfParticipants] = useState<number>(0); 
    const [creatorId, setCreatorId] = useState<string>("");


    useEffect(() => {
        if (userEmail) {
            getCrId(userEmail);
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
                onCreate={() => {
                    // Действие при создании, если необходимо
                }}
            />}
        </div>
    );
};

export default Profile;
