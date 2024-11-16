import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function saveDataPut(URL, OBJ) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authHeader_local,
  };

  return await Resolver(
    axios.put(URL, OBJ, { headers }).then((res) => res.data)
  );
}
