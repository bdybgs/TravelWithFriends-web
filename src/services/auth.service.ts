import axios from "axios";

const API_URL = "http://localhost:10000/v1/Auth";

export const register = (name: string, email: string, password: string) => {
  return axios.post(API_URL, {
    username: name,
    email,
    password,
  });
};

export const login = (name: string, password: string) => {
  return axios
    .post(API_URL, {
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