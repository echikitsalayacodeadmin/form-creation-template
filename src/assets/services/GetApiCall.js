import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function getData(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6bnVsbCwic3ViIjoidGVzdC5yZXBvcnRpbmdAdW5vLmNhcmUiLCJyb2xlIjoiUkVQT1JUSU5HX0FETUlOIiwicm9sZXMiOlsiUkVQT1JUSU5HX0FETUlOIiwiSEVBTFRIQ0FNUCIsIkVOR0FHRU1FTlQiXSwibmFtZSI6bnVsbCwibW9iaWxlIjpudWxsLCJicmFuY2hOYW1lIjoiR2hhdGFiaWxvZCIsImlkIjoxNTczLCJwb3J0YWwiOiJSRVBPUlRJTkciLCJleHAiOjE3NDc4MjQxMzcsInVzZXJJRCI6ImVjMjZiYWRkLTEzNTMtNDMwMS1hNWRiLTg5N2ZhMzdlZThhOCIsImlhdCI6MTc0MDA0ODEzN30.QZjSv_HU-1SR1lbF8nBOScHJ2_ZWHbpNLnUlkdGiq0iZ3TYSU1xEGzCPT0DWWnMvxibxq578TiGq2qEoMeeu2g";
  const headers = {
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.get(url, { headers }));
  return response.data;
}
