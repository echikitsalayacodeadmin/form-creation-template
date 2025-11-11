import React, { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const rawData = [
  {
    bp: "",
    sugar: "",
    height: "",
    weight: "",
    bloodGroup: "",
    corpId: "",
    empId: "",
    name: "Sunil Divekar",
    age: 30,
    gender: "MALE",
    mobile: "",
    department: "IQC",
    rest: "",
    complaint: "",
    medicine: "",
    underMedication: "",
    fitToWork: "",
    nextAppointmentDate: "13/10/2025",
    files: "",
    ohcType: "",
    injuryRemarks: "a Left Leg, Foot Ankle Injury Due\nto Distraction",
    injuryType: "incision",
    injuryLocation: "Industrial",
    uploadedUrls: "",
    treatmentDoneAt: "Referred Outside",
    injurySeverity: "MILD",
    primaryComplaint: "",
    primaryComplaintCategory: "",
    secondaryComplaint: "",
    otherComplaint: "",
    remarks: "",
    injuryBodyPart: "Leg",
    injuryBodyLocation: "Left",
    recordKeeper: "SIS KAVITA",
    incidentDepartment: "",
    incidentMachine: "",
    incidentShift: "",
    referredHospitalName: "Phoeinex",
    unsafeTag: "",
    injuryReportType: "",
    opdCaseStatus: "",
    date: "07/10/2025",
    caseRecordTimeStamp: "",
  },
  {
    bp: "",
    sugar: "",
    height: "",
    weight: "",
    bloodGroup: "",
    corpId: "",
    empId: "",
    name: "Aditya Chavan",
    age: 42,
    gender: "MALE",
    mobile: "",
    department: "PFD",
    rest: "",
    complaint: "",
    medicine: "",
    underMedication: "",
    fitToWork: "",
    nextAppointmentDate: "06/10/2025",
    files: "",
    ohcType: "",
    injuryRemarks:
      "During cleaning work of marking roller with cotton in hand, Operator Mr. Aditya hand get slipped & amp, get touch to doctor blade. So his middle Fingure of right hand get minor cut.",
    injuryType: "incision",
    injuryLocation: "Industrial",
    uploadedUrls: "",
    treatmentDoneAt: "Treated in OHC",
    injurySeverity: "MILD",
    primaryComplaint: "",
    primaryComplaintCategory: "",
    secondaryComplaint: "",
    otherComplaint: "",
    remarks: "",
    injuryBodyPart: "Middle finger",
    injuryBodyLocation: "Right",
    recordKeeper: "VINOD BRO",
    incidentDepartment: "",
    incidentMachine: "",
    incidentShift: "",
    referredHospitalName: "",
    unsafeTag: "",
    injuryReportType: "",
    opdCaseStatus: "",
    date: "04/10/2025",
    caseRecordTimeStamp: "",
  },
];
const cleanAndNormalizeData = (data) => {
  if (!Array.isArray(data)) return [];

  // ✅ List of all supported formats — short, long, and mixed
  const dateFormats = [
    "D-MMM-YY",
    "DD-MMM-YY",
    "D-MMM-YYYY",
    "DD-MMM-YYYY",
    "D/M/YYYY",
    "DD/M/YYYY",
    "D/MM/YYYY",
    "DD/MM/YYYY",
    "D-M-YYYY",
    "DD-MM-YYYY",
    "DD-MM-YY",
    "D-M-YY",
    "M/D/YYYY",
    "MM/DD/YYYY",
    "M/D/YY",
    "MM/DD/YY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "YYYY-M-D",
    "D MMM YYYY",
    "D MMM YY",
  ];

  return data.map((item) => {
    const normalized = { ...item };

    // --- 1️⃣ Normalize date to YYYY-MM-DD ---
    let parsedDate = null;
    if (normalized.date) {
      // Try all known formats
      for (const fmt of dateFormats) {
        const tryParse = dayjs(normalized.date, fmt, true);
        if (tryParse.isValid()) {
          parsedDate = tryParse;
          break;
        }
      }

      // If none worked, try free-form parse (last resort)
      if (!parsedDate) {
        const autoParsed = dayjs(normalized.date);
        if (autoParsed.isValid()) parsedDate = autoParsed;
      }

      normalized.date = parsedDate ? parsedDate.format("YYYY-MM-DD") : "";
    } else {
      normalized.date = "";
    }

    // --- 2️⃣ Generate caseRecordTimeStamp ---
    const dateStr = normalized.date?.trim?.();
    const timeStr = normalized.caseRecordTimeStamp?.trim?.();

    if (dateStr && timeStr && !timeStr.includes("T")) {
      let parsed = dayjs(`${dateStr} ${timeStr}`, [
        "YYYY-MM-DD HH:mm",
        "YYYY-MM-DD hh:mm A",
        "YYYY-MM-DD H:mm",
        "YYYY-MM-DD h:mm A",
      ]);

      normalized.caseRecordTimeStamp = parsed.isValid()
        ? parsed.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : "";
    } else if (timeStr && timeStr.includes("T")) {
      const parsed = dayjs(timeStr);
      normalized.caseRecordTimeStamp = parsed.isValid()
        ? parsed.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : "";
    } else {
      normalized.caseRecordTimeStamp = "";
    }

    // --- 3️⃣ Remove null/empty fields ---
    const cleaned = Object.fromEntries(
      Object.entries(normalized).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );

    return cleaned;
  });
};

const UploadDataOPD = ({}) => {
  // const cleanedData = useMemo(() => cleanObject(rawData), [rawData]);
  const formatted = useMemo(() => cleanAndNormalizeData(rawData), [rawData]);

  console.log({ formatted });

  return <div></div>;
};

export default UploadDataOPD;
