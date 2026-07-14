import dayjs from "dayjs";

const cd = (data) => data?.cholestrolData || {};

const pick = (data, ...keys) => {
  const source = cd(data);
  for (const key of keys) {
    const value = source[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

const pickRoot = (data, ...keys) => {
  for (const key of keys) {
    const value = data?.[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

const nilIfEmpty = (value, fallback = "NIL") => {
  if (value == null || String(value).trim() === "") return fallback;
  const normalized = String(value).trim();
  if (normalized.toLowerCase() === "none") return "NIL";
  return normalized;
};

const formatGender = (gender) => {
  const g = String(gender || "").toUpperCase();
  if (g === "MALE") return "Male";
  if (g === "FEMALE") return "Female";
  return gender || "";
};

const formatDOJ = (value) =>
  value && dayjs(value).isValid() ? dayjs(value).format("DD.MM.YYYY") : "";

const calcWorkingSince = (doj, referenceDate) => {
  if (!doj || !dayjs(doj).isValid()) return "";
  const end =
    referenceDate && dayjs(referenceDate).isValid()
      ? dayjs(referenceDate)
      : dayjs();
  return `${end.diff(dayjs(doj), "year", true).toFixed(1)}Yrs`;
};

const formatCheckUpDate = (value) => {
  if (!value) return "";
  const trimmed = String(value).trim();
  const parsed = dayjs(
    trimmed,
    ["D-MMM-YYYY hh:mm A", "D-MMM-YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"],
    true
  );
  if (parsed.isValid()) return parsed.format("D/M/YYYY");
  return dayjs(trimmed).isValid() ? dayjs(trimmed).format("D/M/YYYY") : trimmed;
};

const getBmiStatus = (bmi) => {
  const n = Number(bmi);
  if (Number.isNaN(n)) return "";
  if (n >= 16.5 && n <= 24.49) return "Normal";
  if (n < 16.5) return "Underweight";
  return "Overweight";
};

const getHabits = (data) => {
  const hh = data?.healthHistoryFormData || {};
  const tobacco = nilIfEmpty(hh.tobaccoHabit, "No");
  const alcohol = nilIfEmpty(hh.alcoholHabit, "No");
  const smoking = nilIfEmpty(hh.smokingHabit, "No");
  if (tobacco === "No" && alcohol === "No" && smoking === "No") {
    return "NIL";
  }
  return `Tobacco: ${tobacco}, Alcohol: ${alcohol}, Smoking: ${smoking}`;
};

const hasValue = (value) => value != null && String(value).trim() !== "";

const hasGlasses = (data) =>
  hasValue(data?.nearRightEyeSightWithGlasses) ||
  hasValue(data?.nearLeftEyeSightWithGlasses) ||
  hasValue(data?.farRightEyeSightWithGlasses) ||
  hasValue(data?.farLeftEyeSightWithGlasses);

const getInvestigationStatus = (url, remark, defaultValue = "WNL") => {
  if (remark) return remark;
  return url ? defaultValue : "";
};

const getBloodSugar = (data) => Number(pick(data, "BLOOD SUGAR RANDOM"));

const getBloodExamRemark = (data) => {
  const sugar = getBloodSugar(data);
  if (!Number.isNaN(sugar) && sugar > 140) return "High Blood Sugar";
  return data?.bloodTestUrl ? "Normal" : "";
};

const getAdvice = (data) => {
  const sugar = getBloodSugar(data);
  if (!Number.isNaN(sugar) && sugar > 140) return "Phy.Ref.";
  if (data?.doctorsRemark || data?.doctorRecommendation) return "Phy.Ref.";
  return "";
};

const getPathologyAdvice = (data) => {
  const sugar = getBloodSugar(data);
  if (!Number.isNaN(sugar) && sugar > 140)
    return "Physician Opinion For High Sugar";
  return data?.doctorsRemark || data?.doctorRecommendation || "";
};

const getRemark = (data) =>
  data?.healthStatusRemark ||
  data?.doctorsRemark ||
  data?.remark ||
  data?.fitnessRemark ||
  data?.doctorRemark ||
  "This Employee is free from communicable disease and fit for job";

export const mapSuzlonOMSCheckupData = (data = {}, serialNo = "") => {
  const examDate = data?.vitalsCreatedDate;
  const vitalsDate = formatCheckUpDate(examDate);
  const withSpecs = hasGlasses(data);
  return {
    empId: data?.empId || "",
    tokenNumber: data?.tokenNumber || "",
    serialNo: serialNo || data?.tokenNumber || data?.reportingSno || "",
    name: data?.name || "",
    age: data?.age || pick(data, "AGE") || "",
    gender: formatGender(data?.gender || pick(data, "GENDER")),
    maritalStatus: nilIfEmpty(data?.maritalStatus),
    dateOfJoining: formatDOJ(data?.dateOfJoining),
    workingSince: calcWorkingSince(data?.dateOfJoining, examDate),
    department: data?.department || "",
    designation: data?.designation || "",
    contractorName: data?.contractorName || "",
    presentComplaints: nilIfEmpty(
      data?.healthHistoryFormData?.medicalCondition
    ),
    pastHistory: pickRoot(data, "pastHistory") || "",
    familyHistory: nilIfEmpty(
      data?.healthHistoryFormData?.familyHistory || data?.familyHistory,
      "NIL-NIL"
    ),
    allergicTo: nilIfEmpty(data?.allergicTo),
    identificationMark: data?.identificationMark || "",
    habits: getHabits(data),
    height: data?.height || pick(data, "height"),
    weight: data?.weight || pick(data, "weight"),
    bmi: data?.bmi || "",
    bmiStatus: getBmiStatus(data?.bmi),
    pulseRate: data?.pulseRate || "",
    bp:
      data?.bp ||
      (pick(data, "highBp") && pick(data, "lowBp")
        ? `${pick(data, "highBp")}/${pick(data, "lowBp")}`
        : ""),
    tonsils: "Normal",
    nose: "Normal",
    teeth: "Normal",
    nails: data?.nails || "Normal",
    skin: "NAD",
    throat: "Normal",
    eyeVision: "Without Specs",
    colourVision: nilIfEmpty(data?.colourVision, "Normal"),
    nearRightEye: data?.nearRightEyeSight || "",
    farRightEye: data?.farRightEyeSight || "",
    nearLeftEye: data?.nearLeftEyeSight || "",
    farLeftEye: data?.farLeftEyeSight || "",
    rs: "NAD",
    cvs: "NAD",
    git: "NAD",
    cns: "NAD",
    gus: "NAD",
    ms: "NAD",
    ecg: getInvestigationStatus(data?.ecgUrl, data?.remarks?.ecg),
    pft: getInvestigationStatus(data?.pftUrl),
    audiometryLeft: getInvestigationStatus(
      data?.audiometryUrl,
      data?.hearing === "normal" ? "WNL" : ""
    ),
    audiometryRight: getInvestigationStatus(
      data?.audiometryUrl,
      data?.hearing === "normal" ? "WNL" : ""
    ),
    xray: data?.xrayUrl ? "Chest PA View Normal" : "",
    bloodExam: getBloodExamRemark(data),
    advice: getAdvice(data),
    remark: getRemark(data),
    vitalsDate: vitalsDate,
    pathology: {
      haemoglobin: pick(data, "HB"),
      rbc: pick(data, "RBC"),
      pcv: pick(
        data,
        "Packed Cell Volume",
        "PCV",
        "HCT",
        "Packed Cell Volume / PCV"
      ),
      platelet: pick(data, "PLATELET", "PLATELETS"),
      esr: pick(data, "ESR"),
      bloodGroup: data?.bloodGroup || pick(data, "Blood Group"),
      wbc: pick(data, "WBC", "TOTAL WBC COUNT"),
      neutrophils: pick(data, "Neutrophils", "NEUTROPHILS"),
      lymphocytes: pick(data, "Lymphocytes", "LYMPHOCYTES"),
      monocytes: pick(data, "Monocytes", "MONOCYTES"),
      eosinophils: pick(data, "Eosinophils", "EOSINOPHILS"),
      basophils: pick(data, "Basophils", "BASOPHILS"),
      bloodSugarRandom: pick(data, "BLOOD SUGAR RANDOM"),
      sgot: pick(data, "SGOT", "S.G.O.T") || data?.sgot || "",
      bloodUrea: pick(data, "BLOOD UREA", "UREA"),
      cholesterol: pick(data, "S.CHOLESTEROL"),
      otherTest1: pick(data, "OTHER TEST 1"),
      bilirubin: pick(
        data,
        "TOTAL BILIRUBIN",
        "S.BILIRUBIN",
        "BILIRUBIN",
        "URINE_BILIRUBIN"
      ),
      sgpt: pick(data, "SGPT", "S.G.P.T") || data?.sgpt || "",
      creatinine:
        pick(data, "S.CREATININE", "SCREATININE") || data?.creatinine || "",
      triglyceride: pick(data, "S.TRIGLYCERIDE", "TRIGLYCERIDE"),
      otherTest2: pick(data, "OTHER TEST 2"),
      urineColour: pick(data, "URINE.COLOUR"),
      urineProtein: pick(data, "URINE.PROTEIN", "URINE.PROTEINS"),
      urineKetones: pick(data, "URINE.KETONE", "URINE.KETONES"),
      urineOccultBlood: pick(data, "URINE.OCCULT_BLOOD", "STOOL.OCCULT_BLOOD"),
      epithelialCells: pick(data, "Epithelial cells", "URINE.EPITHELIAL_CELLS"),
      urineRbc: pick(
        data,
        "URINE.RED_BLOOD_CELL",
        "URINE.RED_BLOOD_CELLS",
        "URINE.RBC"
      ),
      urineReaction: pick(
        data,
        "URINE.REACTION",
        "URINE.PH",
        "URINE.APPEARANCE"
      ),
      urineSugar: pick(data, "URINE.GLUCOSE", "URINE.SUGAR"),
      bileSalt: pick(data, "URINE.BILE_SALTS", "URINE.BILE_SALT"),
      bilePigments: pick(data, "URINE.BILE_PIGMENT", "URINE.BILE_PIGMENTS"),
      pusCells: pick(data, "URINE.PUS_CELLS"),
      crystals: pick(data, "URINE.CRYSTALS", "Crystals"),
      auAgTest: pick(data, "HBsAg", "AU AG TEST"),
      vdrlTest: pick(data, "VDRL", "V.D.R.L"),
      otherSpecialTest: pick(data, "OTHER SPECIAL TEST"),
      widalTest: pick(data, "WIDAL", "WIDAL TEST"),
      stoolExam: pick(data, "STOOL EXAM", "STOOL"),
      advice: data?.remarks?.advice || "",
    },
  };
};
