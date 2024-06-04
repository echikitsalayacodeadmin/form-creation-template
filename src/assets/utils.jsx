import Papa from "papaparse";

export function getCurrentDate(separator = "") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date}`;
}

export function getCurrentDateFormatted(separator = "") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let m = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthStr = m[month - 1];

  return `${date}${separator}${monthStr}${separator}${year}`;
}

export function getDelay(time) {
  let str = "";

  if (time !== null && typeof time !== "undefined") {
    let delay = 0;
    let newDate_current = new Date();
    let hour_current = newDate_current.getHours();
    let minutes_current = newDate_current.getMinutes();

    let d = time.split(":");
    let d1 = d[1].split(" ");

    let th = parseInt(d[0]);
    let tm = parseInt(d1[0]);
    let tp = d1[1];

    if (tp === "PM") {
      th = th + 12;
    }

    delay = (hour_current - th) * 60 + (minutes_current - tm);

    if (delay < 0) {
      delay = (th - hour_current) * 60 + (tm - minutes_current);
      const h = Math.floor(delay / 60);
      const m = delay % 60;
      str = h + "h " + m + "m to start";
    } else {
      delay = (hour_current - th) * 60 + (minutes_current - tm);
      const h = Math.floor(delay / 60);
      const m = delay % 60;
      str = h + "h " + m + "m overdue";
    }
  }

  return str;
}

export const getFormattedDayAndDate = (date) => {
  const d = new Date(date).toUTCString().split(" ");
  const nd = d[0] + " " + d[1] + " " + d[2] + " " + d[3];
  return nd;
};

export const getFormattedDDMonthYYYY = (date) => {
  const d = new Date(date).toUTCString().split(" ");
  const nd = d[1] + " " + d[2] + " " + d[3];
  return nd;
};

export const filterUniqueEmployeesByEmpId = (array) => {
  return (
    array?.filter(
      (employee, index, self) =>
        employee?.empId !== null &&
        employee?.empId !== "" &&
        self.findIndex((e) => e?.empId === employee?.empId) === index
    ) || []
  );
};

export const formatColumnName = (columnName) => {
  return columnName?.replace(/([A-Z])/g, " $1")?.toUpperCase();
};

export const getFileType = (url) => {
  const extension = url?.split(".")?.pop()?.toLowerCase();
  console.log({ extension });
  if (extension === "pdf") {
    return "pdf";
  } else if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "gif"
  ) {
    return "image";
  }
  return "";
};

export const sortDataByDateTime = (data) => {
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });

  return sortedData;
};

export const sortDataByName = (data) => {
  const dataCopy = [...data];
  const sortedData = dataCopy?.sort((a, b) => {
    const nameA = a.name?.toUpperCase();
    const nameB = b.name?.toUpperCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return sortedData;
};

export const sortArrayBySno = (dataArray) => {
  const dataCopy = [...dataArray];
  const sortedData = dataCopy.sort((a, b) => a.sno - b.sno);
  return sortedData;
};

export const downloadCsv = (jsonData, csvname) => {
  const csv = Papa.unparse(jsonData);
  const csvData = new Blob([csv], { type: "text/csv" });
  const csvUrl = window.URL.createObjectURL(csvData);
  const hiddenElement = document.createElement("a");
  hiddenElement.href = csvUrl;
  hiddenElement.target = "_blank";
  hiddenElement.download = csvname;
  hiddenElement.click();
};

export const showNumber = (val) => {
  return val ? val : val === 0 ? 0 : "na";
};

export const getUniqueArrayFromFields = (data, fieldName) => {
  if (!data || data?.length === 0) {
    console.log({ Error: "Undefined Data" });
    return [];
  }
  const fieldExists = data?.some((item) => item.hasOwnProperty(fieldName));
  if (!fieldExists) {
    console.log({ Error: `Field "${fieldName}" does not exist in the data` });
    return [];
  }
  const uniqueValues = data
    ?.filter((obj) => obj[fieldName] !== null) // Filter out objects with null values for the specified field
    ?.map((obj) => obj[fieldName]) // Extract the field values
    ?.filter((value, index, self) => self.indexOf(value) === index); // Filter out duplicate field values
  return uniqueValues;
};

export const getColumnWidth = (key) => {
  const width =
    key === "isActive"
      ? 80
      : key === "id" || key === "corpId"
      ? 340
      : key === "empId"
      ? 120
      : key === "empName" || key === "nameInReport"
      ? 300
      : key === "matching"
      ? 200
      : key === "genderInReport" || key === "genderInDB"
      ? 150
      : key === "ageInReport" || key === "empIdInReport"
      ? 150
      : key === "tokenNumberInReport"
      ? 250
      : key === "fileName"
      ? 580
      : key === "fileUrl"
      ? 630
      : key === "uploaded"
      ? 100
      : key === "alreayUploaded"
      ? 160
      : key === "alreadyUploadedUrl"
      ? 200
      : key === "interpretation"
      ? 170
      : key === "date"
      ? 130
      : key === "orgReportProcessingField"
      ? 250
      : key === "orgReportProcessingField" ||
        key === "orgEmployeeFileType" ||
        key === "orgReportUploadStatus"
      ? 250
      : 170;

  return width;
};

export const sortArrayByDateTime = (arr) => {
  return arr.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeB - dateTimeA;
  });
};

export const stringToObject = (str) => {
  return str?.split(", ")?.reduce((acc, pair) => {
    const [key, value] = pair.split(": ");
    acc[key] = value === "True";
    return acc;
  }, {});
};
