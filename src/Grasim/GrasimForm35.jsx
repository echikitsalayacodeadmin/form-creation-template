import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";

const GrasimForm35 = ({
  corpId = "1d49173b-ab6d-44d2-9a68-1895af1f8ca2",
  //   corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  // campCycleId = ""
  campCycleId = "",
  fileType = "CONSOLIDATED_REPORT",
  startDate = dayjs("2024-10-22"),
  endDate = dayjs("2024-10-22"),
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const createRespList = () => {
    const resps = [];

    // Push the exact counts based on 400 items
    for (let i = 0; i < 160; i++) {
      resps.push("16mint");
    }
    for (let i = 0; i < 160; i++) {
      resps.push("17mint");
    }
    for (let i = 0; i < 80; i++) {
      resps.push("18mint");
    }

    // Shuffle the array to randomize the order
    for (let i = resps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resps[i], resps[j]] = [resps[j], resps[i]];
    }

    return resps;
  };

  // Prepare the list before generating PDFs
  const respList = createRespList();

  const generatePDF = async (data, index) => {
    const resp = respList[index];
    const content = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>FORM 35 (1) for Grasim.docx</title>
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
      .p,
      p {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
        margin: 0pt;
      }
      h2 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 14pt;
      }
      .s1 {
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      .s2 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      .s3 {
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 16pt;
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
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      #l1 > li:first-child > *:first-child:before {
        counter-increment: c1 0;
      }
      #l2 {
        padding-left: 0pt;
        counter-reset: c2 1;
      }
      #l2 > li > *:first-child:before {
        counter-increment: c2;
        content: counter(c2, decimal) ". ";
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      #l2 > li:first-child > *:first-child:before {
        counter-increment: c2 0;
      }
      #l3 {
        padding-left: 0pt;
      }
      #l3 > li > *:first-child:before {
        content: "● ";
        color: black;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
      #l4 {
        padding-left: 0pt;
      }
      #l4 > li > *:first-child:before {
        content: "o ";
        color: black;
        font-family: Calibri, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 14pt;
      }
    </style>
  </head>
  <body>
  <div style="padding-left:7.5%; padding-right:7.5%; padding-top:5%">

    <h1 style="padding-left: 9pt; text-indent: 0pt; text-align: center">
      FORM 35
    </h1>
    <p style="padding-left: 9pt; text-indent: 0pt; text-align: center">
      [Prescribed under sub-rule (4) of Rule 66-A]
    </p>
    <h2 style="padding-left: 9pt; text-indent: 0pt; text-align: center">
      Record of eye examination
    </h2>
    <br />
    <p
      style="
        padding-left: 5pt;
        text-indent: 0pt;
        line-height: 114%;
        text-align: left;
      "
    >
      Serial No<span class="s1">……………………………</span> <br />
      Date<span class="s1">………………………………………………</span>..
    </p>
    <ol id="l1">
      <li data-list-text="1.">
        <p
          style="
            padding-top: 10pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Name of the factory
          <span style="padding-left: 88pt">Grasim Industries Limited,</span>
        </p>
        <p
          style="
            padding-top: 8pt;
            padding-left: 252pt;
            text-indent: 0pt;
            text-align: left;
          "
        >
          Chemical Division, Birlagram, Nagda
        </p>
      </li>
      <li data-list-text="2.">
        <p
          style="
            padding-top: 8pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Department / works where
        </p>
        <!-- <p

          class="s1"
          style="
            padding-top: 8pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
          "
        >
          …<span class="s2"> </span
          ><span class="p">the worker is employed</span>
        </p> -->
        <p
          class="s1"
          style="
            padding-top: 8pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
            display: flex;
          "
        >
          <span
            class="s2"
            style="
              flex-grow: 1;
              border-bottom: 1px dotted;
              display: inline-block;
              min-width: 0;
              text-transform: capitalize;
            "
          >
            ${data?.department?.toLowerCase() || ""}
          </span>
          the worker is employed
        </p>
      </li>
      <li data-list-text="3.">
        <p
          style="
            padding-top: 8pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Name of the worker
        </p>
        <p
          class="s1"
          style="
            padding-top: 2pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
            display: flex;
          "
        >
          <span
            class="s2"
            style="
              flex-grow: 1;
              border-bottom: 1px dotted;
              display: inline-block;
              min-width: 0;
              text-transform: capitalize;
            "
          >
            ${data?.name?.toLowerCase() || ""}
          </span>
        </p>
      </li>

      <li data-list-text="4.">
        <p
          style="
            padding-top: 2pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Sex
        </p>
        <p
          class="s1"
          style="
            padding-top: 2pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
            display: flex;
          "
        >
          <span
            class="s2"
            style="
              flex-grow: 1;
              border-bottom: 1px dotted;
              display: inline-block;
              min-width: 0;
              text-transform: capitalize;
            "
          >
            ${data?.gender?.toLowerCase() || ""}
          </span>
        </p>
      </li>
      <li data-list-text="5.">
        <p
          style="
            padding-top: 2pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Age
        </p>
        <p
          class="s1"
          style="
            padding-top: 2pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
            display: flex;
          "
        >
          <span
            class="s2"
            style="
              flex-grow: 1;
              border-bottom: 1px dotted;
              display: inline-block;
              min-width: 0;
              text-transform: capitalize;
            "
          >
            ${data?.age?.toLowerCase() || ""}
          </span>
        </p>
      </li>
      <li data-list-text="6.">
        <p
          style="
            padding-top: 2pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Nature of work
          <span style="margin-left: 25%"
            >Crane or fork lift operator / helper</span
          >
        </p>
      </li>
      <li data-list-text="7.">
        <p
          style="
            padding-top: 2pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Date of employment
        </p>
        <p
          class="s1"
          style="
            padding-top: 2pt;
            padding-left: 41pt;
            text-indent: 0pt;
            text-align: left;
            display: flex;
          "
        >
          <span
            class="s2"
            style="
              flex-grow: 1;
              border-bottom: 1px dotted;
              display: inline-block;
              min-width: 0;
              text-transform: capitalize;
            "
          >
            ${data?.age?.toLowerCase() || ""}
          </span>
        </p>
      </li>
      <li data-list-text="8.">
        <p
          style="
            padding-top: 2pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Result of examination of eye sight
        </p>
        <ol id="l2">
          <li data-list-text="1.">
            <h2
              style="
                padding-top: 9pt;
                padding-left: 148pt;
                text-indent: -17pt;
                text-align: left;
              "
            >
              Visual acuity<span class="p"
                >: With / Without the use of corrective glasses</span
              >
            </h2>
            <ul id="l3">
              <li data-list-text="●">
                <p
                  style="
                    padding-top: 8pt;
                    padding-left: 167pt;
                    text-indent: -18pt;
                    line-height: 150%;
                    text-align: left;
                  "
                >
                  Distance Va: Rt<span class="s1">…………</span>..<span class="s1"
                    >……………</span
                  >Lt<span class="s1">………………</span>..<span class="s1">…………</span
                  >..
                </p>
              </li>
              <li data-list-text="●">
                <p
                  style="
                    padding-left: 166pt;
                    text-indent: -17pt;
                    text-align: left;
                  "
                >
                  Power of correction glasses:
                </p>
                <ul id="l4">
                  <li data-list-text="o">
                    <p
                      style="
                        padding-top: 8pt;
                        padding-left: 202pt;
                        text-indent: -17pt;
                        text-align: left;
                      "
                    >
                      Rt<span class="s1">…………………………………………………</span>
                    </p>
                  </li>
                  <li data-list-text="o">
                    <p
                      style="
                        padding-top: 8pt;
                        padding-left: 202pt;
                        text-indent: -17pt;
                        text-align: left;
                      "
                    >
                      Lt<span class="s1">…………………………………………………</span>
                    </p>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li data-list-text="2.">
            <h2
              style="padding-left: 148pt; text-indent: -17pt; text-align: left"
            >
              Colour Vision :
            </h2>

            <span
              class="p"
              style="
                padding-top: 2pt;
                padding-left: 149pt;
                text-indent: 0pt;
                text-align: left;
              "
            >
              ………………………………………………………</span
            >

            <p style="padding-top: 5pt; text-indent: 0pt; text-align: left">
              <br />
            </p>
          </li>
        </ol>
      </li>
      <li data-list-text="9.">
        <p style="padding-left: 40pt; text-indent: -17pt; text-align: left">
          Remarks <span class="s3" style="margin-left: 30%">Fit / Unfit</span>
        </p>
        <p
          class="s1"
          style="
            padding-top: 20pt;
            padding-left: 40pt;
            text-indent: 0pt;
            text-align: left;
          "
        >
          ………………………………………………………<span class="p">..</span>
        </p>
      </li>
      <li data-list-text="10.">
        <p
          style="
            padding-top: 12pt;
            padding-left: 40pt;
            text-indent: -17pt;
            text-align: left;
          "
        >
          Signature of ophthalmologist
        </p>
        <p
          class="s1"
          style="
            padding-top: 20pt;
            padding-left: 40pt;
            text-indent: 0pt;
            text-align: left;
          "
        >
          ………………………………………………………<span class="p">..</span>
        </p>
      </li>
    </ol>
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
    // formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);

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

      // const filterEmpId = ["];
      const temp = result?.data?.filter((item) => {
        const itemDate = dayjs(item.date).format("YYYY-MM-DD");
        return (
          // empId &&
          // bloodReportExist &&
          // audioReportExist &&
          // pftReportExist &&
          // bloodReportExist &&
          itemDate >= dayjs(startDate).format("YYYY-MM-DD") &&
          itemDate <= dayjs(endDate).format("YYYY-MM-DD")
        );
      });

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
            <a href={item.consolidatedRUrl}>
              <div key={index}>{item.consolidatedRUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrasimForm35;
