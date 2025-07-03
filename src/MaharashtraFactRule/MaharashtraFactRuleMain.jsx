import TextField from "@mui/material/TextField";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import MaharashtraFactRule from "./MaharashtraFactRule";

const MaharashtraFactRuleMain = () => {
  const _storedData = (() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("SAVED_MAHARASHTRA_FACT_RULE_FILTERS")
        ) || {}
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  })();

  useEffect(() => {
    setCorpId(_storedData?.corpId || "");
    setCampCycleId(_storedData?.campCycleId || "");
    setFileType(_storedData?.fileType || "");
    setFitStatus(_storedData?.fitStatus || "fit");
    setStartDate(_storedData?.startDate || "");
    setEndDate(_storedData?.endDate || "");
    setEmpIdFilter(_storedData?.empIdFilter || "");
    setSignature(_storedData?.signature || "");
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // New state for user inputs
  const [corpId, setCorpId] = useState("");
  const [campCycleId, setCampCycleId] = useState("");
  const [fileType, setFileType] = useState("");
  const [fitStatus, setFitStatus] = useState("fit"); // 'fit' or 'unfit'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [signature, setSignature] = useState(""); // default signature

  const generatePDF = async (data, index) => {
    try {
      const pdfBlob = await pdf(
        <MaharashtraFactRule
          data={data}
          fitStatus={fitStatus}
          certifyingSurgeonName="Dr Jaydip Saxsena"
          signature={signature}
        />
      ).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FORM7.pdf`);

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
    if (corpId && campCycleId) {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);
      if (result && result.data) {
        console.log("Fetched Data successfully");

        const temp = result?.data;

        const length = temp.length;
        console.log({ length });
        const sorted = sortDataByName(temp);
        setList(sorted);

        console.log({ empLisy: sorted });
      } else {
        console.log("An error Occurred");
      }
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
      signature,
    };
    localStorage.setItem(
      "SAVED_MAHARASHTRA_FACT_RULE_FILTERS",
      JSON.stringify(savedFilter)
    );
  }, [
    corpId,
    campCycleId,
    fileType,
    startDate,
    endDate,
    fitStatus,
    empIdFilter,
    signature,
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
            <FormControlLabel value="Fit" control={<Radio />} label="Fit" />
            <FormControlLabel
              value="Medical Consultation Advised"
              control={<Radio />}
              label="Medical Consultation Advised"
            />
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
          </RadioGroup>
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

            <a href={item.annexureUrl}>
              <div key={index}>{item.annexureUrl}</div>
            </a>

            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <MaharashtraFactRule />
      </PDFViewer>
    </Fragment>
  );
};

export default MaharashtraFactRuleMain;
