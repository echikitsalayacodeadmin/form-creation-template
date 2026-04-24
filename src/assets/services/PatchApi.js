import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function updateData(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxMDU0NTEsImlhdCI6MTc3NzAxOTA1MSwianRpIjoiMTBiMmZkNzUtZjQ3My00ZTBmLTg5NjgtNTFhMzFhYmQ4MjVkIn0.V9Xu30BTxQhzHx4Y7GE8lB_22mI_FmL2zE-0IKuPWOZN7ilcaX5z77jE4kNSOEFKtLfr0Bczi8pXeL3KzYmp3Q";
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
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxMDU0NTEsImlhdCI6MTc3NzAxOTA1MSwianRpIjoiMTBiMmZkNzUtZjQ3My00ZTBmLTg5NjgtNTFhMzFhYmQ4MjVkIn0.V9Xu30BTxQhzHx4Y7GE8lB_22mI_FmL2zE-0IKuPWOZN7ilcaX5z77jE4kNSOEFKtLfr0Bczi8pXeL3KzYmp3Q";

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
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzcxMDU0NTEsImlhdCI6MTc3NzAxOTA1MSwianRpIjoiMTBiMmZkNzUtZjQ3My00ZTBmLTg5NjgtNTFhMzFhYmQ4MjVkIn0.V9Xu30BTxQhzHx4Y7GE8lB_22mI_FmL2zE-0IKuPWOZN7ilcaX5z77jE4kNSOEFKtLfr0Bczi8pXeL3KzYmp3Q";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
