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

      const labs = await getLabs({
        lat: 22.7196,
        lng: 75.8577,
        corpId: "872cd841-9f7a-432d-b8e9-422b780bca10",
        empId: "LA888",
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
