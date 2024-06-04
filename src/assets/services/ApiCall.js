import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { BASE_URL, BASE_URL_AUTH } from "../constants/Constant";

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
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIl0sIm5hbWUiOm51bGwsIm1vYmlsZSI6bnVsbCwiYnJhbmNoTmFtZSI6IkdoYXRhYmlsb2QiLCJpZCI6MTU3MywicG9ydGFsIjoiUkVQT1JUSU5HIiwiZXhwIjoxNzIyMTM2ODA1LCJ1c2VySUQiOiJlYzI2YmFkZC0xMzUzLTQzMDEtYTVkYi04OTdmYTM3ZWU4YTgiLCJpYXQiOjE3MTQzNjA4MDV9.qZCwicEAijgz1SNqis5joBkebLlfYsg1XdsRSh5nDS-Wo-ZgdmyG9bh6tvG01_Ny_o7Ld_FmkZ4dpNajvaTdfw";

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
