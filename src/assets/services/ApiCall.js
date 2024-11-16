import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { BASE_URL, BASE_URL_AUTH } from "../constants/Constant";
import { authHeader_local } from "../constant";

export async function getUserToken(
  username,
  password,
  role,
  url = BASE_URL_AUTH + "authenticate"
) {
  return await Resolver(
    axios(url, {
      method: "POST",
      data: {
        username: username,
        password: password,
        role: role,
      },
    }).then((res) => res.data)
  );
}

export async function getUserTokenByMobile(url, data) {
  return await Resolver(
    axios(url, {
      method: "POST",
      data: data,
    }).then((res) => res.data)
  );
}

export async function getMedicineListByName(medName) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authHeader_local,
  };
  return await Resolver(
    axios
      .get(
        BASE_URL +
          "doctor/medicineSearchPaginated/" +
          medName +
          "?page=0&size=10&sort=name",
        {
          headers,
        }
      )
      .then((res) => res.data)
  );
}
