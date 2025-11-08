import PraveenMasaleFormTemplate from "./PraveenMasaleFormTemplate";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

const PraveelMasaleForm = ({
  // corpId = "e9d2386b-1cd9-438d-98d8-9c16dce8e6e4", //unit 1
  // campCycleId = "339720", // unit 1
  corpId = "eb17683c-0759-4e49-851e-43a24301a6eb", // unit 2 pune
  campCycleId = "347481", // unit 2 pune
  fileType = "CONSOLIDATED_REPORT",
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const generatePDF = async (data, index) => {
    try {
      const pdfBlob = await pdf(
        <PraveenMasaleFormTemplate data={data} />
      ).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_MER_FORM.pdf`);

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
        const emps = [
          "DE0102",
          "SB1177",
          "SB1094",
          "SB1039",
          "SB1039",
          "P3202",
          "SB1025",
          // "P3082",
          // "P3198",
          // "SS004",
          // "P3191",
          // "P3187",
          // "P3032",
          // "HE0159",
          // "P3049",
          // "P3020",
          // "RB866",
          // "SB1161",
          // "P3033",
          // "P1288",
          // "P3256",
          // "P3077",
        ];
        // const temp = result?.data.filter(
        //   (item) => item.vitalsCreatedDate === "2025-10-12"
        // );
        const temp = result?.data.filter((item) => emps.includes(item?.empId));
        const length = temp.length;
        const sorted = sortDataByName(temp);
        setList(sorted);
        setTotalEmployees(length);
      } else {
        console.log("An error Occurred");
        setList([]);
        setTotalEmployees("");
      }
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i], i);
    }
  };
  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
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

  return (
    <Fragment>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div
              key={index}
            >{`${index}- ${item.empId} ${item.name} ${item?.visionRemark}`}</div>

            <a href={item.consolidatedRUrl}>
              <div key={index}>{item.consolidatedRUrl}</div>
            </a>

            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <PraveenMasaleFormTemplate data={list[0]} />
      </PDFViewer>
    </Fragment>
  );
};

export default PraveelMasaleForm;
