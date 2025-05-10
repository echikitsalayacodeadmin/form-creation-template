import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function updateData(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";
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
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";

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
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3Mzk5NzExNzgsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTczMjE5NTE3OH0.GBkBVE7rekcBA7NUuVvQMOzH0QlHUgc5z2fPfxAiuLg7R9s0cZv8839zuTp72ZBRedBdX-3lXrbbb7zW6lBrmA";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
