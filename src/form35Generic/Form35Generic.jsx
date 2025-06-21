import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer, BlobProvider, pdf } from "@react-pdf/renderer";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import Form35Template from "./Form35Template";

const Form35Generic = ({
  corpId = "55480539-461d-4077-a62f-b59b0d98e624",
  campCycleId = "300077",
  fileType = "ANNEXURE",
  companyAddress = "BIOLOGICS (API) PLANT SY. NO. 16, EKRAJAPURA, 8 KM STONE, SIDDLAGHATTA ROAD, HASIGALA POST,, HOSKOTE, BENGALURU-562114, KARNATAKA, INDIA",
  vitalsCreatedDate = "30th May 2025",
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
      const pdfBlob = await pdf(<Form35Template data={data} />).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FORM24.pdf`);

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

      const temp = result?.data;

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
      <BlobProvider document={<Form35Template data={{}} />}>
        {({ url }) => (
          <Button href={url || ""} download={"FORM35.pdf"}>
            Download PDF
          </Button>
        )}
      </BlobProvider>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <Form35Template data={{}} />
      </PDFViewer>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
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
    </Fragment>
  );
};

export default Form35Generic;
