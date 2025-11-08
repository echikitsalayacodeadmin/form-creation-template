import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import StridesHeader2025Template from "../stridesPhysicalFitnessForm/StridesHeader2025Template";
import unoHeader from "./unoHeader.png";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { rawData } from "./test";

export async function mergeHeaderAndXraySinglePage(data) {
  const mergedPdf = await PDFDocument.create();
  const page = mergedPdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  // Text setup
  const font = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;

  // Employee info
  const infoTop = height - 60;
  const empId = data?.empId || "N/A";
  const name = data?.name || "N/A";
  const age = data?.age || "N/A";
  const gender = data?.gender || "N/A";

  page.drawText(`Emp ID: ${empId}   Name: ${name}`, {
    x: 40,
    y: infoTop,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Age: ${age}   Gender: ${gender}`, {
    x: 40,
    y: infoTop - 18,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Fetch X-ray image
  if (data?.xrayFilmUrl) {
    try {
      const xrayUrl = data.xrayFilmUrl;
      const imgBytes = await fetch(xrayUrl).then((res) => res.arrayBuffer());
      const lowerUrl = xrayUrl.toLowerCase();

      const xrayImg = lowerUrl.endsWith(".png")
        ? await mergedPdf.embedPng(imgBytes)
        : await mergedPdf.embedJpg(imgBytes);

      // Calculate space below info
      const topMargin = infoTop - 40; // leave small gap below text
      const bottomMargin = 170;
      const availableHeight = topMargin - bottomMargin;

      let imgWidth = width - 60; // left/right margin
      let imgHeight = (xrayImg.height / xrayImg.width) * imgWidth;

      // If too tall, fit within availableHeight
      if (imgHeight > availableHeight) {
        const scale = availableHeight / imgHeight;
        imgHeight *= scale;
        imgWidth *= scale;
      }

      // Position image flush below the text
      const imgX = (width - imgWidth) / 2;
      const imgY = bottomMargin;

      page.drawImage(xrayImg, {
        x: imgX,
        y: imgY,
        width: imgWidth,
        height: imgHeight,
      });
    } catch (err) {
      console.error("Error embedding X-ray:", err);
      page.drawText("⚠️ Failed to load X-ray image", {
        x: 40,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(1, 0, 0),
      });
    }
  } else {
    page.drawText("⚠️ No X-ray image available", {
      x: 40,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(1, 0, 0),
    });
  }

  return await mergedPdf.save();
}

const XrayFilmMain = ({
  corpId = "b1821b42-807b-419e-8969-3e500d636f4b",
  campCycleId = "345079",
  fileType = "XRAY_FILM",
}) => {
  const _storedData = (() => {
    try {
      return JSON.parse(localStorage.getItem("SAVED_FORM32_FILTERS")) || {};
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  })();

  useEffect(() => {
    setFitStatus(_storedData?.fitStatus || "fit");
    setStartDate(_storedData?.startDate || "");
    setEndDate(_storedData?.endDate || "");
    setEmpIdFilter(_storedData?.empIdFilter || "");
    setSignature(_storedData?.signature || "dr_kunal_stamp_sign");
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [fitStatus, setFitStatus] = useState("fit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [signature, setSignature] = useState("dr_kunal_stamp_sign.png");

  const generatePDF = async (data, index) => {
    try {
      const mergedBytes = await mergeHeaderAndXraySinglePage(data);
      const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" });

      // STEP 4 — Upload the merged file
      const formData = new FormData();
      formData.append("file", mergedBlob, `XrayFilm_${data?.empId}.pdf`);

      // const url = URL.createObjectURL(mergedBlob);
      // window.open(url, "_blank");

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded Merged PDF!", {
          variant: "success",
        });
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        enqueueSnackbar("An error Occurred!", { variant: "error" });
      }
    } catch (error) {
      console.error("Error generating/uploading merged PDF:", error);
      enqueueSnackbar("Error generating/uploading merged PDF", {
        variant: "error",
      });
    }
  };

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      const xrayMap = rawData.reduce((acc, curr) => {
        acc[curr.empId] = curr.xrayFilmUrl;
        return acc;
      }, {});

      // Step 2: Merge it into your result.data
      const temp = result?.data?.filter(
        (item) =>
          item.xrayFilmUrl &&
          !["PEM-tk", "PEM-tk61", "PEM-tk17", "PEM-14", "PEM-tk62"].includes(
            item.empId
          )
      );

      const length = temp.length;
      console.log({ length });
      const sorted = sortDataByName(temp);
      setList(sorted);

      console.log({ empLisy: sorted });
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
    // eslint-disable-next-line
  }, [corpId, campCycleId]);

  // Filtering logic with useMemo
  const filteredList = useMemo(() => {
    let filtered = [...list];
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const date = item.vitalsCreatedDate;
        return date >= startDate && date <= endDate;
      });
    }
    if (empIdFilter.trim()) {
      const empIds = empIdFilter.split(",").map((id) => id.trim());
      filtered = filtered.filter((item) => empIds.includes(item.empId));
    }
    setTotalEmployees(filtered.length);
    return filtered;
  }, [list, startDate, endDate, empIdFilter]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < filteredList.length; i++) {
      await generatePDF(filteredList[i], i);
    }
  };
  const handleDeletePDF = async () => {
    for (let i = 0; i < filteredList.length; i++) {
      await deleteFiles(filteredList[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully Uploaded PDF!", {
        variant: "success",
      });
      setUploadedCount((prevCount) => prevCount + 1);
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const savedFilter = {
      startDate,
      endDate,
      fitStatus,
      empIdFilter,
      signature,
    };
    localStorage.setItem("SAVED_FORM32_FILTERS", JSON.stringify(savedFilter));
  }, [startDate, endDate, fitStatus, empIdFilter, signature]);

  const [bloodData, setBloodData] = useState([]);
  const [excludedTestKeys, setExcludedTestKeys] = useState("");
  const getTestDetails = async () => {
    const url = `https://apibackend.uno.care/api/org/testsconfig`;
    const result = await getData(url);
    if (result.error) {
      console.log(result.error);
    } else {
      const temp = result.data.map((item, index) => ({
        id: index,
        ...item,
        editRow: "editRow",
      }));
      setBloodData(temp);
    }
  };

  useEffect(() => {
    getTestDetails();
  }, []);

  const errorEmployeeList = useMemo(() => {
    const tempData = list.filter(
      (emp) =>
        emp.vitalsErrorData && Object.keys(emp.vitalsErrorData)?.length > 0
    );

    return tempData?.map((val) => ({
      ...val,
      vitalsErrorDataList: Object.entries(val?.vitalsErrorData),
    }));
  }, [list]);

  const transformedData = useMemo(() => {
    const stringValuesUrine =
      bloodData.find((test) => test.testKey === "URINE.GLUCOSE")
        ?.stringTestKeyValues || [];
    const stringValuesHbsag =
      bloodData.find((test) => test.testKey === "HbsAg")?.stringTestKeyValues
        ?.UNHEALTHY_VALUES || [];
    const urineGlucoseEmployees = errorEmployeeList
      .filter(
        (item) =>
          stringValuesUrine?.["UNHEALTHY_VALUES"]?.includes[
            item.cholestrolData?.["URINE.GLUCOSE"]
          ]
      )
      .map((item) => ({
        empId: item.empId,
        name: item.name,
        age: item.age,
        gender: item.gender,
        vitalsCreatedDate: item.vitalsCreatedDate,
        token: item.tokenNumber, // Assuming you'll fill this in later
        vitalsDataError: `URINE.GLUCOSE : ${item.cholestrolData?.["URINE.GLUCOSE"]}`, // Displaying each key separately
        acceptableRange: "",
        vitalsDataReading: item.cholestrolData?.["URINE.GLUCOSE"],
        testKey: key,
      }));

    const hbsagEmployees = errorEmployeeList
      .filter((item) =>
        stringValuesHbsag?.["UNHEALTHY_VALUES"]?.includes(
          item.cholestrolData?.["HbsAg"]
        )
      )
      .map((item) => ({
        empId: item.empId,
        name: item.name,
        age: item.age,
        gender: item.gender,
        vitalsCreatedDate: item.vitalsCreatedDate,
        token: item.tokenNumber, // Assuming you'll fill this in later
        vitalsDataError: `HbsAg : ${item.cholestrolData?.["HbsAg"]}`, // Displaying each key separately
        acceptableRange: "",
        vitalsDataReading: employee.vitalsErrorData[key],
        testKey: key,
      }));

    const transformed = errorEmployeeList.flatMap((employee) => {
      const keys = Object.keys(employee.vitalsErrorData);
      return keys.map((key) => {
        const range = bloodData.find((range) => range.testKey === key);
        const acceptableRange = range
          ? `${range.acceptableRangeMin} - ${range.acceptableRangeMax}`
          : "Not available";
        return {
          empId: employee.empId,
          name: employee.name,
          vitalsDataError: `${key} : ${employee.vitalsErrorData[key]}`, // Displaying each key separately
          acceptableRange,
          vitalsDataReading: employee.vitalsErrorData[key],
          testKey: key,
          testKeyType: range?.orgEmployeeFileType,
        };
      });
    });

    let tempData = [...transformed, ...urineGlucoseEmployees, ...hbsagEmployees]
      .filter(
        (item) =>
          ![
            "height",
            "weight",
            // "bp",
            // "lowBp",
            // "highBp",
            "IS_HEIGHT_MATCH_PFT_VITALS",
            "IS_WEIGHT_MATCH_PFT_VITALS",
          ]?.includes(item.testKey)
      )
      .reduce((acc, item) => {
        if (!acc[item.testKey]) {
          acc[item.testKey] = [];
        }
        acc[item.testKey].push(item);
        return acc;
      }, {});

    return Object.entries(tempData).filter(
      ([key, value]) => !excludedTestKeys.split(",").includes(key)
    );
  }, [errorEmployeeList, bloodData, excludedTestKeys]);

  return (
    <Fragment>
      {/* User Inputs */}
      <h2>Strides XRAY Report</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} md={1.5}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormLabel component="legend">Status</FormLabel>
          <RadioGroup
            row
            value={fitStatus}
            onChange={(e) => setFitStatus(e.target.value)}
            name="fit-status-group"
          >
            <FormControlLabel value="fit" control={<Radio />} label="Fit" />
            <FormControlLabel value="unfit" control={<Radio />} label="Unfit" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="EmpIDs (comma separated)"
            value={empIdFilter}
            onChange={(e) => setEmpIdFilter(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormLabel component="legend">Signature</FormLabel>
          <RadioGroup
            row
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            name="signature-group"
          >
            <FormControlLabel
              value="dr_kunal_stamp_sign.png"
              control={<Radio />}
              label="Dr Kunal"
            />
            <FormControlLabel
              value="Dr_Jaydip_Saxena.png"
              control={<Radio />}
              label="Dr Jaydip"
            />
            <FormControlLabel
              value="prashantDeshmukh.png"
              control={<Radio />}
              label="Prashant Deshmukh"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={12} sx={{ maxWidth: 800, flexWrap: "wrap" }}>
          <Typography>UNFIT EMPIDS -</Typography>
          <TextField
            multiline
            fullWidth
            minRows={8}
            value={transformedData
              .flatMap(([_, records]) => records)
              .map((item, index) => ({ ...item, id: index }))
              .map((item) => item.empId)
              .join(",")}
          />
        </Grid>
      </Grid>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {filteredList.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
            <a href={item.xrayFilmUrl}>
              <div key={index}>{item.xrayFilmUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <StridesHeader2025Template data={list[0]} />
      </PDFViewer>
    </Fragment>
  );
};

export default XrayFilmMain;
