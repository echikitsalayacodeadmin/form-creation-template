import axios from "axios";

let token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzA1MzE1MzgsImlhdCI6MTc2Mjc1NTUzOH0.6MFRxrQDoNAbWca9IIybGMxIyySxd_Om5V1kB45ByI7n__oBOsU_KJWKkGRU2DHJHXu5kTci7Sxx1OJC_ximBA";

const API = axios.create({
  baseURL: "https://apibackend.uno.care/api",
});

// 🛡 Add authorization headers automatically
API.interceptors.request.use((config) => {
  //const token = localStorage.getItem("ACCESS_TOKEN"); // <-- your token storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.accept = "application/json";

  return config;
});

export default API;
