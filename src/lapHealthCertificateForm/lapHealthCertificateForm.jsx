import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";

const LapHealthCertificateForm = ({
  corpId = "afb32577-5157-4321-87cc-a980ea256e7f",
  campCycleId = "253637",
  corpName = "Lapp India Pune",
  // corpId = "64eac2de-b039-4526-bffb-9e0e5e17c771",
  // campCycleId = "252431",
  // corpName = "Lapp India Bangalore",
  // corpId = "5359f5e7-825f-4aa9-b649-0efa013945bc",
  // campCycleId = "253638",
  // corpName = "Lapp India Dharuhera",
  //   corpId = "96b53daa-d5ca-4d96-952b-3d15d5cdf649",
  //   campCycleId = "253639",
  //   corpName = "Lapp India Vadodara",
  // fileType = "CONSOLIDATED_REPORT",
  fileType = "ANNEXURE", // Lapp India Pune
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const HealthForm = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Untitled spreadsheet</title>
    <meta name="author" content="LENOVO" />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }
      .s2 {
        color: #001f5f;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 9pt;
      }
      .s3 {
        color: #001f5f;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 7.5pt;
      }
      .s4 {
        color: #001f5f;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 7pt;
      }
      .s5 {
        color: #001f5f;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 7pt;
      }
      .s6 {
        color: #001f5f;
        font-family: Arial, sans-serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 8pt;
      }
      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>
  <body>
    <p style="text-indent: 0pt; text-align: left">
      <span>
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <img
                width="719"
                height="130"
                src="data:image/jpg;base64,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"
              />
            </td>
          </tr></table
      ></span>
    </p>
    <table
      style="border-collapse: collapse; margin-left: 5pt; margin-right:5pt"
      cellspacing="0"
    >
      <tr style="height: 22pt">
        <td
          style="
            width: 545pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="9"
        >
          <p
            class="s2"
            style="
              padding-left: 210pt;
              padding-right: 219pt;
              text-indent: 0pt;
              line-height: 10pt;
              text-align: center;
            "
          >
            <u>Clinical Examination </u> <u>Report</u>
          </p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Name:
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="3"
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            ${data?.name || ""}
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Sex : ${data?.gender || ""}
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="4"
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Date of examination: 
          </p>
        </td>
      </tr>
      <tr style="height: 23pt">
        <td
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            D.O.B.:
          </p>
        </td>
        <td
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            ${data?.dateOfBirth || ""}
          </p>
        </td>
        <td
          colspan="2"
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Age : ${data?.age || ""}
          </p>
        </td>

        <td
          colspan="5"
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Address: ${data?.address || ""}
          </p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Name of Company/Agency :
          </p>
        </td>
        <td
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="8"
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 10pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            ${corpName || ""}
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-left: 20pt;
              padding-right: 14pt;
              text-indent: -18pt;
              line-height: 9pt;
              text-align: left;
            "
          >
            A. History of any of the following
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 8pt; text-align: center"
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 8pt; text-align: center"
          >
            No
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 8pt; text-align: center"
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 8pt; text-align: center"
          >
            No
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 8pt; text-align: center"
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 1pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="
              padding-right: 24pt;
              text-indent: 0pt;
              line-height: 8pt;
              text-align: right;
            "
          >
            No
          </p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Recurrent Colds
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Frequent Headache
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Ear Discharge
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Recurrent Sneezing
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Eye Strain
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Impaired hearing
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Recurrent Cough
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Intestinal Trouble
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Joint Pain
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Breathlessness
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 231pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="4"
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-right: 25pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: right;
            "
          >
            Backache
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="8"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 20pt">
        <td
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              padding-right: 14pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            B.Lifestyle / Personal habbits / Addictions
          </p>
        </td>
        <td
          style="
            
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 7pt; text-align: center"
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 7pt; text-align: center"
          >
            No
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 32pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="
              padding-left: 4pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 74pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="
              padding-right: 11pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: center;
            "
          >
            No
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="text-indent: 0pt; line-height: 7pt; text-align: center"
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="
              padding-right: 24pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: right;
            "
          >
            No
          </p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Smoking
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Pan Chewing
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Drug Addiction
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 24pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Alcohol
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Gambling
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              padding-right: 27pt;
              text-indent: 0pt;
              line-height: 8pt;
              text-align: left;
            "
          >
            Tobacco Chewing
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            C.Identification mark
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="8"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 16pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 3pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Height (in cm)
          </p>
        </td>
        <td
          colspan="2"
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            ${data?.height || ""}
          </p>
        </td>

        <td
          colspan="3"
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Weight (in kgs) : ${data?.weight || ""}
          </p>
        </td>

        <td
          colspan="3"
          style="
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              line-height: 7pt;
              text-align: left;
            "
          >
            Skin Colour
          </p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            General Appearance
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Built
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Hair
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Nails
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Ears
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Auditory Canal
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Ear Drums
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr>
        <td
          rowspan="4"
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Eyes
          </p>
        </td>
        <td style="border-left-style: solid; border-left-width: 0.2pt; border-top-style: solid;
            border-top-width: 0.2pt;">
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          ></p>
        </td>
          <td style="width: 67pt;             border-top-style: solid;
            border-top-width: 0.2pt;">
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left;">
            <br />
          </p>
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            Vision
          </p>
        </td>
        <td style="width: 67pt;             border-top-style: solid;
            border-top-width: 0.2pt;">
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            Right
          </p>
        </td>
        <td style="width: 32pt;             border-top-style: solid;
            border-top-width: 0.2pt;">
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p class="s4" style="text-indent: 0pt; text-align: left">Left</p>
        </td>
        <td style="width: 74pt;            border-top-style: solid;
            border-top-width: 0.2pt;">
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            Without Glasses
          </p>
        </td>
        <td
          style="width: 61pt;            border-top-style: solid;
            border-top-width: 0.2pt;"
          colspan="2"
        >
          <p style="padding-top: 2pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s4"
            style="padding-left: 19pt; text-indent: 0pt; text-align: left"
          >
            Colour Vision
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr>
        <td style="border-left-style: solid; border-left-width: 0.2pt;">
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          ></p>
        </td>
        <td>
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            Near
          </p>
        </td>
        <td style="width: 67pt">
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            ${data?.nearRightEyeSight || ""}
          </p>
        </td>
        <td style="width: 32pt">
          <p class="s4" style="text-indent: 0pt; text-align: left">
            ${data?.nearLeftEyeSight || ""}
          </p>
        </td>
        <td style="width: 74pt">
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            ${!data?.eyeSightWithGlasses ? "Yes" : "No"}
          </p>
        </td>
        <td style="width: 61pt" colspan="2">
          <p
            class="s4"
            style="padding-left: 19pt; text-indent: 0pt; text-align: left"
          >
            ${data?.colourVision ? data?.colourVision : ""}
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          ></p>
        </td>
      </tr>
      <tr>
        <td style="border-left-style: solid; border-left-width: 0.2pt;">
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          ></p>
        </td>
        <td>
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            Far
          </p>
        </td>
        <td style="width: 67pt">
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            ${data?.farRightEyeSight || ""}
          </p>
        </td>
        <td style="width: 32pt">
          <p class="s4" style="text-indent: 0pt; text-align: left">
            ${data?.farLeftEyeSight || ""}
          </p>
        </td>
        <td style="width: 74pt">
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          >
            ${!data?.eyeSightWithGlasses ? "Yes" : "No"}
          </p>
        </td>
        <td style="width: 61pt" colspan="2">
          <p
            class="s4"
            style="padding-left: 19pt; text-indent: 0pt; text-align: left"
          >
            ${data?.colourVision ? data?.colourVision : ""}
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 16pt; text-indent: 0pt; text-align: left"
          ></p>
        </td>
      </tr>
      <tr>
        <td style="border-left-style: solid; border-left-width: 0.2pt;   border-bottom-style: solid;
            border-bottom-width: 0.2pt;">
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            Comments
          </p>
        </td>
        <td
          colspan="7"
          style="border-right-style: solid; border-right-width: 0.2pt ;   border-bottom-style: solid;
            border-bottom-width: 0.2pt;"
        >
          <p
            class="s4"
            style="
              padding-right: 30pt;
              text-indent: 0pt;
              line-height: 112%;
              text-align: left;
            "
          >
            Normal
          </p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Nose
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Septum
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Nostril
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Mouth
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Tongue
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Tonsil
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 61pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
          colspan="2"
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Teeth
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 5pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Palate
          </p>
        </td>
      </tr>
      <tr style="height: 23pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Respiratory
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Chest
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Breath Sounds
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Cardiovascular
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 3pt; text-indent: 0pt; text-align: left"
          >
            Pulse
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            SpO2
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Blood Pressure
          </p>
        </td>
        <td
        colspan="2"
          style="
           
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
             border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            ${data?.bp ? data?.bp + " mmHg" : ""}
          </p>
        </td>
        
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Heart sounds
          </p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Murmur
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 9pt;
              padding-right: 36pt;
              text-indent: -6pt;
              text-align: left;
            "
          >
            Thril l
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 113pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="2"
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Perepheral Vessis
          </p>
        </td>
      </tr>
      <tr style="height: 23pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Abdomen
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Tenderness
          </p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Ascites
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 3pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Hernia
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 12pt;
              padding-right: 16pt;
              text-indent: 3pt;
              text-align: left;
            "
          >
            Other Masses
          </p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Gentto Urinary
          </p>
        </td>
        <td
          style="
            width: 107pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
          colspan="2"
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            External Genitalia
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 106pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
          colspan="2"
        >
          <p
            class="s4"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Hydrocoeles swelling
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 50pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p class="s4" style="text-indent: 0pt; text-align: left">Discharge</p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="padding-left: 5pt; text-indent: 0pt; text-align: left"
          >
            Discharge
          </p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Musculo skeletal
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="8"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 23pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 7pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Other Abnormalities
          </p>
        </td>
        <td
          style="
            width: 451pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="8"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 22pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p
            class="s5"
            style="
              padding-top: 6pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Fit for Work
          </p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 54pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Yes
          </p>
        </td>
        <td
          style="
            width: 67pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p
            class="s4"
            style="
              padding-top: 1pt;
              padding-left: 2pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            No
          </p>
        </td>
        <td
          style="
            width: 58pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 53pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 40pt">
        <td
          style="
            width: 94pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
          "
        >
          <p style="padding-top: 3pt; text-indent: 0pt; text-align: left">
            <br />
          </p>
          <p
            class="s5"
            style="padding-left: 2pt; text-indent: 0pt; text-align: left"
          >
            Signature of employee
          </p>
        </td>
        <td style="width: 53pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 54pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 67pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 53pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 53pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 58pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td style="width: 53pt; border-top-style: solid; border-top-width: 1pt">
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
        <td
          style="
            width: 60pt;
            border-top-style: solid;
            border-top-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
      <tr style="height: 37pt">
        <td
          style="
            width: 545pt;
            border-left-style: solid;
            border-left-width: 0.2pt;
            border-bottom-style: solid;
            border-bottom-width: 0.2pt;
            border-right-style: solid;
            border-right-width: 0.2pt;
          "
          colspan="9"
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s6"
            style="padding-right: 98pt; text-indent: 0pt; text-align: right"
          >
            Doctor&#39;s signature
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
    const pdfBlob = await html2pdf()
      .from(HealthForm)
      .output("blob")
      .then((data) => {
        return data;
      });

    // const url1 = URL.createObjectURL(pdfBlob);
    // window.open(url1, "_blank");

    const formData = new FormData();
    //formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);
    formData.append("file", pdfBlob, `${data.empId}_HealthForm.pdf`);

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
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const temp = result?.data.filter((item) => item.vitalsPresent);

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

export default LapHealthCertificateForm;
