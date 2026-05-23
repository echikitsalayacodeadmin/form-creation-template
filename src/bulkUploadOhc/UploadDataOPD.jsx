import React, { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const rawData = [
  {
    "name": "SUNIL NAGVEKAR",
    "gender": "MALE",
    "department": "Production",
    "ohcType": "INJURY",
    "injuryRemarks": "FOREIGN BODY IN LT.INDEX FINGER, INCISED WOUND,BLEEDING +",
    "injuryType": "ACCIDENT",
    "injuryLocation": "INDUSTRIAL",
    "uploadedUrls": "",
    "treatmentDoneAt": "REFERRED_OUTSIDE",
    "injurySeverity": "MILD",
    "primaryComplaint": "",
    "primaryComplaintCategory": "",
    "secondaryComplaint": "",
    "otherComplaint": "",
    "remarks": "",
    "injuryBodyPart": "Index finger",
    "injuryBodyLocation": "Left",
    "recordKeeper": "",
    "incidentDepartment": "",
    "incidentMachine": "",
    "incidentShift": "",
    "referredHospitalName": "Suvarna Hospital",
    "unsafeTag": "",
    "injuryReportType": "FAC",
    "opdCaseStatus": "",
    "date": "4/2/26",
    "caseRecordTimeStamp": ""
  }
]
  ?.map((item) => ({
    ...item,
    // age: item?.age?.toString(),
    // // mobile: item?.mobile?.toString(),
    ohcType: "INJURY",
    // empId: item?.empId?.toString(),
    corpId: '25a81d71-7cfb-4f3e-9927-a94ca55017a5',
    // fitToWork: item?.fitToWork === "TRUE" ? true : item?.fitToWork === "FALSE" ? false : null,
    // underMedication: item?.underMedication === "TRUE" ? true : item?.underMedication === "FALSE" ? false : null,
    // rest: item?.rest === "TRUE" ? true : item?.rest === "FALSE" ? false : null,
    // gender: item.gender === "Male" ? "MALE" : item.gender === "Female" ? "FEMALE" : "",
  }))
// ?.map((item) => {
//   const meds = [];

//   const med1 = item["Medicine Provided for Complaint 1"];
//   const qty1 = item["Quantity 1"];

//   const med2 = item["Medicine Provided for Complaint 2"];
//   const qty2 = item["Quantity 2"];

//   const med3 = item["Medicine Provided for Complaint 3"];
//   const qty3 = item["Quantity 3"];

//   if (med1 && med1 !== "NA" && qty1 && qty1 !== "NA") {
//     meds.push(`${med1} - QTY - ${qty1}`);
//   }
//   if (med2 && med2 !== "NA" && qty2 && qty2 !== "NA") {
//     meds.push(`${med2} - QTY - ${qty2}`);
//   }
//   if (med3 && med3 !== "NA" && qty3 && qty3 !== "NA") {
//     meds.push(`${med3} - QTY - ${qty3}`);
//   }

//   // Convert date -> YYYY-MM-DD
//   // const formattedDate = dayjs(item.date, ["D-MMM-YY", "DD-MMM-YY"]).format(
//   //   "YYYY-MM-DD"
//   // );

//   // Remove original medicine fields
//   const {
//     "Medicine Provided For Complaint 1": _m1,
//     "Quantity 1": _q1,
//     "Medicine Provided for Complaint 2": _m2,
//     "Quantity 2": _q2,
//     "Medicine Provided for Complaint 3": _m3,
//     "Quantity 3": _q3,
//     "Name of UNO Care Staff": _uno,
//     "Name of the Dr.(FMO)": _doctor,
//     MEDICINE: _m,
//     "Health Complaint 1": _hc1,
//     ...rest
//   } = item;

//   return {
//     ...rest,
//     date: item?.date,
//     medicine: meds.length > 0 ? meds.join(", ") : "NA",
//   };
// });

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
    "DD/MM/YY",
    "D/M/YY",
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




// const mergeByEmpCode = (data) => {
//   const map = new Map();

//   data.forEach((item) => {
//     const empCode = item["EMP CODE"];

//     if (!map.has(empCode)) {
//       map.set(empCode, { ...item });
//     } else {
//       const existing = map.get(empCode);

//       const merged = { ...existing };

//       Object.keys(item).forEach((key) => {
//         const newValue = item[key];
//         const oldValue = existing[key];

//         // Rule:
//         // - If old is empty → take new
//         // - If both exist → prefer non-empty / latest
//         if (
//           oldValue === "" ||
//           oldValue === null ||
//           oldValue === undefined ||
//           oldValue === "Not given"
//         ) {
//           merged[key] = newValue;
//         }
//         // Optional: if both values exist and different → you can customize
//         else if (
//           newValue !== "" &&
//           newValue !== null &&
//           newValue !== undefined &&
//           newValue !== "Not given" &&
//           oldValue !== newValue
//         ) {
//           // You can choose:
//           // merged[key] = newValue; // overwrite
//           // OR keep old (current logic keeps old)
//         }
//       });

//       map.set(empCode, merged);
//     }
//   });

//   return Array.from(map.values());
// };

const UploadDataOPD = ({ }) => {
  // const cleanedData = useMemo(() => cleanObject(rawData), [rawData]);
  const formatted = useMemo(() => cleanAndNormalizeData(rawData), [rawData]);

  console.log({ formatted });

  // console.log({ IIIOO: mergeByEmpCode(B) })

  return <div></div>;
};

export default UploadDataOPD;
