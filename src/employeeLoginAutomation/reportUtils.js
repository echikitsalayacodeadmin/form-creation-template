const getPackageName = (pkg) =>
  pkg?.name || pkg?.vendorPackageName || pkg?.parentPackageName || "";

export const getCityLabSummary = (labs = []) => {
  if (!Array.isArray(labs)) {
    return { count: 0, names: "" };
  }

  const names = labs
    .map((lab) => lab?.name || lab?.labName || "")
    .filter(Boolean);

  return {
    count: labs.length,
    names: names.join(" || "),
  };
};

export const getCityPackageSummary = (labs = [], packages = []) => {
  if (!Array.isArray(labs) || !Array.isArray(packages)) {
    return { count: 0, names: "" };
  }

  const labIds = new Set(labs.map((lab) => lab?.id).filter(Boolean));
  const packageNames = [
    ...new Set(
      packages
        .filter((pkg) => labIds.has(pkg?.labId))
        .map(getPackageName)
        .filter(Boolean)
    ),
  ];

  return {
    count: packageNames.length,
    names: packageNames.join(" || "),
  };
};

export const buildCityReportFields = (city, labs = [], packages = []) => {
  const cityKey = city.replace(/ /g, "_");
  const labSummary = getCityLabSummary(labs);
  const packageSummary = getCityPackageSummary(labs, packages);

  return {
    [`labCount_${cityKey}`]: labSummary.count,
    [`labNames_${cityKey}`]: labSummary.names,
    [`packageCount_${cityKey}`]: packageSummary.count,
    [`packageNames_${cityKey}`]: packageSummary.names,
  };
};
