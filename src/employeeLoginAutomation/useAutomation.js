import { jwtDecode } from "jwt-decode";
import {
  sendOtp,
  verifyOtp,
  getPatientByAuthId,
  getLabs,
} from "./services/api";
import { useState } from "react";

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

      const labs = await getLabs({
        lat: 22.7196,
        lng: 75.8577,
        corpId: corpId,
        empId: empId,
      });

      const reportData = { auth, patient, labs };
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
