import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import ForceMotorsPuneVertigoFormTemplate from "./ForceMotorsPuneVertigoFormTemplate";

const ForceMotorsPuneVertigoFormMain = ({
  corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
  campCycleId = "410816",
  fileType = "PHYSICAL_FITNESS",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorEmpCount, setErrorEmpCount] = useState(0);
  const [errorEmpIDs, setErrorEmpIDs] = useState([]);

  const generatePDF = async (data) => {
    try {
      const pdfBlob = await pdf(
        <ForceMotorsPuneVertigoFormTemplate data={data} />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${data?.empId}_VERTIGO_FORM.pdf`
      );

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully uploaded Vertigo form PDF!", {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
        setErrorEmpCount((prev) => prev + 1);
        setErrorEmpIDs((prev) => [...prev, data?.empId]);
      }

      // const previewUrl = URL.createObjectURL(pdfBlob);
      // window.open(previewUrl, "_blank");
    } catch (error) {
      console.error("Error generating/uploading Vertigo form PDF:", error);
      enqueueSnackbar("Error generating/uploading Vertigo form PDF!", {
        variant: "error",
      });
      setErrorEmpCount((prev) => prev + 1);
      setErrorEmpIDs((prev) => [...prev, data?.empId]);
    }
  };

  const fetchListOfEmployees = async () => {
    if (!corpId || !campCycleId) return;

    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result && result.data) {
      const temp = result.data.filter((item) => item?.name);
      const sorted = sortDataByName(temp);
      setList(sorted);
      setTotalEmployees(sorted.length);
    } else {
      enqueueSnackbar("Error fetching employee list", { variant: "error" });
      setList([]);
      setTotalEmployees(0);
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully deleted PDF!", { variant: "success" });
    } else {
      enqueueSnackbar("An error occurred!", { variant: "error" });
    }
  };

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  const previewData = list[0] || {
    name: "Sample Employee",
    empId: "12345",
    age: "35",
    gender: "MALE",
    department: "Production",
    bp: "120/80",
    pulseRate: "72",
    vitalsCreatedDate: "2026-05-29",
    companyName: "FORCE MOTORS LTD - PUNE PLANT",
  };

  return (
    <Fragment>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        <div>Error Files: {errorEmpCount}</div> <br />
        <div>Error EmpID: {errorEmpIDs.join(", ")}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: 12 }}>
            <div>{`${index}- ${item.empId} ${item.name}`}</div>
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <ForceMotorsPuneVertigoFormTemplate data={previewData} />
      </PDFViewer>
    </Fragment>
  );
};

export default ForceMotorsPuneVertigoFormMain;
