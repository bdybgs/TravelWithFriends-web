import axios from "axios";

const API_URL = "http://localhost:10000/v1/Accounts";
const API_URL_LOGIN = "http://localhost:10000/v1/Auth";

// Функция регистрации с передачей данных через query параметры
export const register = (name: string, email: string, password: string) => {
  // Кодирование параметров для безопасной передачи через URL
  const queryParams = new URLSearchParams({name, email, password}).toString();
  const urlWithParams = `${API_URL}?${queryParams}`;

  // Отправка запроса
  return axios.post(urlWithParams);
}
export const login = (name: string, password: string) => {
  return axios
    .post(API_URL_LOGIN, {
      username: name,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
