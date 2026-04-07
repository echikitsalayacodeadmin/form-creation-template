import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function getData(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzU2MjM5ODAsImlhdCI6MTc3NTUzNzU4MCwianRpIjoiOThiNjNhMjUtOWNmNS00MjZkLTg1OTItOTllMzE5ZmJhNTg3In0.BcbfNoW9f9t4Nz4AEVFyNgnz4hnpvq_8PPrIJGbT0QUtVaNi8WYsE4aOK0hGU1VxRF5rcASuMorRWWjCEeVleA";
  const headers = {
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.get(url, { headers }));
  return response.data;
}
