import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function saveData(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3ODUxNzE3NDUsImlhdCI6MTc4NTEyOTc0NSwianRpIjoiMzIxMzE5MGQtMjMyMy00ZTAyLTllMWEtMTQxOTY5ZmRhNjQ3In0.peilLi39WZAtKIyKsoOtJaRAmCd6EIBS76VNOiSdTBj1JNq2N-9GZYS183Mv1nIxpenoIz0ZFgIQQgX4vttj8Q";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.post(url, obj, { headers }));
  return response.data;
}

export async function saveDataWithoutObject(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3ODUxNzE3NDUsImlhdCI6MTc4NTEyOTc0NSwianRpIjoiMzIxMzE5MGQtMjMyMy00ZTAyLTllMWEtMTQxOTY5ZmRhNjQ3In0.peilLi39WZAtKIyKsoOtJaRAmCd6EIBS76VNOiSdTBj1JNq2N-9GZYS183Mv1nIxpenoIz0ZFgIQQgX4vttj8Q";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.post(url, {}, { headers });
  return response.data;
}

export async function saveDataWithoutToken(url, obj) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3ODUxNzE3NDUsImlhdCI6MTc4NTEyOTc0NSwianRpIjoiMzIxMzE5MGQtMjMyMy00ZTAyLTllMWEtMTQxOTY5ZmRhNjQ3In0.peilLi39WZAtKIyKsoOtJaRAmCd6EIBS76VNOiSdTBj1JNq2N-9GZYS183Mv1nIxpenoIz0ZFgIQQgX4vttj8Q";

  const headers = {
    "Content-Type": "application/json",
  };
  return await Resolver(
    axios.post(url, obj, { headers }, { timeout: 5000 }).then((res) => res.data)
  );
}

export async function uploadFile(url, formData) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0LnJlcG9ydGluZ0B1bm8uY2FyZSIsInJvbGUiOiJSRVBPUlRJTkdfQURNSU4iLCJyb2xlcyI6WyJSRVBPUlRJTkdfQURNSU4iLCJIRUFMVEhDQU1QIiwiRU5HQUdFTUVOVCJdLCJtb2JpbGUiOm51bGwsImJyYW5jaE5hbWUiOiJHaGF0YWJpbG9kIiwidXNlcklEIjoiZWMyNmJhZGQtMTM1My00MzAxLWE1ZGItODk3ZmEzN2VlOGE4IiwidXNlclJvbGVzIjpudWxsLCJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOm51bGwsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3ODUxNzE3NDUsImlhdCI6MTc4NTEyOTc0NSwianRpIjoiMzIxMzE5MGQtMjMyMy00ZTAyLTllMWEtMTQxOTY5ZmRhNjQ3In0.peilLi39WZAtKIyKsoOtJaRAmCd6EIBS76VNOiSdTBj1JNq2N-9GZYS183Mv1nIxpenoIz0ZFgIQQgX4vttj8Q";
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
