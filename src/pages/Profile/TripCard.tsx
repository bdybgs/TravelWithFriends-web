import React, { useState } from "react";
import styles from "./TripCard.module.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface TripCardProps {
    title: string;
    text: string;
    author: string;
    dateStart: string;
    dateEnd: string;
    participants: string[];
    onClick: () => void; 
}

const TripCard: React.FC<TripCardProps> = ({ title, text, author, dateStart, dateEnd, participants, onClick }) => {
    const [showAllParticipants, setShowAllParticipants] = useState(false);

    const visibleParticipants = showAllParticipants ? participants : participants.slice(0, 5);

    const rangePickerValue: [dayjs.Dayjs, dayjs.Dayjs] = [
        dayjs(dateStart, "DD.MM.YYYY"),
        dayjs(dateEnd, "DD.MM.YYYY")
    ];

    return (
        <div className={styles.card} onClick={onClick}>
            <h2>{title}</h2>
            <p>{text}</p>
            <DatePicker.RangePicker
                value={rangePickerValue}
                format="DD.MM.YYYY"
                disabled
                className={styles.datePicker}
            />
            <div className={styles.participantsChips}>
                {visibleParticipants.map((participant, index) => (
                    <div key={index} className={styles.participantChip}>{participant}</div>
                ))}
                {!showAllParticipants && participants.length > 5 && (
                    <button className={styles.showMoreButton} onClick={() => setShowAllParticipants(true)}>
                        +{participants.length - 5} more
                    </button>
                )}
            </div>
            {/* <div className={styles.authorChip}>{author}</div> */}
        </div>
    );
};

export default TripCard;
