import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function getData(url) {
  const headers = {
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.get(url, { headers }));
  return response.data;
}
