import { useState } from "react";
import {
  sendOtp,
  verifyOtp,
  getPatientByAuthId,
  getLabs,
} from "./services/api";
import { jwtDecode } from "jwt-decode";
import { cityByLabel, cityList } from "./data";

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

      console.log({ patient });

      const empId = patient.empId;
      const corpId = patient.corpId;
      // const labs = await getLabs({
      //   lat: 22.7196,
      //   lng: 75.8577,
      //   corpId: corpId,
      //   empId: empId,
      // });

   
      // console.log({ cityByLabel: cityByLabel("Jaisalmer") });

      // const labsNimbahera = await getLabs({
      //   city: "Nimbahera",
      //   lat: cityByLabel("Nimbahera").coordinates[0],
      //   lng: cityByLabel("Nimbahera").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
    

      // Loop through all cities in cityList and get labs for each city
      const labsByCity = {};
      for (const {label, coordinates} of cityList) {
        try {
          labsByCity[label] = await getLabs({
            label,
            lat:coordinates[0],
            lng: coordinates[1],
            corpId: corpId,
            empId: empId,
          });
        } catch (err) {
          labsByCity[label] = [];
        }
      }

      console.log({ labsByCity });

      row = {
        mobile,
        patientId: patient?.patientId || "",
        name: patient?.name || "",
        // labCount_indore: labs?.length || 0,

        // For each city in labsByCity, add a field 'labCount_<city>' showing count of labs
        ...Object.fromEntries(
          Object.entries(labsByCity).flatMap(([city, labs]) => [
            [
              `labCount_${city.replace(/ /g, "_")}`,
              Array.isArray(labs) ? labs.length : 0,
            ],
            [
              `labNames_${city.replace(/ /g, "_")}`,
              Array.isArray(labs)
                ? labs.map((lab) => lab.labName || lab.name || "").join(" || ")
                : "",
            ],
          ])
        ),

        status: "Success",
        isLabFlowEnabled: patient.isLabFlowEnabled,
        role: docodedAuth.role,
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
