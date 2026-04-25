import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function updateData(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxNzk4MjksImlhdCI6MTc3NzA5MzQyOSwianRpIjoiMDk0MWFjNzQtNDA3Yi00NzRkLWIwODgtNTBjM2E0NWMwMzc3In0.NYxY-l0OvojBhTP-Qb7cbn1vVoxg3FkHFcsN-knt8q0ievagDSnRP-vkWDeIq-dHbdf4RIJoePFg8jZiq5lJhg";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authHeader_local,
  };
  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data)
  );
}
export async function updateDataFile(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxNzk4MjksImlhdCI6MTc3NzA5MzQyOSwianRpIjoiMDk0MWFjNzQtNDA3Yi00NzRkLWIwODgtNTBjM2E0NWMwMzc3In0.NYxY-l0OvojBhTP-Qb7cbn1vVoxg3FkHFcsN-knt8q0ievagDSnRP-vkWDeIq-dHbdf4RIJoePFg8jZiq5lJhg";

  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + authHeader_local,
  };

  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data)
  );
}

export async function updateDataWithoutObject(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxNzk4MjksImlhdCI6MTc3NzA5MzQyOSwianRpIjoiMDk0MWFjNzQtNDA3Yi00NzRkLWIwODgtNTBjM2E0NWMwMzc3In0.NYxY-l0OvojBhTP-Qb7cbn1vVoxg3FkHFcsN-knt8q0ievagDSnRP-vkWDeIq-dHbdf4RIJoePFg8jZiq5lJhg";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
