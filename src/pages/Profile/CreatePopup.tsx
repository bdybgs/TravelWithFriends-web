import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { DatePicker, Button, Input, Switch, InputNumber } from 'antd';
import { createTrip, getCreatorId, addParticipant } from "../../services/trip.service";
import styles from "./CreatePopup.module.css";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface CreatePopupProps {
    creatorName: string;
    creatorId: string;
    title: string;
    numOfParticipants: number;
    dateStart: string;
    dateEnd: string;
    city: string;
    hotelTitle: string;
    isPublicated: boolean;
    onClose: () => void;
    onCreate: () => void;
}

const CreatePopup: React.FC<CreatePopupProps> = ({ creatorName, creatorId, title, numOfParticipants, city, dateStart, dateEnd, hotelTitle, isPublicated, onClose, onCreate }) => {
    const [numOfParticipantsState, setNumOfParticipantsState] = useState<number>(numOfParticipants);
    const [dateRange, setDateRange] = useState<dayjs.Dayjs[]>([]);
    const [formattedDateStart, setFormattedDateStart] = useState<string>(dateStart);
    const [formattedDateEnd, setFormattedDateEnd] = useState<string>(dateEnd);
    const [isPublicatedState, setIsPublicatedState] = useState<boolean>(isPublicated);
    
    const initialValues = {
        title,
        numOfParticipants,
        city,
        hotelTitle,
        isPublicated
    };

    const handleNumOfParticipantsChange = (value: number | null) => {
        if (value !== null) {
            setNumOfParticipantsState(value);
        }
    };

    const handleDateChange = (dates: dayjs.Dayjs[] | null, dateStrings: [string, string]) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const formattedStart = start.format('DD.MM.YYYY');
            const formattedEnd = end.format('DD.MM.YYYY');
            setFormattedDateStart(formattedStart);
            setFormattedDateEnd(formattedEnd);
            setDateRange(dates);
        } else {
            setFormattedDateStart('');
            setFormattedDateEnd('');
            setDateRange([]);
        }
    };

    const handlePublicatedChange = (checked: boolean) => {
        setIsPublicatedState(checked);
    };

    const handleSubmit = async (values: any) => {
        try {
            console.log("Создание путешествия с параметрами:", {
                creatorId,
                title: values.title,
                numOfParticipants: numOfParticipantsState,
                dateStart: formattedDateStart,
                dateEnd: formattedDateEnd,
                city: values.city,
                hotelTitle: values.hotelTitle,
                isPublicated: isPublicatedState,
            });

            const tripData = {
                creatorId,
                title: values.title,
                numOfParticipants: numOfParticipantsState,
                dateStart: formattedDateStart,
                dateEnd: formattedDateEnd,
                city: values.city,
                hotelTitle: values.hotelTitle,
                isPublicated: isPublicatedState,
            };

            const [start, end] = dateRange;
            if (start.add(3, "months").isBefore(end)) {
                window.alert("Слишком длинное путешествие. Длительность путешествия не должна превышать 3 месяца");
                return;
            }

            const createdTrip = await createTrip(tripData);

            console.log("Созданное путешествие ID:", createdTrip.id);
            console.log("Почта автора:", creatorName);

            addParticipant(createdTrip.id, creatorName);

            onCreate();
            onClose();
        } catch (error) {
            console.error("Ошибка при создании путешествия:", error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.popupContent}>
                    <div className={styles.closeButton} onClick={onClose}>
                        &times;
                    </div>
                    <div className={styles.creatorName}>Создатель: {creatorName}</div>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                        <Form className={styles.form}>
                            <div className={styles.field}>
                                <label>Название:</label>
                                <Field name="title" type="text" as={Input} maxLength={100} />
                            </div>
                            <div className={styles.field}>
                                <label>Число участников:</label>
                                <InputNumber value={numOfParticipantsState} min={0} onChange={handleNumOfParticipantsChange} />
                            </div>
                            <div className={styles.field}>
                                <label>Город:</label>
                                <Field name="city" type="text" as={Input} maxLength={100} />
                            </div>
                            <div className={styles.field}>
                                <label>Отель:</label>
                                <Field name="hotelTitle" type="text" as={Input} maxLength={100} />
                            </div>
                            <div className={styles.field}>
                                <label>Публичное:</label>
                                <Switch checked={isPublicatedState} onChange={handlePublicatedChange} />
                            </div>
                            <div className={styles.field}>Дата</div>
                            <div className={styles.datePicker}>
                                {/* @ts-ignore */}
                                <RangePicker onChange={handleDateChange} />
                            </div>
                            <Button type="primary" htmlType="submit" className={styles.createButton}>Создать</Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreatePopup;
