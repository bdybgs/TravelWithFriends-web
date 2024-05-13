import axios from "axios";

const API_URL_GETACTSBYDAY = "http://localhost:10000/v1/Activity/day/";
const API_URL_ADDACT = "http://localhost:10000/v1/Activity/";
const API_URL_STAT = "http://localhost:10000/v1/Statistics/";

export interface ActivityData {
    dayId: string;
    title: string;
    categoryId: string;
    pricePerOne: number;
    totalPrice: number;
    participants: string[];
    payers: string[];
  }

  export interface UpdateActivityData {
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

  export const deleteActivity= async (actId: string) => {
    try {
      
      const user = localStorage.getItem("user");
      const accessToken = user ? JSON.parse(user).accessToken : null;
  
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  
      const response = await axios.delete(`${API_URL_ADDACT}${actId}`, {
        headers: {
          ...headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('There has been a problem with delete activity:', error);
      return null;
    }
  };

  export const updateActivity= async (actId: string, requestData: any) => {
    updateActivity2(actId, requestData);
    // try {
      
    //   const user = localStorage.getItem("user");
    //   const accessToken = user ? JSON.parse(user).accessToken : null;
  
    //   const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    //   console.log("Такие данные пришли в запрос: "+data);
    //   const response = await axios.put(`${API_URL_ADDACT}${actId}`, data, {
    //     headers: {
    //       ...headers,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   return response.data;
    // } catch (error) {
    //   console.error('There has been a problem with update activity:', error);
    //   return null;
    // }
  };


  async function updateActivity2(activityId: string, requestData: any): Promise<void> {
    const url = `http://localhost:10000/v1/Activity/${activityId}`;
  
    const headers = {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await axios.put(url, requestData, { headers });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  export const getStat= async (tripId: string) => {
    try {
      
      const user = localStorage.getItem("user");
      const accessToken = user ? JSON.parse(user).accessToken : null;
  
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  
      const response = await axios.get(`${API_URL_STAT}${tripId}`, {
        headers: {
          ...headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log("Статистика получена (в запросе):", response.data);
      return response.data;
    } catch (error) {
      console.error('There has been a problem with getStat:', error);
      return null;
    }
  };