import React, { Fragment, useState, useEffect, useMemo } from "react";
import { PDFViewer, BlobProvider, pdf } from "@react-pdf/renderer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import Form32Template from "./Form32Template";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { Grid } from "@mui/material";
import { RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";

const Form32Generic = () => {
  const _storedData = (() => {
    try {
      return JSON.parse(localStorage.getItem("SAVED_FORM32_FILTERS")) || {};
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  })();

  useEffect(() => {
    setCorpId(_storedData?.corpId || "b1cd1ee7-1c0d-4702-b9e8-39c3dc4a6537");
    setCampCycleId(_storedData?.campCycleId || "303877");
    setFileType(_storedData?.fileType || "PHYSICAL_FITNESS_FORM");
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

  // New state for user inputs
  const [corpId, setCorpId] = useState("b1cd1ee7-1c0d-4702-b9e8-39c3dc4a6537");
  const [campCycleId, setCampCycleId] = useState("303877");
  const [fileType, setFileType] = useState("PHYSICAL_FITNESS_FORM");
  const [fitStatus, setFitStatus] = useState("fit"); // 'fit' or 'unfit'
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
        <Form32Template data={data} fitText={fitText} />
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

      // const empIDs = [
      //   "SS0420",
      //   "92212",
      //   "253024",
      //   "72002",
      //   "235156",
      //   "52051",
      //   "252051",
      //   "102194",
      //   "253033",
      //   "SS0373",
      //   "92078",
      //   "182008",
      //   "182176",
      //   "122355",
      //   "92293",
      //   "241225",
      //   "32078",
      //   "122344",
      //   "992083",
      //   "245084",
      //   "42048",
      //   "252038",
      //   "182012",
      //   "132394",
      //   "122611",
      //   "72163",
      // ];

      const temp = result?.data;
      // .filter((item) => empIDs.includes(item.empId));

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
      corpId,
      campCycleId,
      fileType,
      startDate,
      endDate,
      fitStatus,
      empIdFilter,
    };
    localStorage.setItem("SAVED_FORM32_FILTERS", JSON.stringify(savedFilter));
  }, [
    corpId,
    campCycleId,
    fileType,
    startDate,
    endDate,
    fitStatus,
    empIdFilter,
  ]);

  return (
    <Fragment>
      {/* User Inputs */}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Corp ID"
            value={corpId}
            onChange={(e) => setCorpId(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={1}>
          <TextField
            label="Camp Cycle ID"
            value={campCycleId}
            onChange={(e) => setCampCycleId(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="File Type"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
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
      </Grid>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {filteredList.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
            <a href={item.physicalFitnessFormUrl}>
              <div key={index}>{item.physicalFitnessFormUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
      {/* <BlobProvider
        document={
          <Form32Template
            data={{}}
            fitText={
              fitStatus === "fit"
                ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
                : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation."
            }
          />
        }
      >
        {({ url }) => (
          <Button href={url || ""} download={"FORM35.pdf"}>
            Download PDF
          </Button>
        )}
      </BlobProvider> */}
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <Form32Template
          data={{}}
          fitText={
            fitStatus === "fit"
              ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
              : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation."
          }
        />
      </PDFViewer>
    </Fragment>
  );
};

export default Form32Generic;
