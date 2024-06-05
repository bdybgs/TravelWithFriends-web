import axios from "axios";

const API_URL_ALL_TRIPS = "http://localhost:8080/v1/Trip";
const API_URL_DELETETRIP = "http://localhost:8080/v1/Trip";

//const API_URL_TRIPS = "https://localhost:7084/v1/Trip/publicated";

const API_URL = 'http://localhost:8080/v1/Accounts/status/';

export const getUserIdByEmail = async (email: string): Promise<string> => {
    try {
        const response = await axios.get(`http://localhost:8080/v1/Accounts/getid/${email}`);
        const userId = response.data;
        console.log("User ID obtained:", userId); // Log the userId obtained
        return userId;
    } catch (error) {
        console.error("Error fetching user ID:", error); // Add console.error for better error handling
        throw new Error("User not found or invalid endpoint");
    }
};

export const updateStatus = async (userId: string, statusData: { newStatus: number }) => {
    try {
        const url = `${API_URL}${userId}`;
        console.log(`Sending PUT request to URL: ${url}`); // Log the URL being requested
        return await axios.put(url, statusData);
    } catch (error) {
        console.error("Error updating status:", error);
        throw new Error("Error updating status");
    }
};

export const getAllTrips = () => {
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

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