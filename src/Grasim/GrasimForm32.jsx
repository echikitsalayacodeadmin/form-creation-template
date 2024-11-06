import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";

const GrasimForm32 = ({
  corpId = "1d49173b-ab6d-44d2-9a68-1895af1f8ca2",
  //   corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  // campCycleId = ""
  campCycleId = "",
  fileType = "PHYSICAL_FITNESS_CERTIFICATE",
  startDate = dayjs("2024-09-02"),
  endDate = dayjs("2024-09-10"),
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkVitalsStatus = (vitalsErrorData) => {
    // Define allowed keys
    const allowedKeys = ["height", "weight", "bp", "sugar"];

    // Get keys of vitalsErrorData
    const vitalsKeys = Object.keys(vitalsErrorData);

    // Check if all keys are allowed or if the object is empty
    const isFit =
      vitalsKeys.length === 0 ||
      vitalsKeys.every((key) => allowedKeys.includes(key));

    return isFit ? "Fit" : "Unfit";
  };

  const generatePDF = async (data, index) => {
    const content = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Fitness for Dangerous operations- FORM 32 - Copy</title>
    <meta name="author" content="braj.soni" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }
      h1 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 16pt;
      }
      .s1 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 16pt;
      }
      h3 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 12pt;
      }
      .s2 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
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
      .h2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 14pt;
      }
      .s3 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      .h4 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }
      .s4 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }
      .s5 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }
      /* li {
        display: block;
      } */
      #l1 {
        padding-left: 0pt;
        counter-reset: c1 1;
      }
      /* #l1 > li > *:first-child:before {
        counter-increment: c1;
        content: counter(c1, decimal) ". ";
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
      }
      #l1 > li:first-child > *:first-child:before {
        counter-increment: c1 0;
      }
      li {
        display: block;
      }
      #l2 {
        padding-left: 0pt;
        counter-reset: d1 2;
      }
      #l2 > li > *:first-child:before {
        counter-increment: d1;
        content: counter(d1, decimal) ". ";
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 12pt;
      }
      #l2 > li:first-child > *:first-child:before {
        counter-increment: d1 0;
      } */
      .horizontal_dotted_line {
        display: flex;
        width: 300px;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px;
      }
      .horizontal_dotted_line:after {
        border-bottom: 1px dotted black;
        content: "";
        flex: 1;
      }
    </style>
  </head>
  <body>
    <div style="padding-left: 10%; padding-right: 10%">
      <h1
        style="
          padding-top: 1pt;
          padding-left: 11pt;
          text-indent: 0pt;
          text-align: center;
        "
      >
        FORM 32
      </h1>
      <h1 style="padding-left: 11pt; text-indent: 0pt; text-align: center">
        Certificate of Fitness for Dangerous Operations
      </h1>
      <h3 style="text-align: center">
        (Prescribed under Rule 107) <br />
        Counterfoil
      </h3>
      <br/>
      <ol id="l1">
        <li data-list-text="1.">
          <p style="text-align: left; display: flex">
            Serial Number
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
              ${data.empId || ""}
            </span>
          </p>
        </li>
        <li data-list-text="2.">
          <p style="text-align: left; display: flex">
            Name of person examined
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${data?.name?.toLowerCase() || ""}
            </span>
          </p>
        </li>
        <li data-list-text="3.">
          <p style="text-align: left; display: flex">
            Father’s name
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${data.fathersName?.toLowerCase() || ""}
            </span>
          </p>
        </li>
        <li data-list-text="4.">
          <p style="text-align: left; display: flex">
            Sex
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${data.gender?.toLowerCase() || ""}
            </span>
          </p>
        </li>
        <li data-list-text="5.">
          <p style="text-align: left; display: flex">
            Address
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${data?.address?.toLowerCase() || ""}
            </span>
          </p>
        </li>
        <li data-list-text="6.">
          <p style="text-indent: 0pt; text-align: left">
            Name of the factory in which employed/in which wishes to be
            employed-
          </p>
          <p style="padding-left: 149pt; text-indent: 0pt; text-align: left">
            - Grasim Industries Ltd. Chemical division, Birlagram, Nagda
          </p>
        </li>
        <li data-list-text="7.">
          <p style="text-align: left">
            Process of department in which employed/wishes to be employed <br />
            <span
              class="s2"
              style="
                flex-grow: 1;
                width: 99%;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${data.department?.toLowerCase() || ""}
            </span>
          </p>
        </li>
        <li data-list-text="8.">
          <p style="text-align: left; display: flex">
            Whether certificate granted
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              Yes
            </span>
          </p>
        </li>
        <li data-list-text="9.">
          <p style="text-align: left; display: flex">
            Whether declared unfit and certificate refused
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${checkVitalsStatus(data.vitalsErrorData) || ""}
            </span>
          </p>
        </li>
        <li data-list-text="10.">
          <p style="text-align: left; display: flex">
            Reference number of previous certificate granted or refused
            <span
              class="s2"
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              ${"NA"}
            </span>
          </p>
        </li>
      </ol>
    </div>

    <div style="padding-left: 7.5%; padding-right: 7.5%">
 <br/>
      <br/>
      <br/>
      <p style="display: flex; justify-content: space-between">
     
        <span>
       <br/>
        ..................................</span>
        <span>
 <br/>
        .............................</span>
      </p>
      <p style="display: flex; justify-content: space-between">
        <span
          >Signature of L.T.I. of<br />
          Person examined</span
        >
        <span
          >Signature of<br />
          Certifying Surgeon</span
        >
      </p>
    </div>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

