import axios from "axios";

const API_URL_ALL_TRIPS = "http://localhost:10000/v1/Trip";
const API_URL_DELETETRIP = "http://localhost:10000/v1/Trip";

//const API_URL_TRIPS = "https://localhost:7084/v1/Trip/publicated";

export const getAllTrips = () => {
    // Получаем токен доступа из локального хранилища
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    // Если токен доступа есть, добавляем его в заголовок Authorization
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    // Отправляем GET-запрос для получения списка всех путешествий
    return axios.get(API_URL_ALL_TRIPS, { headers })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Ошибка при получении списка всех путешествий:", error);
            throw error;
        });
};


export const deleteTrip = (id: any) => {
    // Получаем токен доступа из локального хранилища
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    // Если токен доступа есть, добавляем его в заголовок Authorization
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    // Формируем URL для удаления путешествия с заданным id
    const deleteUrl = `${API_URL_DELETETRIP}/${id}`;

    // Отправляем DELETE-запрос для удаления путешествия
    return axios.delete(deleteUrl, { headers })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Ошибка при удалении путешествия:", error);
            throw error;
        });
};