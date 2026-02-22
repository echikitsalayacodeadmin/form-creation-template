import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function getData(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyUm9sZXMiOm51bGwsInN1YiI6ImNmQHVuby5jYXJlIiwicm9sZSI6Ik9SR19BRE1JTiIsInBlcm1pc3Npb25zIjpbXSwicm9sZXMiOlsiT1JHX0FETUlOIl0sIm5hbWUiOm51bGwsIm1vYmlsZSI6bnVsbCwiaWQiOjEyMjU5LCJpc0FjdGl2ZSI6dHJ1ZSwiZXhwIjoxNzc1NzEzNzkxLCJ1c2VySUQiOiI3MTZlN2FhZC0zYzRhLTRmNmYtOGY3Yy0wYzQxMjA0MDI5ZjEiLCJpYXQiOjE3Njc5Mzc3OTF9.WoSljQKOUtfJhrxSDda4mQEyJmw_cAW75rSZV4iWUQl38EIa8YjqEy7Zy89NDTBrodF8atnskRUyCe_fUp37tw";
  const headers = {
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await Resolver(axios.get(url, { headers }));
  return response.data;
}
