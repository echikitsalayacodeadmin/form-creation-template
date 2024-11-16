import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function saveData(url, obj) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.post(url, obj, { headers }));
  return response.data;
}

export async function saveDataWithoutObject(url) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.post(url, {}, { headers });
  return response.data;
}

export async function saveDataWithoutToken(url, obj) {
  const headers = {
    "Content-Type": "application/json",
  };
  return await Resolver(
    axios.post(url, obj, { headers }, { timeout: 5000 }).then((res) => res.data)
  );
}

export async function uploadFile(url, formData) {
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
