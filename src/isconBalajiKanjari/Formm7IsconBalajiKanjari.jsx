import html2pdf from "html2pdf.js";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { rohitSolankiAsset } from "./assets";

const Formm7IsconBalajiKanjari = ({
  corpId = "49208ee2-38cd-470b-93c1-b450e26ea7b4",
  campCycleId = "299923",
  fileType = "FORM_35",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const fitForDrivingCheckboxes =
      data?.farLeftEyeSightWithGlasses || data?.nearLeftEyeSightWithGlasses
        ? `
    <label><input type="checkbox" checked /> Fit for driving</label><br />
    <label><input type="checkbox" checked /> Fit with corrective lenses</label><br />
    <label><input type="checkbox" /> Temporarily unfit — Re-examination advised on:</label>
  `
        : `
    <label><input type="checkbox" checked /> Fit for driving</label><br />
    <label><input type="checkbox" /> Fit with corrective lenses</label><br />
    <label><input type="checkbox" /> Temporarily unfit — Re-examination advised on:</label>
  `;

    const doctorSignature = `
  <td>
    ${true ? `<img src="${rohitSolankiAsset}" style="height: 100px" />` : ""}
  </td>
`;

    const FITNESS_CERTIFICATE = `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form 7 - Record of Eye Examination</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        padding-inline: 20px;
        border-radius: 10px;
        max-width: 900px;
      }
      h2 {
        color: #003366;
        border-bottom: 2px solid #003366;
      }
      h3 {
        color: #003366;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        border: 1px solid #333;
        padding: 5px;
        text-align: left;
        font-size: 14px;
      }
      th {
        background-color: #f4f4f9;
        font-weight: bold;
      }
      .checkbox {
        margin-bottom: 5px;
      }
      .line {
        display: inline-block;
        width: 100%;
        border-bottom: 1px solid #333;
        margin-bottom: 5px;
        height: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h3>Form 7 – Record of Eye Examination</h3>
      <div class="line" style="height: 2px"></div>
      <p>(As per Rule 68T of Gujarat Factories Rules, 1963)</p>

      <h3>Worker Details</h3>
      <table>
        <tr>
          <th style="width: 25%">Name of Worker</th>
          <th style="width: 25%">${data?.name || ""}</th>
          <th style="width: 25%">Father's/Husband’s Name</th>
          <th style="width: 25%">${data?.fathersName || ""}</th>
        </tr>

        <tr>
          <th style="width: 25%">Age</th>
          <th style="width: 25%">${data?.age || ""}</th>
          <th style="width: 25%">Sex</th>
          <th style="width: 25%">${data?.gender || ""}</th>
        </tr>

        <tr>
          <th style="width: 25%">Occupation/Department</th>
          <th style="width: 25%">${data?.department || ""}</th>
          <th style="width: 25%">Date of Joining</th>
          <th style="width: 25%"></th>
        </tr>

        <tr>
          <th style="width: 25%">Date of Examination</th>
          <th colspan="3">${
            data?.cholestrolData?.["BLOOD_SAMPLE_REPORTED_DATE"] || ""
          }</th>
        </tr>
      </table>

      <h3>1. Visual Acuity Test</h3>
      <table>
        <tr>
          <th>Eye</th>
          <th>Distant Vision (Without Glasses)</th>
          <th>Near Vision (Without Glasses)</th>
          <th>Distant Vision (With Glasses)</th>
          <th>Near Vision (With Glasses)</th>
        </tr>
        <tr>
          <td>Right</td>
          <td>${data?.farRightEyeSight || ""}</td>
          <td>${data?.nearRightEyeSight || ""}</td>
          <td>${data?.farRightEyeSightWithGlasses || ""}</td>
          <td>${data?.nearRightEyeSightWithGlasses || ""}</td>
        </tr>
        <tr>
          <td>Left</td>
          <td>${data?.farLeftEyeSight || ""}</td>
          <td>${data?.nearLeftEyeSight || ""}</td>
          <td>${data?.farLeftEyeSightWithGlasses || ""}</td>
          <td>${data?.nearLeftEyeSightWithGlasses || ""}</td>
        </tr>
      </table>

      <h3>2. Color Vision Test</h3>
      <div class="checkbox">
        <label><input type="checkbox" checked /> Normal</label>
        <label><input type="checkbox" /> Defective</label>
      </div>
      <label>Remarks: </label>
      <div class="line"></div>

      <h3>3. Any Abnormality Detected</h3>
      <label>NAD</label>
      <div class="line"></div>

      <h3>4. Use of Corrective Lenses (if applicable)</h3>
      <div class="checkbox">
        <label><input type="checkbox" /> Yes</label>
        <label><input type="checkbox" /> No</label>
      </div>

      <h3>5. Opinion of Examining Doctor</h3>
      <div class="checkbox">
${fitForDrivingCheckboxes}
      </div>

      <h3>Doctor's Details</h3>
      <table>
        <tr>
          <td style="width: 50%">Name : Rohit Solanki</td>
      ${doctorSignature}
    </tr>
        </tr>
      </table>
    </div>
  </body>
</html>

      `;

    const pdfBlob = await html2pdf()
      .from(FITNESS_CERTIFICATE)
      .output("blob")
      .then((data) => {
        return data;
      });

    // const url1 = URL.createObjectURL(pdfBlob);
    // window.open(url1, "_blank");

    const formData = new FormData();
    //formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);
    formData.append("file", pdfBlob, `${data.empId}_Form7.pdf`);

    const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
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
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=${campCycleId}`;
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const temp = result?.data.filter((item) => item.vitalsCreatedDate);

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
    <div>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
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

export default Formm7IsconBalajiKanjari;
