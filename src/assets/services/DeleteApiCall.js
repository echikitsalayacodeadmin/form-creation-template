import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function deleteData(url) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.delete(url, { headers }));
  return response.data;
}
