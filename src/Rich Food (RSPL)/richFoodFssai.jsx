import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { LogoImage, LogoImageFSSAI } from "./assets";
import dayjs from "dayjs";
import { JAY_DIP_SIGNBASE64 } from "../assets/images/base64Images";

const RichFoodFssai = ({
  corpId = "47f6ab07-4fc2-45f8-83e0-38c88504861a",
  campCycleId = "353014",
  fileType = "FITNESS_CERTIFICATE_FOOD",
  corpName = "RPSPL PRIVATE LIMITED",
  campDate = "26th Sept, 2025",
  year = "2025",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const FoodCertificate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>a4d932fb-451d-4918-9ba4-5bc1b7a214d7</title>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            text-indent: 0;
          }
          .s1 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 13pt;
          }
          .s2 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12pt;
          }
          .s3 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          h1 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 15pt;
          }
          .s4 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          .s6 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: italic;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          .s7 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 11pt;
          }
          .s8 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 16pt;
          }
          p {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
            margin: 0pt;
          }
          .s10 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 10.5pt;
          }
          .s11 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 9pt;
          }
          h2 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 14pt;
          }
          .h4 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: underline;
            font-size: 11pt;
          }
          .s12 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 10.5pt;
          }
          li {
            display: block;
          }
          #l1 {
            padding-left: 0pt;
            counter-reset: c1 1;
          }
          #l1 > li > *:first-child:before {
            counter-increment: c1;
            content: counter(c1, decimal) ". ";
            color: black;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
          }
          #l1 > li:first-child > *:first-child:before {
            counter-increment: c1 0;
          }
          table,
          tbody {
            vertical-align: top;
            overflow: visible;
          }
        </style>
      </head>
      <body>
        <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%">
    
          <h1 style="padding-top: 3pt; text-indent: 0pt; text-align: center">
            MEDICAL FITNESS CERTIFICATE
          </h1>
    
          <p class="s4" style="text-indent: 0pt; text-align: center">
            (FOR THE YEAR ${year})
          </p>
          <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
        </div>
        <img
          src=${LogoImage}
          alt=""
          style="width: 100%"
        />
        <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%">
          <br />
          <p style="padding-top: 1pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
            <br />
          </p>
          <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;" />
          <p
            style="
              padding-left: 11pt;
              text-indent: 0pt;
              text-align: justify;
             
            "
          >
            Shri/ Smt.
            <span style=" text-transform: capitalize; text-decoration: underline"> ${
              data?.name.toLowerCase() || ""
            }</span>
            employed with <b>M/S ${corpName} </b>coming in direct
            contact with food items has been carefully examined* by me on date <u
              >&nbsp;&nbsp;&nbsp;${data?.vitalsCreatedDate}&nbsp;
            </u> Based
            on the medical examination conducted, he/she is found free from any
            infectious or communicable diseases and the person is fit to work in the
            above-mentioned food establishment.
          </p>
          <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
          <br />
          <br />
          
          <img src=${JAY_DIP_SIGNBASE64} 
          style="height:200px;"
          />
          <br />
          <br />
          <br />
          <p
            class="s10"
            style="padding-left: 15pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
          >
            Name &amp; Signature with Seal <br />
            <span class="s11"
              >Registered Medical Practitioner / Civil <br />
              Surgeon</span
            >
          </p>
          <p style="padding-top: 5pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
            <br />
          </p>
          <h2 style="padding-left: 5pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
            *<span class="h4">Medical Examinations conducted:</span>
          </h2>
          <ol id="l1">
            <li data-list-text="1.">
              <p
                class="s12"
                style="
                  padding-top: 8pt;
                  padding-left: 26pt;
                  text-indent: -21pt;
                  text-align: left;
                "
              >
                Physical Examination
              </p>
            </li>
            <li data-list-text="2.">
              <p
                class="s12"
                style="padding-left: 26pt; text-indent: -21pt; text-align: left"
              >
                Eye Test
              </p>
            </li>
            <li data-list-text="3.">
              <p
                class="s12"
                style="padding-left: 26pt; text-indent: -21pt; text-align: left"
              >
                Skin Examination
              </p>
            </li>
         
            <li data-list-text="4.">
              <p
                class="s12"
                style="padding-left: 26pt; text-indent: -21pt; text-align: left"
              >
                Compliance with schedule of VACCINE to be inoculated against enteric
                group of diseases
              </p>
            </li>
            <li data-list-text="5.">
              <p
                class="s12"
                style="padding-left: 26pt; text-indent: -21pt; text-align: left"
              >
                Any test required to confirm any communicable or infectious disease
                which the person suspected to be suffering from on clinical
                examination
              </p>
            </li>
          </ol>
        </div>
    `;
    const pdfBlob = await html2pdf()
      .from(FoodCertificate)
      .output("blob")
      .then((data) => {
        return data;
      });

    // const url1 = URL.createObjectURL(pdfBlob);
    // window.open(url1, "_blank");

    const formData = new FormData();
    //formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);
    formData.append("file", pdfBlob, `${data.empId}_food_certificate_form.pdf`);

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

      const codes = [
        "EC10045",
        "RRF75",
        "RRF22",
        "RRF13",
        "RRF27",
        "RRF73",
        "RRF10",
        "RRF85",
        "RRF62",
        "RRF71",
        "RRF19",
        "RRF47",
        "RRF98",
        "RRF78",
        "RRF87",
        "RRF101",
        "RRF36",
        "RF4",
        "RRF102",
        "RRF86",
        "RRF38",
        "RRF50",
        "RRF76",
        "Sec32",
        "RRF11",
        "RRF81",
        "RRF37",
        "RRF69",
        "RRF95",
        "RRF28",
        "RF5",
        "RRF29",
        "RRF35",
        "Sec1",
        "RF2",
        "RRF67",
        "RRF70",
        "RRF56",
        "EC10111",
        "RRF65",
        "RRF45",
        "RRF26",
        "RRF83",
        "RRF24",
        "EC10106",
        "Sec7",
        "RRF52",
        "EC10019",
        "RRF93",
        "RRF14",
        "RRF100",
        "RRF16",
        "RRF41",
        "RRF80",
        "RRF40",
        "RRF59",
        "RRF46",
        "RRF90",
        "RF3",
        "RRF31",
        "RRF39",
        "RRF63",
        "RRF72",
        "RF9",
        "RRF44",
        "Sec61",
        "RRF64",
        "RRF68",
        "RRF33",
        "RRF77",
        "RRF20",
        "RRF84",
        "RRF57",
        "RRF92",
        "EC10009",
        "RRF88",
        "RRF12",
        "RRF48",
        "EC10112",
        "RRF79",
        "RRF21",
        "RRF30",
        "RRF74",
        "RRF91",
        "RRF89",
        "Sec34",
        "RRF23",
        "RRF49",
        "RRF103",
        "RRF66",
        "EC10104",
        "RRF25",
        "RF6",
        "RRF58",
        "RRF97",
        "RRF18",
        "Sec60",
        "RF8",
        "RRF42",
        "RRF94",
        "RRF43",
      ];

      const temp = result?.data.filter((item) => codes.includes(item.empId));

      console.log({ list: temp.map((item) => item.empId).join(",") });
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

            <a href={item.medicalFitnessFoodUrl}>
              <div key={index}>{item.medicalFitnessFoodUrl}</div>
            </a>

            <br />
          </div>
        ))}
      </div>
    </div>
  );
};
export default RichFoodFssai;
