import axios from "axios";

interface TripData {
    creatorId: string;
    title: string;
    numOfParticipants: number;
    dateStart: string;
    dateEnd: string;
    city: string;
    hotelTitle: string;
    isPublicated: boolean;
  }

  interface UserData {
    id: string;
  }
//const API_URL_TRIPS = "https://localhost:7084/v1/Trip/";
const API_URL_TRIPS = "http://localhost:10000/v1/Trip/";

//const API_URL_ACCOUNTS = "https://localhost:7084/v1/Accounts/getid/";
const API_URL_ACCOUNTS = "http://localhost:10000/v1/Accounts/getid/";


export const createTrip = (tripData: TripData) => {
  // Получаем токен доступа из локального хранилища
  const user = localStorage.getItem("user");
  const accessToken = user ? JSON.parse(user).accessToken : null;

  // Если токен доступа есть, добавляем его в заголовок Authorization
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  // Отправляем POST-запрос для создания путешествия
  return axios.post(API_URL_TRIPS, tripData, { headers })
    .then((response) => {
      // Возвращаем данные ответа
      return response.data;
    })
    .catch((error) => {
      // Обрабатываем ошибку и выбрасываем ее дальше
      console.error("Ошибка при создании путешествия:", error);
      throw error;
    });
};


export const getCreatorId = (creatorEmail: string) => {
  // Получаем токен доступа из локального хранилища
  const user = localStorage.getItem("user");
  const accessToken = user ? JSON.parse(user).accessToken : null;

  // Если токен доступа есть, добавляем его в заголовок Authorization
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  // Отправляем GET-запрос для получения идентификатора создателя
  return axios.get(API_URL_ACCOUNTS + encodeURIComponent(creatorEmail), { headers })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Ошибка при получении идентификатора создателя:", error);
      throw error;
    });
  //return "asas";
};


