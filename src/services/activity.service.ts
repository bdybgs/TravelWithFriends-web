import axios from "axios";

const API_URL_GETACTSBYDAY = "http://localhost:10000/v1/Activity/day/";
const API_URL_ADDACT = "http://localhost:10000/v1/Activity/";

export interface ActivityData {
    dayId: string;
    title: string;
    categoryId: string;
    pricePerOne: number;
    totalPrice: number;
    participants: string[];
    payers: string[];
  }

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

  export const addActiviesByDay = async (data: ActivityData) => {
    try {
      const user = localStorage.getItem("user");
      const accessToken = user ? JSON.parse(user).accessToken : null;
  
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  
      const response = await axios.post(API_URL_ADDACT, data, {
        headers: {
          ...headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      return null;
    }
  };