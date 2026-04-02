import axios from "axios";
import { Resolver } from "./resolver/Resolver";

export async function updateData(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW1vY29ycC5ockB1bm8uY2FyZSIsInJvbGUiOiJPUkdfQURNSU4iLCJyb2xlcyI6WyJPUkdfQURNSU4iXSwibW9iaWxlIjoiNzQxNzg3MjE2NSIsImlzQWN0aXZlIjp0cnVlLCJ1c2VySUQiOiI4NzJjZDg0MS05ZjdhLTQzMmQtYjhlOS00MjJiNzgwYmNhMTAiLCJ1c2VyUm9sZXMiOlsiUmV0ZXN0Il0sInBlcm1pc3Npb25zIjpbXSwibmFtZSI6Im51bGwiLCJpZCI6MzQ1LCJleHAiOjE3NzUyMDM1MTgsImlhdCI6MTc3NTExNzExOCwianRpIjoiOWE1ZDcwNGQtZGIxOC00OWY3LWE1N2QtMTAwYjA2YTlhNDQ0In0.32PqGVWJ5Mw4xxq5SI7y2jk0x3dcICzSOLoFSbtlx1KkJQ84hd_nITX6QmN8iVODGnt-i3Yu0FWnaXyXpRoYjw";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authHeader_local,
  };
  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data),
  );
}
export async function updateDataFile(URL, OBJ) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW1vY29ycC5ockB1bm8uY2FyZSIsInJvbGUiOiJPUkdfQURNSU4iLCJyb2xlcyI6WyJPUkdfQURNSU4iXSwibW9iaWxlIjoiNzQxNzg3MjE2NSIsImlzQWN0aXZlIjp0cnVlLCJ1c2VySUQiOiI4NzJjZDg0MS05ZjdhLTQzMmQtYjhlOS00MjJiNzgwYmNhMTAiLCJ1c2VyUm9sZXMiOlsiUmV0ZXN0Il0sInBlcm1pc3Npb25zIjpbXSwibmFtZSI6Im51bGwiLCJpZCI6MzQ1LCJleHAiOjE3NzUyMDM1MTgsImlhdCI6MTc3NTExNzExOCwianRpIjoiOWE1ZDcwNGQtZGIxOC00OWY3LWE1N2QtMTAwYjA2YTlhNDQ0In0.32PqGVWJ5Mw4xxq5SI7y2jk0x3dcICzSOLoFSbtlx1KkJQ84hd_nITX6QmN8iVODGnt-i3Yu0FWnaXyXpRoYjw";

  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + authHeader_local,
  };

  return await Resolver(
    axios.patch(URL, OBJ, { headers }).then((res) => res.data),
  );
}

export async function updateDataWithoutObject(url) {
  let authHeader_local =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW1vY29ycC5ockB1bm8uY2FyZSIsInJvbGUiOiJPUkdfQURNSU4iLCJyb2xlcyI6WyJPUkdfQURNSU4iXSwibW9iaWxlIjoiNzQxNzg3MjE2NSIsImlzQWN0aXZlIjp0cnVlLCJ1c2VySUQiOiI4NzJjZDg0MS05ZjdhLTQzMmQtYjhlOS00MjJiNzgwYmNhMTAiLCJ1c2VyUm9sZXMiOlsiUmV0ZXN0Il0sInBlcm1pc3Npb25zIjpbXSwibmFtZSI6Im51bGwiLCJpZCI6MzQ1LCJleHAiOjE3NzUyMDM1MTgsImlhdCI6MTc3NTExNzExOCwianRpIjoiOWE1ZDcwNGQtZGIxOC00OWY3LWE1N2QtMTAwYjA2YTlhNDQ0In0.32PqGVWJ5Mw4xxq5SI7y2jk0x3dcICzSOLoFSbtlx1KkJQ84hd_nITX6QmN8iVODGnt-i3Yu0FWnaXyXpRoYjw";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader_local}`,
  };
  const response = await axios.patch(url, {}, { headers });
  return response.data;
}
