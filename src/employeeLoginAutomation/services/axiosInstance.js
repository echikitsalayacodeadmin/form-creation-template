import axios from "axios";

let token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3ODYwODkzMTksImlhdCI6MTc4NjAwMjkxOSwianRpIjoiOWI5OGVmOTctNzNmZC00YzFlLTllODQtY2MyY2NhNWUzMjE4In0.3LyQbBY-1F5HE6Mn3HWsOubfjRavMe9JSSZpR_8xt3lwKtQwD7uJcVhIWvJw3ksV_Jw5mXuO4u3PvsAByVUdYw";

const API = axios.create({
  baseURL: "https://apitest.uno.care/api",
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
