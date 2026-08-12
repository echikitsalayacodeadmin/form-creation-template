import { useState } from "react";
import {
  sendOtp,
  verifyOtp,
  getPatientByAuthId,
  getLabs,
  getPackages,
} from "./services/api";
import { jwtDecode } from "jwt-decode";
import { cityList } from "./data";
import { buildCityReportFields } from "./reportUtils";

const CONCURRENCY_LIMIT = 3; // run 3 numbers at once

export default function useAutomationBatch() {
  const [results, setResults] = useState([]);
  const [inProgress, setInProgress] = useState(false);

  const processMobile = async (mobile, otp) => {
    let row = { mobile, status: "Processing" };

    try {
      await sendOtp(mobile);
      const auth = await verifyOtp(mobile, otp);
      console.log({ auth });
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

      const cityReportFields = {};
      for (const { label, coordinates } of cityList) {
        const requestParams = {
          lat: coordinates[0],
          lng: coordinates[1],
          corpId,
          empId,
          city: label,
        };

        let labs = [];
        let packages = [];

        try {
          [labs, packages] = await Promise.all([
            getLabs(requestParams),
            getPackages(requestParams),
          ]);
        } catch (err) {
          labs = [];
          packages = [];
        }

        Object.assign(
          cityReportFields,
          buildCityReportFields(label, labs, packages)
        );
      }

      console.log({ cityReportFields });

      row = {
        mobile,
        patientId: patient?.patientId || "",
        name: patient?.name || "",
        ...cityReportFields,
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
