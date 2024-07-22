import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";

const UshaKiranPalace = ({
  corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  fileType = "BLOODTEST",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const generatePDF = async (data) => {
    const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      @page {
        size: auto; /* auto is the initial value */
        margin: 10px;
      }

      html {
        background-color: #ffffff;
      }
      .underlined-space {
        display: inline-block;
        border-bottom: 1px solid #000;
        width: 200px; /* Adjust the width as needed */
      }
    </style>
  </head>
  <body>
    <div
      style="
        height: 1060px;
        width: 97%;
        border: 1px solid #000;
        padding-block: 10px;
        padding-inline: 10px;
      "
    >
      <div style="text-align: right">
        <img
          alt="logo"
          width="154"
          height="60"
          src="data:image/png;base64,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"
        />
        <h2 style="text-decoration: underline; text-align: center">
          REPORT OF MEDICAL EXAMINATION
        </h2>
      </div>
      <div>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 80%">
            Name:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 20%"
            >Age:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>

        <p>
          Identification:
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
        <p>
          Past Medical History:<span
            style="text-decoration: underline; white-space: pre"
          >
          </span>
        </p>
        <p>
          Family History:
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%">
            Height:
            <span style="text-decoration: underline; white-space: pre"> </span
            >cm</span
          >
          <span style="width: 50%">
            Weight:
            <span style="text-decoration: underline; white-space: pre"> </span>
            kg</span
          >
        </p>
        <p style="display: flex">
          <span style="width: 40%"
            >Chest Measurement:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 30%"
            >Inspiration:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 30%"
            >Expiration:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <h2 style="text-decoration: underline; text-align: center">
          LABORATORY
        </h2>

        <!-- <div style="width: 40%">
           
            <p>Vision:</p>
          </div> -->
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Eye Test (Color Blindness):<span
              style="text-decoration: underline; white-space: pre"
            >
            </span
          ></span>
          <span style="width: 12.5%"
            >Urine:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 12.5%"
            >Albumin:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 12.5%"
            >Sugar:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 12.5%"
            >Micro:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Vision:<span style="text-decoration: underline; white-space: pre">
            </span
          ></span>
          <span style="width: 50%"
            >Stool:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Skin Examination:<span
              style="text-decoration: underline; white-space: pre"
            >
            </span
          ></span>
          <span style="width: 50%"
            >Blood Group:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Blood Pressure:<span
              style="text-decoration: underline; white-space: pre"
            >
            </span
          ></span>
          <span style="width: 25%"
            >HB:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 25%"
            >VDRL:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Heart:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 50%"
            >Hepatitis B:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Lungs:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 50%"
            >HIV 1:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Teeth:<span style="text-decoration: underline; white-space: pre">
            </span
          ></span>
          <span style="width: 50%"
            >HIV 2:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p>
          Others:<span style="text-decoration: underline; white-space: pre">
          </span>
        </p>
        <p>
          X-Ray Chest (PA):
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
        <p>
          Recommendation:
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
        <p>
          Signature of the person examined:
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Doctor’s Name:<span
              style="text-decoration: underline; white-space: pre"
            >
            </span
          ></span>
          <span style="width: 50%"
            >Signature:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p>
          Date:
          <span style="text-decoration: underline; white-space: pre"> </span>
        </p>
      </div>
    </div>
  </body>
</html>

    `;

    const pdfBlob = await html2pdf()
      .from(content)
      .output("blob")
      .then((data) => {
        return data;
      });

    const formData = new FormData();
    formData.append("file", pdfBlob, `${data.empId}_bloodTest.pdf`);

    const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=`;
    const result = await uploadFile(url, formData);
    if (result && result.data) {
      enqueueSnackbar("Successfully Uploaded PDF!", {
        variant: "success",
      });
      setUploadedCount((prevCount) => prevCount + 1);
      // const url = URL.createObjectURL(pdfBlob);
      // window.open(url, "_blank");
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      const temp = result.data;
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i]);
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
    <div>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>
              {item.empId} {item.name}
            </div>
            <a href={item.form35Url}>
              <div key={index}>{item.form35Url}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UshaKiranPalace;
