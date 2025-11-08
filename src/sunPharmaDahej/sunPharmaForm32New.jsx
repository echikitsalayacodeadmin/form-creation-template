import html2pdf from "html2pdf.js";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
// import { KUNALSIGNBASE64 } from "../assets/images/base64Images";
import { JAY_DIP_SIGNBASE64 } from "../assets/images/base64Images";

const SunpharmaForm32New = ({
  corpId = "4102a5bd-77d8-42f3-b2cd-a4101cde2366",
  campCycleId = "349428",
  fileType = "PHYSICAL_FITNESS_CERTIFICATE",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const FITNESS_CERTIFICATE = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form No. 32 - Health Register</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
      }
      .container {
        background-color: #ffffff;
        padding-inline: 20px;
        border-radius: 10px;
        max-width: 900px;
      }
      h1 {
        text-align: center;
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }
      p {
        text-align: center;
        color: #555555;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      td {
        border: 1px solid #cccccc;
        padding-block: 8px;
        padding-inline: 10px;
        font-size: 14px;
      }
      .header {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .note {
        color: #777777;
        font-size: 14px;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>FORM NO. 32</h1>
      <p>(Prescribed under Rule 68-T and 102)</p>
      <h2 style="text-align: center">Health Register</h2>
      <table>
        <tr class="header">
          <td style="width: 50%">
            Serial Number in the Register of adult Workers
          </td>
          <td>${data?.empId || ""}</td>
        </tr>
        <tr>
          <td style="width: 50%">Name of Worker</td>
          <td style="text-transform: capitalize">${data?.name || ""}</td>
        </tr>
        <tr>
          <td style="width: 50%">Sex</td>
          <td style="text-transform: capitalize">
            ${data?.gender?.toLowerCase() || ""}
          </td>
        </tr>
        <tr>
          <td style="width: 50%">Date of birth</td>
          <td>${data?.dateOfBirth || ""}</td>
        </tr>
        <tr>
          <td style="width: 50%">Department Works</td>
          <td>${data?.department || ""}</td>
        </tr>
        <tr>
          <td style="width: 50%">Name of Hazardous process</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Dangerous process/operation</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Nature of job or occupation</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">
            Raw materials, products or By-products likely to be exposed
          </td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Date of posting</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Date of leaving/transfer to or transfer</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Reasons for Discharge/leaving or transfer</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; font-weight: bold">
            Medical examination Results therefore
          </td>
        </tr>
        <tr>
          <td style="width: 50%">Date</td>
          <td>${data?.vitalsCreatedDate || ""}</td>
        </tr>
        <tr>
          <td style="width: 50%">
            Signs and symptoms observed during examination
          </td>
          <td>NAD</td>
        </tr>
        <tr>
          <td style="width: 50%">Nature of tests</td>
          <td>Annual Health Checkup</td>
        </tr>
        <tr>
          <td style="width: 50%">Result Fit/Unfit</td>
          <td>Unfit</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; font-weight: bold">
            If declared unfit for work
          </td>
        </tr>
        <tr>
          <td style="width: 50%">
            Period of temporary Withdrawal from that work
          </td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Reasons for such withdrawal</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Date of declaring him Unfit for that work</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 50%">Date of issuing fitness Certificate</td>
          <td>${data?.vitalsCreatedDate || ""}</td>
        </tr>
        <tr style="height: 120px">
          <td style="width: 50%">
            Signature with date of the factory Medical Officer/ the Certifying
            Surgeon.
          </td>
          <td>
            ${
              true
                ? `<img src="${JAY_DIP_SIGNBASE64}" style="height: 100px" />`
                : ""
            }
          </td>
        </tr>
      </table>
      <div style="font-size: 14px">
        Note: <br />1. Separate page should be maintained for individual
        worker.<br />2. Fresh entry should be made for each examination.
      </div>
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
    formData.append("file", pdfBlob, `${data.empId}_Form32.pdf`);

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

      const empIDS = [
        "395978",
        "Oct-17",
        "60023631",
        "85037",
        "365176",
        "51841",
        "393230",
        "85631",
        "389693",
        "Oct-16",
        "60015624",
        "60016579",
        "52472",
        "Oct-18",
        "Oct-15",
        "60015602",
        "364421",
        "60031163",
        "82239",
        "56791",
        "ENP3",
        "53894",
        "49854",
        "60032266",
        "60031950",
        "60029758",
        "60022261",
        "56796",
        "60015111",
        "Oct-27",
        "372364",
        "63193",
        "55316",
        "400655",
        "52439",
        "60031334",
        "60031644",
        "60025241",
        "8435",
        "Oct-25",
        "60021182",
        "Oct-20",
        "Oct-22",
        "60025457",
        "Oct-26",
        "60033003",
        "GC3",
        "60032317",
        "60022402",
        "Oct-05",
        "372226",
        "397791",
        "60015496",
        "53834",
        "Oct-28",
        "371783",
        "397644",
        "64116",
        "388951",
      ];

      const temp = result?.data.filter(
        (item) =>
          (item.vitalsCreatedDate === "2025-10-29" ||
            item.vitalsCreatedDate === "2025-10-30" ||
            item.vitalsCreatedDate === "2025-10-31") &&
          empIDS.includes(item.empId)
      );

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

            <a href={item.form32Url}>
              <div key={index}>{item.form32Url}</div>
            </a>

            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SunpharmaForm32New;
