import axios from "axios";

//const API_URL_TRIPS = "http://localhost:10000/v1/Trip/publicated";
 const API_URL_TRIPS = "http://localhost:8080/v1/Trip/publicated";


export const getTrips = () => {
  // Получаем токен доступа из локального хранилища
  const user = localStorage.getItem("user");
  const accessToken = user ? JSON.parse(user).accessToken : null;

  // Если токен доступа есть, добавляем его в заголовок Authorization
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  // Отправляем GET-запрос для получения списка опубликованных путешествий
  return axios.get(API_URL_TRIPS, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Ошибка при получении списка путешествий:", error);
      throw error;
    });
};

  