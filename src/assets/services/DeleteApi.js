import axios from "axios";
import { Resolver } from "./resolver/Resolver";
import { authHeader_local } from "../constant";

export async function deleteData(URL) {
  return await Resolver(
    axios(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authHeader_local,
      },
    }).then((res) => res.data)
  );
}
export async function deleteDataWithObj(URL, Obj) {
  return await Resolver(
    axios(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authHeader_local,
      },
      data: Obj,
    }).then((res) => res.data)
  );
}
