import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import UnocareLogo from "../assets/images/logounocare.png";
import TajLogo from "../assets/images/taj.png";

const UshaKiranPalace = ({
  corpId = "3bedab33-5c0d-4fff-8e3e-30d8d81a0f07",
  fileType = "CONSOLIDATED_REPORT",
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
        height: 1090px;
        width: 96%;
        border: 1px solid #000;
        padding-block: 10px;
        padding-inline: 10px;margin-top:5px;margin-left:4px
      "
    >
      <div style="display:flex; justify-content:space-between;align-items:center;padding-horizontal:1px">
      <div style="text-align: left">
 <img
          alt="logo"
          width="154"
          height="60"
          src=${UnocareLogo}
          />
    </div>  
     
  
      <div style="text-align: right">
        <img
          alt="logo"
          width="200"
          height="140"
          src=${TajLogo}
        />
      
      </div>   </div>

      <div style="text-align: center">
        <h2 style="text-decoration: underline; text-align: center">
          REPORT OF MEDICAL EXAMINATION
        </h2>
      </div>
      <div>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 80%">
            Name: ${data?.name || ""} 
            <span style="text-decoration: underline; white-space: pre">  </span
          ></span>
          <span style="width: 20%"
            >Age: ${data?.age || ""} 
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
            Height: ${data?.height || ""} 
            <span style="text-decoration: underline; white-space: pre"> </span
            >cm</span
          >
          <span style="width: 50%">
            Weight: ${data?.weight || ""} 
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
            >Eye Test (Color Blindness): NAD(No Abnormality Detected)<span
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
            >Sugar: ${data?.sugar || ""}
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 12.5%"
            >Micro:
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Vision: ${
              data?.farRightEyeSight || data?.farLeftEyeSight
                ? `FAR ( ${
                    data?.farRightEyeSight ? "R-" + data?.farRightEyeSight : ""
                  }  ${
                    data?.farLeftEyeSight ? "L-" + data?.farLeftEyeSight : ""
                  })`
                : ""
            } ${
      data?.nearRightEyeSight || data?.nearLeftEyeSight
        ? `NEAR ( ${
            data?.nearRightEyeSight ? "R-" + data?.nearRightEyeSight : ""
          }  ${data?.nearLeftEyeSight ? "L-" + data?.nearLeftEyeSight : ""})`
        : ""
    }
            
            <span style="text-decoration: underline; white-space: pre">
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
            >Blood Group: ${data?.bloodGroup || ""} 
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 50%"
            >Blood Pressure: ${data?.bp || ""} <span
              style="text-decoration: underline; white-space: pre"
            >
            </span
          ></span>
          <span style="width: 25%"
            >HB: ${data?.cholestrolData?.HB || ""}
            <span style="text-decoration: underline; white-space: pre"> </span
          ></span>
          <span style="width: 25%"
            >VDRL: ${data?.cholestrolData?.VDRL || ""}
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
          X-Ray Chest (PA): NAD(No Abnormality Detected)
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
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
            <a href={item.consolidatedReportUrl}>
              <div key={index}>{item.consolidatedReportUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UshaKiranPalace;
