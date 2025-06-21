import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer, BlobProvider, pdf } from "@react-pdf/renderer";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import Form32Template from "./Form32Template";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";

const Form32Generic = ({
  corpId = "b1cd1ee7-1c0d-4702-b9e8-39c3dc4a6537",
  campCycleId = "303877",
  fileType = "PHYSICAL_FITNESS_CERTIFICATE",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    try {
      console.log({ data });
      // Create a blob from the PDF
      const pdfBlob = await pdf(<Form32Template data={data} />).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FORM32.pdf`);

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
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=${campCycleId}`;
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const empIDs = [
        "SS0420",
        "92212",
        "253024",
        "72002",
        "235156",
        "52051",
        "252051",
        "102194",
        "253033",
        "SS0373",
        "92078",
        "182008",
        "182176",
        "122355",
        "92293",
        "241225",
        "32078",
        "122344",
        "992083",
        "245084",
        "42048",
        "252038",
        "182012",
        "132394",
        "122611",
        "72163",
      ];

      const temp = result?.data.filter((item) => empIDs.includes(item.empId));

      const length = temp.length;
      console.log({ length });
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
      console.log({ empLisy: sortDataByName(temp) });
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

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
      <BlobProvider document={<Form32Template data={{}} />}>
        {({ url }) => (
          <Button href={url || ""} download={"FORM35.pdf"}>
            Download PDF
          </Button>
        )}
      </BlobProvider>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <Form32Template data={{}} />
      </PDFViewer>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

            <a href={item.form32Url}>
              <div key={index}>{item.form32Url}</div>
            </a>

            <br />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Form32Generic;
