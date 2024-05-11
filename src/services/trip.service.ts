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

const API_URL_USERTRIPS = "http://localhost:10000/v1/Trip/usertrips/";

const API_URL_ADDPARTICIPANT = "http://localhost:10000/v1/Trip/usertrips/";

const API_URL_GETDAYS = "http://localhost:10000/v1/Trip/getdays/";

const API_URL_GETCATEGORIES = "http://localhost:10000/v1/Category/";

const API_URL_GETACTSBYDAY = "http://localhost:10000/v1/Activity/day/";

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

};

export const getUserTrips = async (userEmail: string) => {
  try {
    // Получаем токен доступа из локального хранилища
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    // Если токен доступа есть, добавляем его в заголовок Authorization
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    // Отправляем GET-запрос 
    const response = await axios.get(API_URL_USERTRIPS + encodeURIComponent(userEmail), {
      headers: {
        ...headers,
        'Accept': 'application/json'
      }
    });

    console.log(response.data);
    // здесь можно обработать полученные данные

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};


export const getTrip = async (tripId: string) => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const response = await axios.get(`http://localhost:10000/v1/Trip/${tripId}`, {
      headers: {
        ...headers,
        'Accept': 'application/json'
      }
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};

export const addParticipant = async (tripId: string, userEmail: string) => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const response = await axios.post(`${API_URL_ADDPARTICIPANT}${tripId}/addparticipant`, userEmail, {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json' // Установка заголовка Content-Type для POST запроса
      }
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};

export const getDays = async (tripId: string) => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const response = await axios.get(`${API_URL_GETDAYS}${tripId}`, {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json' // Установка заголовка Content-Type для POST запроса
      }
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const response = await axios.get(`${API_URL_GETCATEGORIES}`, {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json' // Установка заголовка Content-Type для POST запроса
      }
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};


export const getActiviesByDay = async (dayId: string) => {
  try {
    console.log("Гуид дня: " + dayId);
    const user = localStorage.getItem("user");
    const accessToken = user ? JSON.parse(user).accessToken : null;

    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const response = await axios.get(`${API_URL_GETACTSBYDAY}${dayId}`, {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Выводим активности в консоль
    console.log("Активности в дне:");
    response.data.forEach((activity: any) => {
      console.log(activity);
    });

    return response.data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return null;
  }
};
