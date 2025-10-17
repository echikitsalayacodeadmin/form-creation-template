import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import BirlaOpusMerFormTemplate from "./BirlaOpusMerFormTemplate";

const BirlaOpusMERForm = ({
  corpId = "6907ae2b-4d8f-49ce-b8a9-0c36cdac34f3",
  campCycleId = "330002",
  fileType = "ANNEXURE",
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorEmpCount, setErrorEmpCount] = useState(0);
  const [errorEmpIDs, setErrorEmpIDs] = useState([]);

  const generatePDF = async (data, index) => {
    try {
      const pdfBlob = await pdf(
        <BirlaOpusMerFormTemplate data={data} />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${data?.empId}_MEDICAL_EXAMINATION_REPORT.pdf`
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
        setErrorEmpCount((prevCount) => prevCount + 1);
        setErrorEmpIDs((prev) => [...prev, data?.empId]);
      }
      // const url = URL.createObjectURL(pdfBlob);
      // window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
      enqueueSnackbar("Error generating/uploading PDF", {
        variant: "error",
      });
      setErrorEmpCount((prevCount) => prevCount + 1);
      setErrorEmpIDs((prev) => [...prev, data?.empId]);
    }
  };

  const fetchListOfEmployees = async () => {
    if (corpId && campCycleId) {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);
      if (result && result.data) {
        const empIds = ["408972"];
        const temp = result.data.filter((item) => empIds.includes(item.empId));
        // const temp = result.data.filter(
        //   (item) =>
        //     item.vitalsCreatedDate === "2025-09-29" &&
        //     item.imageUrl?.endsWith("image.jpg")
        // );

        // const temp = result.data.filter((item) => emps?.includes(item?.empId));
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
      enqueueSnackbar("Successfully Deleted PDF!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };

  return (
    <Fragment>
      <div>
        <button onClick={handleGeneratePDFs}>
          Start Generating Medical Reports
        </button>{" "}
        <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        <div>Error Files: {errorEmpCount}</div> <br />
        <div>
          Error EmpID: {errorEmpIDs?.map((item) => item).join(",")}
        </div>{" "}
        <br />
        {list.map((item, index) => (
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
        <BirlaOpusMerFormTemplate data={list[0]} />
      </PDFViewer>
    </Fragment>
  );
};

export default BirlaOpusMERForm;
