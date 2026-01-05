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

      const labsPune = await getLabs({
        lat: 18.5204,
        lng: 73.8567,
        corpId: corpId,
        empId: empId,
      });

      console.log({ labsPune });

      // console.log({ cityByLabel: cityByLabel("Jaisalmer") });

      // const labsNimbahera = await getLabs({
      //   city: "Nimbahera",
      //   lat: cityByLabel("Nimbahera").coordinates[0],
      //   lng: cityByLabel("Nimbahera").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsJhajjar = await getLabs({
      //   city: "Jhajjar",
      //   lat: cityByLabel("Jhajjar").coordinates[0],
      //   lng: cityByLabel("Jhajjar").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsDhule = await getLabs({
      //   city: "Dhule",
      //   lat: cityByLabel("Dhule").coordinates[0],
      //   lng: cityByLabel("Dhule").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsAligarh = await getLabs({
      //   city: "Aligarh",
      //   lat: cityByLabel("Aligarh").coordinates[0],
      //   lng: cityByLabel("Aligarh").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsBadnawar = await getLabs({
      //   city: "Badnawar",
      //   lat: cityByLabel("Badnawar").coordinates[0],
      //   lng: cityByLabel("Badnawar").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsTulsigram = await getLabs({
      //   city: "Tulsigam",
      //   lat: cityByLabel("Tulsigram").coordinates[0],
      //   lng: cityByLabel("Tulsigram").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsJaipur = await getLabs({
      //   city: "Jaipur",
      //   lat: cityByLabel("Jaipur").coordinates[0],
      //   lng: cityByLabel("Jaipur").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsJaisalmer = await getLabs({
      //   city: "Jaisalmer",
      //   lat: cityByLabel("Jaisalmer").coordinates[0],
      //   lng: cityByLabel("Jaisalmer").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsAhmedabad = await getLabs({
      //   city: "Ahmedabad",
      //   lat: cityByLabel("Ahmedabad").coordinates[0],
      //   lng: cityByLabel("Ahmedabad").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });
      // const labsNewDelhi = await getLabs({
      //   city: "New Delhi",
      //   lat: cityByLabel("New Delhi").coordinates[0],
      //   lng: cityByLabel("New Delhi").coordinates[1],
      //   corpId: corpId,
      //   empId: empId,
      // });

      // Loop through all cities in cityList and get labs for each city
      const labsByCity = {};
      for (const city of cityList) {
        try {
          labsByCity[city] = await getLabs({
            city,
            lat: 18.5204,
            lng: 73.8567,
            corpId: corpId,
            empId: empId,
          });
        } catch (err) {
          labsByCity[city] = [];
        }
      }

      console.log({ labsByCity });

      row = {
        mobile,
        patientId: patient?.patientId || "",
        name: patient?.name || "",
        // labCount_indore: labs?.length || 0,
        // labCount_pune: labsPune?.length || 0,
        // labCount_Nimbahera: labsNimbahera?.length || 0,
        // labCount_Jhajjar: labsJhajjar?.length || 0,
        // labCount_Dhule: labsDhule?.length || 0,
        // labCount_Aligarh: labsAligarh?.length || 0,
        // labCount_Badnawar: labsBadnawar?.length || 0,

        // labCount_Tulsigram: labsTulsigram?.length || 0,
        // labCount_Jaipur: labsJaipur?.length || 0,
        // labCount_Jaisalmer: labsJaisalmer?.length || 0,
        // labCount_Ahmedabad: labsAhmedabad?.length || 0,
        // labCount_NewDelhi: labsNewDelhi?.length || 0,

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
