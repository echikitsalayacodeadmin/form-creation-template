import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function deleteData(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIl0sIm5hbWUiOm51bGwsIm1vYmlsZSI6bnVsbCwiYnJhbmNoTmFtZSI6IkdoYXRhYmlsb2QiLCJpZCI6MTU3MywicG9ydGFsIjoiUkVQT1JUSU5HIiwiZXhwIjoxNzIyMTM2ODA1LCJ1c2VySUQiOiJlYzI2YmFkZC0xMzUzLTQzMDEtYTVkYi04OTdmYTM3ZWU4YTgiLCJpYXQiOjE3MTQzNjA4MDV9.qZCwicEAijgz1SNqis5joBkebLlfYsg1XdsRSh5nDS-Wo-ZgdmyG9bh6tvG01_Ny_o7Ld_FmkZ4dpNajvaTdfw";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.delete(url, { headers }));
  return response.data;
}
