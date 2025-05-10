import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function getData(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoiYW51cmFnLm1pc2hyYUB1bm8uY2FyZSIsInJvbGUiOiJDT1JQU0FMRVNfQURNSU4iLCJyb2xlcyI6WyJDT1JQU0FMRVNfVVNFUiIsIkRPQ1RPUiIsIklOVk9JQ0VfQVBQUk9WRVJfT1BTIiwiSU5WT0lDRV9BUFBST1ZFUl9TQUxFUyIsIklOVk9JQ0VfRURJVE9SIiwiU0VSVklDRV9FWEVDVVRPUiIsIkNPUlBTQUxFU19BRE1JTiJdLCJuYW1lIjoiQW51cmFnIiwibW9iaWxlIjoiNjM5MzAwNTY3MCIsImlkIjozMywicG9ydGFsIjoiQ09SUF9TQUxFUyIsImV4cCI6MTc1MTg5NjE2OCwidXNlcklEIjoiNTFhYzU0M2EtZDAyYS00YmJjLTg5MDctZDE4MzliMGZhNDIwIiwiaWF0IjoxNzQ0MTIwMTY4fQ._iGXWxTyyh4ZBMa3LTTH3uRJRqRHGvXSVsvJIgiAUJP8UKJV9HB8z7idbwKpfEe-GwzKKIm3n2CuuQpIP1hJ6A";
  const headers = {
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.get(url, { headers }));
  return response.data;
}
