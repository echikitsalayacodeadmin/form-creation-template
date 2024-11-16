import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function updateData(URL, OBJ) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authHeader_local,
  };

  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data)
  );
}
export async function updateDataFile(URL, OBJ) {
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + authHeader_local,
  };

  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data)
  );
}

export async function updateDataWithoutObject(url) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
