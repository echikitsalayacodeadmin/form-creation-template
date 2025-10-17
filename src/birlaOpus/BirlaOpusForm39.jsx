import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import BirlaOpusForm39Template from "./BirlaOpusForm39Template";

const BirlaOpusForm39 = ({
  corpId = "6907ae2b-4d8f-49ce-b8a9-0c36cdac34f3",
  campCycleId = "330002",
  fileType = "CONSOLIDATED_REPORT",
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
        <BirlaOpusForm39Template data={data} fitStatus={"fit"} />
      ).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FORM_39.pdf`);

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
        const p = [4006, 4017, 4081, 4115, 4016, 4140, 4127, 4084, 4109].map(
          (itm) => itm.toString()
        );
        const temp = result?.data.filter((item) => p.includes(item.empId));

        const existingEmpIds = result?.data.map((item) => item.empId);

        const notMatchedEmpIds = p.filter(
          (empId) => !existingEmpIds.includes(empId)
        );

        console.log(notMatchedEmpIds);

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
        <div>Error Files: {errorEmpCount}</div> <br />
        <div>
          Error EmpID: {errorEmpIDs?.map((item) => item).join(",")}
        </div>{" "}
        <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div
              key={index}
            >{`${index}- ${item.empId} ${item.name} ${item?.department}`}</div>

            <a href={item.consolidatedRUrl}>
              <div key={index}>{item.consolidatedRUrl}</div>
            </a>

            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <BirlaOpusForm39Template
          data={
            list[0] || {
              department: "",
              name: "",
              gender: "",
              age: "",
              designation: "",
              dateOfJoining: "",
              vitalsCreatedDate: "",
              colourVision: "",
              remarks: "",
            }
          }
        />
      </PDFViewer>
    </Fragment>
  );
};
export default BirlaOpusForm39;
