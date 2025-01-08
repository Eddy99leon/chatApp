import axios from "axios";

export const makeRequest = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://chatapp-fhi6.onrender.com/",
});
