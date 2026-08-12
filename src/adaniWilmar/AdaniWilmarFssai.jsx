import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { KUNALSIGNBASE64 } from "../assets/images/base64Images";

const getExamDate = (data, campDate) => {
  if (campDate) return campDate;

  if (data?.cholestrolData?.SAMPLE_REPORTED_DATE) {
    const parsed = dayjs(
      String(data.cholestrolData.SAMPLE_REPORTED_DATE).split(" ")[0],
      "DD-MMM-YYYY"
    );
    if (parsed.isValid()) return parsed.format("DD/MM/YYYY");
  }

  if (data?.vitalsCreatedDate && dayjs(data.vitalsCreatedDate).isValid()) {
    return dayjs(data.vitalsCreatedDate).format("DD/MM/YYYY");
  }

  return "";
};

const AdaniWilmarFssai = ({
  corpId = "8d7e2719-91c5-42ea-a34d-0d06b7f53e7f",
  campCycleId = "442838",
  fileType = "FITNESS_CERTIFICATE_FOOD",
  corpName = "AWL AGRI BUSINESS LIMITED",
  campDate = "",
  year = "2026",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDF = async (data) => {
    const examDate = "18/07/2026"  //getExamDate(data, campDate);

    const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Medical Fitness Certificate</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 20px;
        color: #000;
      }
      .container {
        width: 88%;
        margin: auto;
      }
      .header {
        text-align: center;
        margin-top: 20px;
      }
      .header h5 {
        margin: 0 0 8px 0;
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.2px;
      }
      .header p {
        margin: 4px 0;
        font-size: 13px;
      }
      .content {
        margin-top: 36px;
      }
      .content p {
        font-size: 14px;
        text-align: justify;
      }
      .signature {
        margin-top: 48px;
        display: flex;
        justify-content: flex-end;
      }
      .signature-box {
        width: 48%;
        text-align: left;
      }
      .list {
        list-style-type: none;
        padding-left: 0;
        margin: 8px 0 0 0;
      }
      .list li {
        margin-bottom: 4px;
        font-size: 14px;
        line-height: 1.35;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h5>PERFORMA FOR MEDICAL FITNESS CERTIFICATE FOR FOOD HANDLERS</h5>
        <p>(FOR THE YEAR ${year})</p>
        <p>
          (See Para No. 10.1.2, Part- II, Schedule - 4 of FSS Regulation, 2011)
        </p>
      </div>

      <div class="content">
        <p>
          It is certified that Shri/Smt./Miss.
          <span style="text-decoration: underline; text-transform: capitalize;">
            ${data?.name?.toLowerCase() || ""}
          </span>
          employed with M/s.
          <strong>${corpName}</strong>, coming in direct contact with food items
          has been carefully examined* by me on date
          <span style="text-decoration: underline;">
            &nbsp;&nbsp;${examDate}&nbsp;&nbsp;
          </span>.
          Based on the medical examination conducted, he/she is found free from
          any infectious or communicable diseases and the person is fit to work
          in the above mentioned food establishment.
        </p>

        <div class="signature">
          <div class="signature-box">
            <img
              src="${KUNALSIGNBASE64}"
              alt="Doctor Signature"
              style="height: 140px; width: auto; display: block; margin-bottom: 4px;"
            />
            <p style="font-size: 13px; margin: 0; line-height: 1.3;">
              <strong>Name and Signature with Seal</strong><br />
              of Registered Medical Practitioner /<br />
              Civil Surgeon
            </p>
          </div>
        </div>

        <h4 style="margin-top: 36px; margin-bottom: 6px; font-size: 14px;">
          *Medical Examination to be conducted:
        </h4>
        <ul class="list">
          <li>1. Physical Examination : NAD</li>
          <li>2. Eye Test : NAD</li>
          <li>3. Skin Examination : NAD</li>
          <li>
            4. Compliance with schedule of Vaccine to be inoculated against
            enteric group of diseases : Good
          </li>
          <li>
            5. Any test required to confirm any communicable or infectious
            disease which the person suspected to be suffering from on clinical
            examination : Not Needed
          </li>
        </ul>
      </div>
    </div>
  </body>
</html>
    `;

    const pdfBlob = await html2pdf().from(content).output("blob");

    // const previewUrl = URL.createObjectURL(pdfBlob);
    // window.open(previewUrl, "_blank");

    const formData = new FormData();
    formData.append("file", pdfBlob, `${data.empId}_food_certificate_form.pdf`);

    const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await uploadFile(url, formData);

    if (result?.data) {
      enqueueSnackbar(`Uploaded FSSAI for ${data.empId}`, { variant: "success" });
      setUploadedCount((prev) => prev + 1);
    } else {
      enqueueSnackbar(`Upload failed for ${data.empId}`, { variant: "error" });
    }
  };

  const fetchListOfEmployees = async () => {
    const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result?.data) {
      const temp = result.data?.filter((item) => ["NIMR079004", "NIMR081618", "NIMR085265", "NIMR084508", "NIMR082674", "NIMR080972", "NIMR079868", "NIMR079531", "NIMR077166", "NIMR084791", "NIMR079355", "NIMR080719", "NIMR069120", "NIMR045767", "NIMR068518", "NIMR085436", "NIMR081031", "NIMR081700", "NIMR080587", "NIMR069840", "NIMR083933", "NIMR074911", "NIMR034146", "NIMR069460", "NIMR069331", "NIMR080255", "NIMR086094", "NIMR082673", "NIMR018466", "NIMR086011", "NIMR079435", "NIMR080588", "NIMR085222", "NIMR086095", "NIMR072256", "NIMR076870", "70119", "NIMR077960", "NIMR084285", "NIMR084152", "NIMR064217", "NIMR076825", "NIMR084946", "NIMR085551", "NIMR082365", "NIMR084590", "NIMR086010", "NIMR083423", "NIMR073013", "NIMR085553", "NIMR086091", "NIMR071230", "NIMR085556", "NIMR084511", "NIMR085868", "NIMR085557", "NIMR072576", "NIMR083425", "NIMR068325", "NIMR084052", "NIMR083157", "NIMR085869", "NIMR085438", "NIMR080534", "NIMR085620", "NIMR073766", "NIMR075010", "NIMR080301", "NIMR076822", "NIMR081477", "NIMR058680", "NIMR068067", "NIMR085086", "NIMR085871", "NIMR082622", "NIMR079993", "NIMR017929", "NIMR072162", "NIMR086096", "NIMR081639", "NIMR076309", "NIMR082897", "NIMR083643", "NIMR085221", "NIMR074952", "NIMR069851", "NIMR081624", "NIMR085946", "NIMR085266", "NIMR083127", "NIMR079996", "NIMR069121", "NIMR076873", "NIMR080779", "NIMR073774", "NIMR023884", "NIMR078317", "NIMR085223", "NIMR077959", "NIMR078314", "NIMR081303", "NIMR074946", "70017", "NIMR073512", "NIMR085267", "NIMR085995", "70118", "NIMR071730", "NIMR063208", "NIMR081304", "NIMR083940", "NIMR082972", "NIMR082219", "NIMR083934", "NIMR085786", "NIMR085870", "NIMR086097", "NIMR082624", "70121", "NIMR080586", "NIMR081352", "NIMR084290", "NIMR084287", "NIMR079129", "NIMR082675", "NIMR015358", "NIMR085685", "NIMR084422", "NIMR075012", "NIMR085947", "70037", "NIMR081379", "NIMR085996", "NIMR074912", "NIMR081162", "NIMR085019", "NIMR084789", "NIMR072577", "NIMR070689", "NIMR074922", "NIMR081478", "NIMR079387", "NIMR084292", "NIMR073698", "NIMR081482", "NIMR085948", "NIMR084641", "NIMR075901", "NIMR084288", "NIMR085554", "NIMR084289", "NIMR085787", "NIMR081011", "NIMR069209", "NIMR085866", "NIMR085788", "NIMR085864", "NIMR082019", "NIMR085865", "NIMR082623", "NIMR084286", "NIMR075107", "NIMR084291", "NIMR084581", "NIMR083435", "NIMR072142", "NIMR075011", "NIMR083504", "NIMR073344", "NIMR083158", "NIMR074943", "70043", "NIMR085431", "NIMR085867"].includes(item.empId));
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
      return;
    }

    enqueueSnackbar("Error fetching employee list", { variant: "error" });
  };

  useEffect(() => {
    fetchListOfEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpId, campCycleId]);

  const handleGeneratePDFs = async () => {
    if (!list.length) {
      enqueueSnackbar("No employees found.", { variant: "warning" });
      return;
    }

    setIsProcessing(true);
    setUploadedCount(0);

    for (let i = 0; i < list.length; i += 1) {
      await generatePDF(list[i]);
    }

    setIsProcessing(false);
  };

  const deleteFiles = async (data) => {
    const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);

    if (result?.data) {
      enqueueSnackbar(`Deleted ${data.empId}`, { variant: "success" });
    } else {
      enqueueSnackbar(`Delete failed for ${data.empId}`, { variant: "error" });
    }
  };

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i += 1) {
      await deleteFiles(list[i]);
    }
  };

  return (
    <div>
      <h3>Adani Wilmar FSSAI Medical Fitness Certificate</h3>
      <div>corpId: {corpId}</div>
      <div>campCycleId: {campCycleId}</div>
      <div>corpName: {corpName}</div>
      <div>year: {year}</div>
      <br />
      <button onClick={handleGeneratePDFs} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Start Generating"}
      </button>{" "}
      <button onClick={handleDeletePDF} disabled={isProcessing}>
        Delete Files
      </button>
      <div>Total Employees: {totalEmployees}</div>
      <div>Uploaded Files: {uploadedCount}</div>
      <br />
      {list.map((item, index) => (
        <div key={item.empId || index} style={{ display: "flex", gap: "8px" }}>
          <div>{`${index + 1}. ${item.empId} ${item.name}`}</div>
          {item?.medicalFitnessFoodUrl ? (
            <a href={item.medicalFitnessFoodUrl}>{item.medicalFitnessFoodUrl}</a>
          ) : (
            <span>-</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdaniWilmarFssai;
