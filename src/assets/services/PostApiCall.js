import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function saveData(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NjI2ODAzMDYsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTc1NDkwNDMwNn0.nqS5dgPFTKtgcTuQhftknm7a8qzNoz032CMM7Oq4m_zr35TWMkyCIGeBWcRmDpVRI_8ZCXXvf72QcYoeyikSfA";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.post(url, obj, { headers }));
  return response.data;
}

export async function saveDataWithoutObject(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NjI2ODAzMDYsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTc1NDkwNDMwNn0.nqS5dgPFTKtgcTuQhftknm7a8qzNoz032CMM7Oq4m_zr35TWMkyCIGeBWcRmDpVRI_8ZCXXvf72QcYoeyikSfA";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.post(url, {}, { headers });
  return response.data;
}

export async function saveDataWithoutToken(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NjI2ODAzMDYsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTc1NDkwNDMwNn0.nqS5dgPFTKtgcTuQhftknm7a8qzNoz032CMM7Oq4m_zr35TWMkyCIGeBWcRmDpVRI_8ZCXXvf72QcYoeyikSfA";

  const headers = {
    "Content-Type": "application/json",
  };
  return await Resolver(
    axios.post(url, obj, { headers }, { timeout: 5000 }).then((res) => res.data)
  );
}

export async function uploadFile(url, formData) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NzA1MzE1MzgsImlhdCI6MTc2Mjc1NTUzOH0.6MFRxrQDoNAbWca9IIybGMxIyySxd_Om5V1kB45ByI7n__oBOsU_KJWKkGRU2DHJHXu5kTci7Sxx1OJC_ximBA";
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
