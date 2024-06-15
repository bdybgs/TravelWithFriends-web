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

const CreatePopup: React.FC<CreatePopupProps> = ({ creatorName, creatorId, title,  numOfParticipants, city, dateStart, dateEnd, hotelTitle, isPublicated, onClose, onCreate }) => {
    const [numOfParticipantsState, setNumOfParticipantsState] = useState<number>(numOfParticipants);
    const [dateRange, setDateRange] = useState<any[]>([]);
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
    const handleDateChange = (dates: dayjs.Dayjs[]) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;

            const formattedStart = start.format('DD.MM.YYYY');


            console.log(formattedStart);
            const formattedEnd = end.format('DD.MM.YYYY');
            setFormattedDateStart(formattedStart);
            setFormattedDateEnd(formattedEnd);
            setDateRange(dates);
        }
    };

    const handlePublicatedChange = (checked: boolean) => {
        setIsPublicatedState(checked);
    };
    const handleSubmit = async (values: any) => {
        try {
            // Выводим содержимое параметров перед вызовом метода создания путешествия
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

            // После успешного получения creatorId отправляем запрос на создание путешествия
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
                window.alert("Нельзя создать такой длинный трип")
                return;
            }

            await createTrip(tripData);

            // Вызываем onCreate после успешного создания путешествия
            onCreate();
            onClose();
        } catch (error) {
            console.error("Ошибка при создании путешествия:", error);
        }
    };
    
    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <div className={styles.closeButton} onClick={onClose}>
                    &times;
                </div>
                <div className={styles.creatorName}>Создатель: {creatorName}</div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className={styles.info}>
                            <div>
                                Название: <Field name="title" type="text" as={Input} />
                            </div>
                            <div>
                                Число участников: <InputNumber value={numOfParticipantsState} onChange={handleNumOfParticipantsChange} />
                            </div>
                            <div>
                                Город: <Field name="city" type="text" as={Input} />
                            </div>
                            <div>
                                Отель: <Field name="hotelTitle" type="text" as={Input} />
                            </div>
                            <div>
                                Публичное: <Switch checked={isPublicatedState} onChange={handlePublicatedChange} />
                            </div>
                        </div>
                        <div className={styles.textdata}>Дата</div>
                        <div className={styles.datePicker}>
                            {/* @ts-ignore */}
                            <RangePicker onChange={handleDateChange} />
                        </div>
                        <button type="submit" className={styles.createButton}>Создать</button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
    
};

export default CreatePopup;
