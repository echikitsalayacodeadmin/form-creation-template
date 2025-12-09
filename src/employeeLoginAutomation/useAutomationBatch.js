import { useState } from "react";
import {
  sendOtp,
  verifyOtp,
  getPatientByAuthId,
  getLabs,
} from "./services/api";
import { jwtDecode } from "jwt-decode";

const CONCURRENCY_LIMIT = 3; // run 3 numbers at once

export default function useAutomationBatch() {
  const [results, setResults] = useState([]);
  const [inProgress, setInProgress] = useState(false);

  const processMobile = async (mobile, otp) => {
    let row = { mobile, status: "Processing" };

    try {
      await sendOtp(mobile);
      const auth = await verifyOtp(mobile, otp);
      localStorage.setItem("ACCESS_TOKEN", auth.token);

      const docodedAuth = jwtDecode(auth.token);
      console.log({ docodedAuth });

      const patient = await getPatientByAuthId(docodedAuth.id, mobile);
      const labs = await getLabs({
        lat: 22.7196,
        lng: 75.8577,
        corpId: "872cd841-9f7a-432d-b8e9-422b780bca10",
        empId: "LA888",
      });

      row = {
        mobile,
        patientId: patient?.id || "",
        name: patient?.fullName || "",
        labCount: labs?.length || 0,
        status: "Success",
        isLabFlowEnabled: patient.isLabFlowEnabled,
      };
    } catch (error) {
      console.error(error);
      row.status = "Failed";
    }

    setResults((prev) => [...prev, row]);
  };

  const asyncPool = async (list, limit, fn, otp) => {
    const ret = [];
    const executing = [];

    for (const item of list) {
      const p = Promise.resolve().then(() => fn(item, otp));
      ret.push(p);

      if (limit <= list.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= limit) {
          await Promise.race(executing);
        }
      }
    }

    return Promise.all(ret);
  };

  const startBatch = async (list, otp) => {
    setResults([]);
    setInProgress(true);

    await asyncPool(list, CONCURRENCY_LIMIT, processMobile, otp);

    setInProgress(false);
  };

  return { results, startBatch, inProgress };
}
