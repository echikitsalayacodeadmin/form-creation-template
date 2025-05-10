import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function saveData(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.post(url, obj, { headers }));
  return response.data;
}

export async function saveDataWithoutObject(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.post(url, {}, { headers });
  return response.data;
}

export async function saveDataWithoutToken(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";

  const headers = {
    "Content-Type": "application/json",
  };
  return await Resolver(
    axios.post(url, obj, { headers }, { timeout: 5000 }).then((res) => res.data)
  );
}

export async function uploadFile(url, formData) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NTI2NTM3ODMsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTc0NDg3Nzc4M30.9GJtykTXe8VrawNhkxzALKGcnAJx0iixLJ6Aat1vdRLDYUGcBEukxtUPevdNsTjD9nL6OmmbkJqxbOSs68p7dw";
  return await Resolver(
    axios(url, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + authHeader_local,
      },
    }).then((res) => res.data)
  );
}
