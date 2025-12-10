import React, { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const rawData = [
  {
    date: "12-Nov-25",
    empId: 101206,
    name: "ALOK VERMA",
    gender: "Male",
    department: "POLYMER",
    "Name of UNO Care Staff": "RAHUL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "",
    injuryBodyPart: "Ankle",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "RT ANKLE TWIST",
    Category: "WORK RELATED",
    remarks: "FOLLOW ALL PRECAUTIONS WHILE WORKING",
    "Medicine Provided For Complaint -1": "Flexon MR tablet",
    "Quantity 1": 2,
    "Medicine Provided for Complaint 2": "NA",
    "Quantity 2": "NA",
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "NA",
    "Follow-up Required": "FALSE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "21-Nov-25",
    empId: 101206,
    name: "ALOK VERMA",
    gender: "Male",
    department: "POLYMER",
    "Name of UNO Care Staff": "RAHUL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "117/70",
    injuryBodyPart: "",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "FITNESS CERTIFICATE",
    Category: "WORK RELATED",
    remarks: "FOLLOW ALL PRECAUTIONS WHILE WORKING",
    "Medicine Provided For Complaint -1": "NA",
    "Quantity 1": "NA",
    "Medicine Provided for Complaint 2": "NA",
    "Quantity 2": "NA",
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "NA",
    "Follow-up Required": "FALSE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "27-Nov-25",
    empId: 402245,
    name: "PANKAJ",
    gender: "Male",
    department: "WPB",
    "Name of UNO Care Staff": "ANIL",
    "Name of the Dr.(FMO)": "DR RAVI",
    bp: "",
    injuryBodyPart: "Leg",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "RIGHT LEG CHEMICAL  BURN(LOWER LIMB)",
    Category: "WORK RELATED",
    remarks: "FOLLOW ALL PRECAUTIONS WHILE WORKING",
    "Medicine Provided For Complaint -1": "Burnheal ointment",
    "Quantity 1": "NA",
    "Medicine Provided for Complaint 2": "NA",
    "Quantity 2": "NA",
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "NA",
    "Follow-up Required": "FALSE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "18-Nov-25",
    empId: "ASN218",
    name: "PARHLAD",
    gender: "Male",
    department: "PUTTY BLOCK",
    "Name of UNO Care Staff": "SAHIL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "",
    injuryBodyPart: "Ring Finger",
    injuryType: "ACCIDENT",
    "Health Complaint 1":
      "PAIN AND BLEEDING FROM TIP OF RIGHT RING FINGER (AROUND BASE OF NAIL PLATE)",
    Category: "WORK RELATED",
    remarks: "TAKE MEDICNE AND FOLLOW ALL PRECAUTIONS",
    "Medicine Provided For Complaint -1": "Merideca injection",
    "Quantity 1": 1,
    "Medicine Provided for Complaint 2": "Tetanus toxoid injection",
    "Quantity 2": 1,
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "MEDICINE",
    "Follow-up Required": "TRUE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "18-Nov-25",
    empId: "AS180",
    name: "RAJNESH KUMAR",
    gender: "Male",
    department: "PUTTY BLOCK",
    "Name of UNO Care Staff": "SAHIL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "",
    injuryBodyPart: "Middle Finger",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "MILD PAIN AND BLEEDING FROM LT. MIDDLE FINGER",
    Category: "WORK RELATED",
    remarks: "TAKE MEDICNE AND FOLLOW ALL PRECAUTIONS",
    "Medicine Provided For Complaint -1": "Merideca injection",
    "Quantity 1": 1,
    "Medicine Provided for Complaint 2": "Tetanus toxoid injection",
    "Quantity 2": 1,
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "MEDICINE",
    "Follow-up Required": "TRUE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "11-Nov-25",
    empId: "S0090550",
    name: "SURENDER",
    gender: "Male",
    department: "GATE NO-3",
    "Name of UNO Care Staff": "ANIL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "",
    injuryBodyPart: "Head",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "MINOR CUT ON FOR HEAD",
    Category: "WORK RELATED",
    remarks: "TAKE MEDICNE AND FOLLOW ALL PRECAUTIONS",
    "Medicine Provided For Complaint -1": "DOXINATE",
    "Quantity 1": 2,
    "Medicine Provided for Complaint 2": "Combiflam tablet",
    "Quantity 2": 4,
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "MEDICINE",
    "Follow-up Required": "FALSE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
  {
    date: "14-Nov-25",
    empId: "M41200",
    name: "VISHAL",
    gender: "Male",
    department: "PACKING",
    "Name of UNO Care Staff": "SAHIL",
    "Name of the Dr.(FMO)": "DR ROHIT",
    bp: "130/80",
    injuryBodyPart: "",
    injuryType: "ACCIDENT",
    "Health Complaint 1": "ANNUAL MEDICAL",
    Category: "WORK RELATED",
    remarks: "FOLLOW ALL PRECAUTIONS WHILE WORKING",
    "Medicine Provided For Complaint -1": "NA",
    "Quantity 1": "NA",
    "Medicine Provided for Complaint 2": "NA",
    "Quantity 2": "NA",
    "Medicine Provided for Complaint-3": "NA",
    "Quantity 3": "NA",
    MEDICINE: "NA",
    "Follow-up Required": "FALSE",
    treatmentDoneAt: "TREATED_IN_OHC",
    injurySeverity: "MILD",
    injuryLocation: "INDUSTRIAL",
  },
]
  ?.map((item) => ({
    ...item,
    age: item?.age?.toString(),
    // mobile: item?.mobile?.toString(),

    ohcType: "INJURY",
    // empId: item?.empId?.toString(),
    corpId: "7166ef04-e16f-4ae9-bda8-a7ee6d6833fa",
    // gender: item.gender === "M" ? "MALE" : item.gender === "F" ? "FEMALE" : "",
  }))
  ?.map((item) => {
    const meds = [];

    const med1 = item["Medicine Provided For Complaint -1"];
    const qty1 = item["Quantity 1"];

    const med2 = item["Medicine Provided for Complaint 2"];
    const qty2 = item["Quantity 2"];

    const med3 = item["Medicine Provided for Complaint-3"];
    const qty3 = item["Quantity 3"];

    if (med1 && med1 !== "NA" && qty1 && qty1 !== "NA") {
      meds.push(`${med1} - QTY - ${qty1}`);
    }
    if (med2 && med2 !== "NA" && qty2 && qty2 !== "NA") {
      meds.push(`${med2} - QTY - ${qty2}`);
    }
    if (med3 && med3 !== "NA" && qty3 && qty3 !== "NA") {
      meds.push(`${med3} - QTY - ${qty3}`);
    }

    // Convert date -> YYYY-MM-DD
    const formattedDate = dayjs(item.date, ["D-MMM-YY", "DD-MMM-YY"]).format(
      "YYYY-MM-DD"
    );

    // Remove original medicine fields
    const {
      "Medicine Provided For Complaint -1": _m1,
      "Quantity 1": _q1,
      "Medicine Provided for Complaint 2": _m2,
      "Quantity 2": _q2,
      "Medicine Provided for Complaint-3": _m3,
      "Quantity 3": _q3,
      "Name of UNO Care Staff": _uno,
      "Name of the Dr.(FMO)": _doctor,
      MEDICINE: _m,
      "Health Complaint 1": _hc1,
      ...rest
    } = item;

    return {
      ...rest,
      date: formattedDate,
      gender:
        item?.gender === "Male"
          ? "MALE"
          : item?.gender === "Female"
          ? "FEMALE"
          : null,
      medicine: meds.length > 0 ? meds.join(", ") : "NA",
    };
  });

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

const UploadDataOPD = ({}) => {
  // const cleanedData = useMemo(() => cleanObject(rawData), [rawData]);
  const formatted = useMemo(() => cleanAndNormalizeData(rawData), [rawData]);

  console.log({ formatted });

  return <div></div>;
};

export default UploadDataOPD;
