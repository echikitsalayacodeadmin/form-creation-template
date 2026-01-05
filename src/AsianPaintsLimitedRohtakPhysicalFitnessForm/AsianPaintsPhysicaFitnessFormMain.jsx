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
import AsianPaintsPhysicaFitnessFormTemplate from "./AsianPaintsPhysicaFitnessFormTemplate";

const AsianPaintsPhysicaFitnessFormMain = ({
  corpId = "7166ef04-e16f-4ae9-bda8-a7ee6d6833fa",
  campCycleId = "364055",
  fileType = "PHYSICAL_FITNESS_FORM",
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

  const generatePDF = async (data, index) => {
    try {
      console.log({ data });
      // Pass fixed fitText based on fitStatus
      const fitText =
        fitStatus === "fit"
          ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
          : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation.";
      const pdfBlob = await pdf(
        <AsianPaintsPhysicaFitnessFormTemplate
          data={data}
          fitText={fitText}
          company="Asian Paints Limited- Rohtak"
        />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${data?.empId}_PhysicalFitnessForm.pdf`
      );

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

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
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
      enqueueSnackbar("Error generating/uploading PDF", {
        variant: "error",
      });
    }
  };

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      // const h = ["132064"];

      const temp = result?.data?.filter(
        (item) => ["403050"]?.includes(item?.empId)
        // item?.vitalsCreatedDate === "2025-12-19" ||
        // item?.vitalsCreatedDate === "2025-12-20" ||
        // item?.vitalsCreatedDate === "2025-12-22" ||
        // item?.vitalsCreatedDate === "2025-12-23"
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
    };
    localStorage.setItem("SAVED_FORM32_FILTERS", JSON.stringify(savedFilter));
  }, [startDate, endDate, fitStatus, empIdFilter]);

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
      <h1>AsianPaintsPhysicaFitnessFormMain</h1>
      {/* User Inputs */}

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
            <div
              key={index}
            >{`${index}- ${item.empId} ${item.name} ${item.bloodGroup}`}</div>
            <a href={item.physicalFitnessFormUrl}>
              <div key={index}>{item.physicalFitnessFormUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <AsianPaintsPhysicaFitnessFormTemplate
          data={filteredList[0]}
          fitText={
            fitStatus === "fit"
              ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
              : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation."
          }
          company="Asian Paints Limited- Rohtak"
        />
      </PDFViewer>
    </Fragment>
  );
};

export default AsianPaintsPhysicaFitnessFormMain;
