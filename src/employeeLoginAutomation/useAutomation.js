import { jwtDecode } from "jwt-decode";
import {
  sendOtp,
  verifyOtp,
  getPatientByAuthId,
  getLabs,
  getPackages,
} from "./services/api";
import { useState } from "react";
import { buildCityReportFields } from "./reportUtils";

const useAutomation = () => {
  const [report, setReport] = useState(null);

  const runAutomationFlow = async (mobile, otp) => {
    try {
      await sendOtp(mobile);
      const auth = await verifyOtp(mobile, otp);
      const token = auth.token;
      console.log({ auth, token });

      const docodedAuth = jwtDecode(token);

      console.log({ docodedAuth });
      const authId = docodedAuth?.id;
      const patient = await getPatientByAuthId(authId, mobile);

      const empId = patient.empId;
      const corpId = patient.corpId;

      const requestParams = {
        lat: 22.7196,
        lng: 75.8577,
        corpId,
        empId,
        city: "Indore",
      };

      const [labs, packages] = await Promise.all([
        getLabs(requestParams),
        getPackages(requestParams),
      ]);

      const reportData = {
        auth,
        patient,
        labs,
        packages,
        summary: buildCityReportFields("Indore", labs, packages),
      };
      setReport(reportData);

      return reportData;
    } catch (error) {
      console.error("Automation failed:", error);
      throw error;
    }
  };

  return { report, runAutomationFlow };
};

export default useAutomation;
