import React, { useState } from "react";
import { saveData } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { BASE_URL } from "../assets/constant";
import { useSnackbar } from "notistack";

const employeeDetails = [
  { empId: "055", weight: "90", height: "180", bp: "120/90" },
  { empId: "P1", weight: "88", height: "170", bp: "130/90" },
  { empId: "abcdef", weight: "66", height: "166", bp: "110/90" },
  { empId: "HLO58", weight: "69", height: "177", bp: "130/90" },
];

const AutoMatedFormEntry = ({
  employmentType = "",
  corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  campCycleId = "138858",
}) => {
  const { enqueueSnackbar } = useSnackbar();

  // States to track logs and errors
  const [log, setLog] = useState([]);
  const [fetchErrors, setFetchErrors] = useState([]);
  const [saveErrors, setSaveErrors] = useState([]);

  const _fetchEmployeeById = async (employeeId) => {
    const url = `${BASE_URL}org/detailed/campcycle/${employeeId}?corpId=${corpId}&employmentType=${employmentType}&campCycleId=${campCycleId}`;

    try {
      const empData = await getData(url);
      if (empData.error) {
        throw new Error(
          empData.error?.response?.data?.message || "Fetch error"
        );
      }

      const temp = empData.data.vaccines
        ? {
            ...empData.data,
            mobile: isNaN(empData.data.mobile) ? 0 : empData.data.mobile,
          }
        : {
            ...empData.data,
            mobile: isNaN(empData.data.mobile) ? 0 : empData.data.mobile,
            vaccines: [
              // Default vaccines data
              // ...
            ],
          };

      return temp;
    } catch (error) {
      enqueueSnackbar(`Fetch failed for empId: ${employeeId}`, {
        variant: "error",
      });
      setFetchErrors((prev) => [...prev, employeeId]);
      return null;
    }
  };

  const _saveDataHandler = async (formValues) => {
    const url = `${BASE_URL}org/detailed`;

    try {
      const dataOBJ = payload(corpId, formValues);
      const empData = await saveData(url, { ...dataOBJ, campCycleId });

      if (empData.error) {
        throw new Error(empData.error?.response?.data?.message || "Save error");
      }

      enqueueSnackbar("Saved successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Save failed for empId: ${formValues.empId}`, {
        variant: "error",
      });
      setSaveErrors((prev) => [...prev, formValues.empId]);
    }
  };

  const automateProcess = async () => {
    for (const employee of employeeDetails) {
      try {
        // Fetch employee details
        const fetchedDetails = await _fetchEmployeeById(employee.empId);
        if (!fetchedDetails) {
          continue; // Skip save if fetch fails
        }

        // Update specific fields
        const updatedDetails = {
          ...fetchedDetails,
          weight: employee.weight,
          bp: employee.bp,
          height: employee.height,
        };

        // Save updated details
        await _saveDataHandler(updatedDetails);

        // Log success
        setLog((prevLog) => [
          ...prevLog,
          `Successfully updated empId: ${employee.empId}`,
        ]);
      } catch (error) {
        console.error(`Failed to process empId: ${employee.empId}`, error);
        setLog((prevLog) => [
          ...prevLog,
          `Failed to update empId: ${employee.empId}`,
        ]);
      }
    }
  };

  return (
    <div>
      <button onClick={automateProcess}>Start Automation</button>
      <div>
        <h3>Logs:</h3>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Fetch Errors:</h3>
        <ul>
          {fetchErrors.map((empId, index) => (
            <li key={index}>Fetch failed for empId: {empId}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Save Errors:</h3>
        <ul>
          {saveErrors.map((empId, index) => (
            <li key={index}>Save failed for empId: {empId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutoMatedFormEntry;

const payload = (corpId, formValues) => {
  const p = {
    corpId: corpId,
    id: formValues.id,
    empId: formValues.empId,
    name: formValues.name,
    mobile: formValues.mobile,
    age: formValues.age,
    gender: formValues.gender,
    bp: formValues.bp,
    sugar: formValues.sugar,
    height: formValues.height,
    weight: formValues.weight,
    bmi: formValues.bmi,
    glass: formValues.glass || false,
    cataract: formValues.cataract || false,
    hearing: formValues.hearing || "normal",
    //date: formValues.date,
    smoking: formValues.smoking || false,
    alchohol: formValues.alchohol || false,
    panChewing: formValues.panChewing || false,
    gambling: formValues.gambling || false,
    drugAddiction: formValues.drugAddiction || false,
    eyeOperation: formValues.eyeOperation || false,
    bodyBuilt: formValues.bodyBuilt,
    nails: formValues.nails,
    hairs: formValues.hairs,
    doctorsRemark: formValues.doctorsRemark,
    bloodSampleCollected: formValues.bloodSampleCollected,
    urineSampleCollected: formValues.urineSampleCollected,
    audiometryDone: formValues.audiometryDone,
    pft: formValues.pft,
    xrayDone: formValues.xrayDone,
    stoolSampleCollected: formValues.stoolSampleCollected,
    eyeTest: formValues.eyeTest,
    fitToWork: formValues.fitToWork,
    department: formValues.department,
    ecg: formValues.ecg,
    eyeSightOk: formValues.eyeSightOk,
    farSighted: formValues.farSighted,
    nearSighted: formValues.nearSighted,
    bloodGroup: formValues.bloodGroup,
    //cbc: formValues.cbc,
    //serumBilirubin: formValues.serumBilirubin,
    //fitnessCertificate: formValues.fitnessCertificate,
    eyeTestVM: formValues.eyeTestVM,
    nearLeftEyeSight: formValues.nearLeftEyeSight,
    nearRightEyeSight: formValues.nearRightEyeSight,
    farLeftEyeSight: formValues.farLeftEyeSight,
    farRightEyeSight: formValues.farRightEyeSight,
    colourVision: formValues.colourVision,
    packageName: formValues.packageName,
    tokenNumber: formValues.tokenNumber,
    fathersName: formValues.fathersName,
    eyeSightWithGlasses: formValues.eyeSightWithGlasses,
    eyeSightWithContactLens: formValues.eyeSightWithContactLens,
    vaccines: formValues.vaccines,
    pulseRate: formValues.pulseRate,
    spO2Percent: formValues.spO2Percent,
    isFoodIntakeLast2Hours: formValues.isFoodIntakeLast2Hours,
    designation: formValues.designation,
    contractorName: formValues.contractorName,
    vaccineDosageUpdateVM: formValues.vaccineDosageUpdateVM,
    abdominalGirth: formValues.abdominalGirth,
    waistGirth: formValues.waistGirth,
    hipGirth: formValues.hipGirth,
  };

  return p;
};
