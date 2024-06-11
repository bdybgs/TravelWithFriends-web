import axios from "axios";

const API_URL_ALL_TRIPS = "http://localhost:10000/v1/Trip";
const API_URL_DELETETRIP = "http://localhost:10000/v1/Trip";
const API_URL = 'http://localhost:10000/v1/Accounts/status/';

export const getUserIdByEmail = async (email: string): Promise<string> => {
  try {
    const response = await axios.get(`http://localhost:10000/v1/Accounts/getid/${email}`);
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

export const getStatus = async (userId: string): Promise<number> => {
  try {
    const url = `${API_URL}${userId}`;
    console.log(`Sending GET request to URL: ${url}`); // Log the URL being requested
    const response = await axios.get(url);
    const status = response.data;
    console.log("User status obtained:", status); // Log the status obtained
    return status;
  } catch (error) {
    console.error("Error fetching user status:", error);
    throw new Error("Error fetching user status");
  }
};


