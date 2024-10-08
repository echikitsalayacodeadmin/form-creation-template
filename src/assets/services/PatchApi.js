import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function updateData(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3MzE2NzUyMjUsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTcyMzg5OTIyNX0.ZPbjJSQPJkQPahHnUfz2g4YnVbTJqQPslyEYC11U5RHFgdvhCeKMYDC1V2xjMNzjyZyz9dMqBdrdpButAC22Og";

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
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3MzE2NzUyMjUsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTcyMzg5OTIyNX0.ZPbjJSQPJkQPahHnUfz2g4YnVbTJqQPslyEYC11U5RHFgdvhCeKMYDC1V2xjMNzjyZyz9dMqBdrdpButAC22Og";

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
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3MzE2NzUyMjUsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTcyMzg5OTIyNX0.ZPbjJSQPJkQPahHnUfz2g4YnVbTJqQPslyEYC11U5RHFgdvhCeKMYDC1V2xjMNzjyZyz9dMqBdrdpButAC22Og";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