<br/><br/><br/><br/><br/>
    <h1
      style="
        padding-top: 14pt;
        padding-left: 11pt;
        text-indent: 0pt;
        text-align: center;
      "
    >
      CERTIFICATE
    </h1>
    <br />
    <div style="padding-left: 10%; padding-right: 10%">
      <p style="text-align: right">
        Serial Number
        <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
          "
        >
          ${
            data.empId ||
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          }
        </span>
      </p>
      <p
        style="
          padding-top: 14pt;
          padding-left: 5pt;
          text-indent: 0pt;
          text-align: left;
        "
      >
        I certify that I have personally examined 
        <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
            text-transform: capitalize;
          "
        >
          ${
            data.name?.toLowerCase()
              ? "&nbsp;&nbsp;&nbsp;&nbsp;" +
                data.name?.toLowerCase() +
                "&nbsp;&nbsp;&nbsp;&nbsp;"
              : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          }
        </span>
        (Name) son/daughter of
        <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
             text-transform: capitalize;
          "
        >
          ${
            data.fathersName
              ? "&nbsp;&nbsp;&nbsp;&nbsp;" +
                data.fathersName?.toLowerCase() +
                "&nbsp;&nbsp;&nbsp;&nbsp;"
              : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          }
        </span>
        (Father’s name) residing at 
        <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
             text-transform: capitalize;
          "
        >
          ${
            data.address
              ? "&nbsp;&nbsp;&nbsp;&nbsp;" +
                data.address?.toLowerCase() +
                "&nbsp;&nbsp;&nbsp;&nbsp;"
              : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          }
        </span>
        (Address) who  <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
             text-transform: capitalize;
          "
        > ${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"} </span> is desirous of being employed as ...”Grasim Chemical Division, Nagda”...(Name of factory) in 
        <span
          style="
            flex-grow: 1;
            border-bottom: 1px dotted;
            display: inline-block;
            min-width: 0;
            text-transform: capitalize;
          "
        >
          ${
            data.department
              ? "&nbsp;&nbsp;&nbsp;&nbsp;" +
                data.department?.toLowerCase() +
                "&nbsp;&nbsp;&nbsp;&nbsp;"
              : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
          } </span
        > (Department and process), and that as nearly as can be ascertained from
        my examination, is <span class="h4">fit</span><span class="h2">/</span
        ><span class="h4">unfit</span> for employment at the above noted
        factory.
      </p>
      <br/>
      <ol id="l2">
        <li data-list-text="2." style="padding-left: 35px; margin-left: 17pt">
          <p style="text-align: left;display:inline">
            He is fit to be employed and may be employed on some other
            non-hazardous operations such as
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                width:100%,
                margin-left: 20px,
                display: inline-block;
                min-width: 0;
                text-transform: capitalize;
              "
            >
              &nbsp;&nbsp;${
                // data?.department?.toLowerCase() || ""
                ""
              }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </p>
        </li>
        <li data-list-text="3." style="padding-left: 35px; margin-left: 17pt">
          <p style="text-align: left; display: flex">
            He may be produced for further examination after a period of
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
             
            </span>
          </p>
        </li>
        <li data-list-text="4." style="padding-left: 35px; margin-left: 17pt">
          <p style="text-align: left">
            He is advised following further examination:
          </p>
          <p style="margin-left: 30%; width: 400px; display: flex">
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
            </span>
          </p>
          <p style="margin-left: 30%; width: 400px; display: flex">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
            </span>
          </p>
          <p style="margin-left: 30%; width: 400px; display: flex">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
            </span>
          </p>
        </li>
         <li data-list-text="5." style="padding-left: 35px; margin-left: 17pt">
          <p style="text-align: left">
            He is advised following treatment:
          </p>
          <p style="display: flex">
         &nbsp;
            <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                display: inline-block;
                margin-left:-5px;
                min-width: 0;
              "
            >
           
            </span>
          </p>
        </li>
        <li data-list-text="6." style="padding-left: 35px; margin-left: 17pt">
          <p style="text-align: left; display: flex;">
            The serial number of the previous 
             <span
              style="
                flex-grow: 1;
                border-bottom: 1px dotted;
                margin-left: 10px;
                display: inline-block;
                min-width: 0;
              "
            >
            
            </span>
          </p>
        </li>
      </ol>
      <div style="padding-left: 3%; padding-right: 3%">
       <br/><br/><br/>
      <p style="display: flex; justify-content: space-between">
     
        <span>
       <br/>
        ..................................</span>
        <span>
     <br/>
        .............................</span>
      </p>
      <p style="display: flex; justify-content: space-between">
        <span
          >Signature of L.T.I. of<br />
          Person examined</span
        >
        <span
          >Signature of<br />
          Certifying Surgeon</span
        >
      </p>
    </div>
      <p style="padding-top: 2pt; text-indent: 0pt; text-align: left"><br /></p>
      <p
        class="s4"
        style="padding-left: 5pt; text-indent: 0pt; text-align: left"
      >
        <span class="h4">Note:-</span> <span class="s5">(1)The</span>
        <span class="s5">counter</span> <span class="s5">file</span>
        <span class="s5">should</span> <span class="s5">be</span>
        <span class="s5">retained</span> <span class="s5">and</span>
        <span class="s5">maintained</span> <span class="s5">by</span>
        <span class="s5">the</span> <span class="s5">Certifying</span>
        <span class="s5">Surgeon</span>
      </p>
      <p
        class="s5"
        style="padding-left: 38pt; text-indent: 0pt; text-align: left"
      >
        (2)<span class="s4"> </span>The<span class="s4"> </span>para<span
          class="s4"
        >
        </span
        >which<span class="s4"> </span>does<span class="s4"> </span>not<span
          class="s4"
        >
        </span
        >apply<span class="s4"> </span>may<span class="s4"> </span>be<span
          class="s4"
        >
        </span
        >cancelled.
      </p>
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

    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");

    // const formData = new FormData();
    // formData.append("file", pdfBlob, `${data.empId}_${data?.name}.pdf`);

    // const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
    // const result = await uploadFile(url, formData);
    // if (result && result.data) {
    //   enqueueSnackbar("Successfully Uploaded PDF!", {
    //     variant: "success",
    //   });
    //   setUploadedCount((prevCount) => prevCount + 1);
    //   // const url = URL.createObjectURL(pdfBlob);
    //   // window.open(url, "_blank");
    // } else {
    //   enqueueSnackbar("An error Occurred!", {
    //     variant: "error",
    //   });
    // }
  };

  const fetchListOfEmployees = async () => {
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=${campCycleId}`;
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const temp = result?.data?.filter((item) => item.vitalsCreatedDate);

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
    for (let i = 0; i < 3; i++) {
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

export default GrasimForm32;
