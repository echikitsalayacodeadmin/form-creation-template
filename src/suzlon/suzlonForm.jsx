import React, { useEffect, useState } from "react";

import html2pdf from "html2pdf.js";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";

const SuzlonForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const generatePDF = async (data) => {
    const content = `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>

    <style type="text/css">
      html {
        background-color: #ffffff;
      }

      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      .page-break {
        page-break-after: always;
      }

      .s1 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 13.5pt;
      }

      h2 {
        color: #007e7e;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }

      .s2 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      h3 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s4 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s5 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s6 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 9.5pt;
      }

      .s7 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11.5pt;
      }

      .s8 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      h1 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: underline;
        font-size: 14pt;
      }

      h4 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .s11 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      .s12 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      .p,
      p {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
        margin: 0pt;
      }

      .s15 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      .s16 {
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      li {
        display: block;
      }

      #l1 {
        padding-left: 0pt;
        counter-reset: c1 1;
      }

      #l1>li>*:first-child:before {
        counter-increment: c1;
        content: counter(c1, decimal) ". ";
        color: black;
        font-family: "Lucida Sans Unicode", sans-serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9.5pt;
      }

      #l1>li:first-child>*:first-child:before {
        counter-increment: c1 0;
      }

      li {
        display: block;
      }

      #l2 {
        padding-left: 0pt;
        counter-reset: d1 1;
      }

      #l2>li>*:first-child:before {
        counter-increment: d1;
        content: counter(d1, upper-roman) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      #l2>li:first-child>*:first-child:before {
        counter-increment: d1 0;
      }

      #l3 {
        padding-left: 0pt;
        counter-reset: d2 1;
      }

      #l3>li>*:first-child:before {
        counter-increment: d2;
        content: counter(d2, decimal) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      #l3>li:first-child>*:first-child:before {
        counter-increment: d2 0;
      }

      #l4 {
        padding-left: 0pt;
        counter-reset: d3 1;
      }

      #l4>li>*:first-child:before {
        counter-increment: d3;
        content: counter(d3, lower-roman) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      #l4>li:first-child>*:first-child:before {
        counter-increment: d3 0;
      }

      #l5 {
        padding-left: 0pt;
        counter-reset: e1 2;
      }

      #l5>li>*:first-child:before {
        counter-increment: e1;
        content: counter(e1, lower-latin) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      #l5>li:first-child>*:first-child:before {
        counter-increment: e1 0;
      }

      #l6 {
        padding-left: 0pt;
        counter-reset: f1 1;
      }

      #l6>li>*:first-child:before {
        counter-increment: f1;
        content: counter(f1, lower-latin) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 11pt;
      }

      #l6>li:first-child>*:first-child:before {
        counter-increment: f1 0;
      }

      li {
        display: block;
      }

      #l7 {
        padding-left: 0pt;
        counter-reset: g1 1;
      }

      #l7>li>*:first-child:before {
        counter-increment: g1;
        content: counter(g1, upper-latin) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 11pt;
      }

      #l7>li:first-child>*:first-child:before {
        counter-increment: g1 0;
      }

      #l8 {
        padding-left: 0pt;
        counter-reset: g2 1;
      }

      #l8>li>*:first-child:before {
        counter-increment: g2;
        content: counter(g2, decimal) ". ";
        color: black;
        font-family: Cambria, serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 10pt;
      }

      #l8>li:first-child>*:first-child:before {
        counter-increment: g2 0;
      }

      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>

  <body>
    <div
      style="
              border: 1px solid black;
              padding-inline: 30px;
              padding-block: 20px;
              margin: 20px;
              min-height: 140vh;
            "
    >
      <div style="display: flex; justify-content: space-between">
        <p class="s1">Annexure IV</p>

        <img
          alt="logo"
          width="136"
          height="40"
          src="data:image/jpg;base64,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"
        />
      </div>

      <div
        style="
                border: 0.2px solid brown;
                margin-inline: 20px;
                margin-bottom: 1px;
                margin-top: 10px;
              "
      ></div>
      <div
        style="
                border: 1px solid brown;
                margin-inline: 20px;
                margin-bottom: 10px;
              "
      ></div>
      <h2 style="text-align: center">
        Pre-Employment /Periodic Health Check-up Card
      </h2>
      <div style="padding-inline: 50px">
        <div style="flex-grow: 1; padding-bottom: 10pt">
          <p class="s2" style="text-indent: 0pt; text-align: right">
            Date: <span style="text-decoration: underline;"> 11/04/2024 </span>
          </p>
        </div>
        <div style="flex-grow: 1; padding-bottom: 10pt">
          <p class="s2" style="text-indent: 0pt; text-align: left">
            Name:
            <span
              style="flex-grow: 1;
                  border-bottom: 1px solid black;
                  text-transform: capitalize;
                 "
              >${data?.name?.toLowerCase() || ""}
              <u
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
              ></span
            >
          </p>
        </div>
        <div style="flex-grow: 1; padding-bottom: 10pt">
          <p class="s2" style="text-indent: 0pt; text-align: left">
            Age:

            <span
              style="flex-grow: 1;
                  border-bottom: 1px solid black;
                 "
              >${data.age || ""}
              <u
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
              ></span
            >
          </p>
        </div>
        <div
          style="
                  flex-grow: 1;
                  padding-bottom: 10pt;
                  display: flex;
                  justify-content: space-between;
                "
        >
          <p class="s2" style="text-indent: 0pt; text-align: left">
            Address:
            <span
              style="flex-grow: 1;
                  border-bottom: 1px solid black;
                  text-transform: capitalize;
                 "
              >${data?.address?.toLowerCase() || ""}
              <u
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
              ></span
            >
          </p>

          <p class="s2" style="text-indent: 0pt; text-align: left">
            Sex: ${data?.gender || ""}
          </p>
        </div>
        <div
          style="
                  flex-grow: 1;
                  padding-bottom: 10pt;
                  display: flex;
                  justify-content: space-between;
                "
        >
          <div style="width: 50%">
            <p class="s2" style="text-indent: 0pt; text-align: left">
              Employee Code No:
              <span
                style="flex-grow: 1;
                    border-bottom: 1px solid black;
                   "
                >${data?.empId || ""}
                <u
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
                ></span
              >
            </p>
          </div>
          <div style="width: 50%">
            <p class="s2" style="text-indent: 0pt; text-align: left">
              Location:
              <span
                style="flex-grow: 1;
                    border-bottom: 1px solid black;
                    text-transform: capitalize;
                   "
                >${data?.location?.toLowerCase() || ""}
                <u
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u
                ></span
              >
            </p>
          </div>
        </div>
      </div>

      <div style="margin-top: 20pt">
        <div style="height: 70pt">
          <h3>Nature Of Job:</h3>
          <span>${data.NATURE_OF_JOB || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Present Complaints:</h3>
          <span>${data.PRESENT_COMPLAINTS || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Physical Activity</h3>
          <span>${data.PHYSICAL_ACTIVITY || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Personal History:</h3>
          <span>${data.PERSONAL_HISTORY || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Family History:</h3>
          <span>${data.FAMILY_HISTORY || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Personal History:</h3>
          <span>${data.PERSONAL_HISTORY || ""}</span>
        </div>
        <div style="height: 70pt">
          <h3>Habit:</h3>
          <span>${data.smoking === true ? "smoking, " : ""}</span>
          <span>${data.alchohol === true ? "alchohol, " : ""}</span>
          <span>${data.panChewing === true ? "panChewing, " : ""}</span>
          <span>${data.drugAddiction === true ? "drugAddiction" : ""}</span>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <div
      style="
            border: 1px solid black;
            padding-inline: 30px;
            padding-block: 20px;
            margin: 20px;
            min-height: 140vh;
            "
    >
      <div>
        <div style="height: 70pt">
          <h3>Physical Measurement</h3>
          <br />
          <table style="border-collapse: collapse; margin-left: 30.82pt">
            <tr style="height: 28pt">
              <td style="width: 115pt">
                <p
                  class="s4"
                  style="padding-left: 2pt; text-indent: 0pt; text-align: left"
                >
                  Height:
                  <span style="padding-left:10px">${
                    data.height || ""
                  }${" "} Cms</span>
                </p>
              </td>
              <td style="width: 76pt">
                <p
                  class="s4"
                  style="
                          padding-left: 6pt;
                          text-indent: 0pt;
                          text-align: center;
                        "
                >
                  
                </p>
              </td>
              <td style="width: 66pt">
                <p style="text-indent: 0pt; text-align: left"><br /></p>
              </td>
              <td style="width: 43pt">
                <p style="text-indent: 0pt; text-align: left"><br /></p>
              </td>
              <td style="width: 210pt">
                <p
                  class="s4"
                  style="
                          padding-left: 3pt;
                          padding-right: 5pt;
                          text-indent: 6pt;
                          text-align: left;
                        "
                >
                  Chest on Expiration:
                  <span style="padding-left:10px"
                    >${data.chestExpiration || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 30pt">
              <td style="width: 115pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 2pt;
                          text-indent: 0pt;
                          text-align: left;
                        "
                >
                  Weight:
                  <span style="padding-left:10px">${
                    data.weight || ""
                  }${" "} Kgs</span>
                </p>
              </td>
              <td style="width: 76pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 6pt;
                          padding-right: 2pt;
                          text-indent: 0pt;
                          text-align: center;
                        "
                >
                 
                </p>
              </td>
              <td style="width: 66pt">
                <p style="text-indent: 0pt; text-align: left"><br /></p>
              </td>
              <td style="width: 43pt">
                <p style="text-indent: 0pt; text-align: left"><br /></p>
              </td>
              <td style="width: 210pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 2pt;
                          padding-right: 5pt;
                          text-indent: 7pt;
                          text-align: left;
                        "
                >
                  Chest on Inspiration:
                  <span style="padding-left:10px"
                    >${data.chestInspiration || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 15pt">
              <td style="width: 115pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 2pt;
                          text-indent: 0pt;
                          line-height: 13pt;
                          text-align: left;
                        "
                >
                  Abdominal Girth:
                  <span style="padding-left:10px"
                    >${data.abdominalGirth || ""}</span
                  >
                </p>
              </td>
              <td style="width: 76pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 6pt;
                          padding-right: 4pt;
                          text-indent: 0pt;
                          line-height: 13pt;
                          text-align: center;
                        "
                >
                  Cms
                </p>
              </td>
              <td style="width: 66pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 22pt;
                          text-indent: 0pt;
                          line-height: 13pt;
                          text-align: left;
                        "
                >
                  Hips:
                  <span style="padding-left:10px">${data.hips || ""}</span>
                </p>
              </td>
              <td style="width: 43pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-left: 18pt;
                          text-indent: 0pt;
                          line-height: 13pt;
                          text-align: left;
                        "
                >
                  Cms
                </p>
              </td>
              <td style="width: 110pt">
                <p
                  class="s4"
                  style="
                          padding-top: 1pt;
                          padding-right: 2pt;
                          text-indent: 0pt;
                          line-height: 13pt;
                          text-align: right;
                        "
                >
                  BMI:
                  <span style="padding-left:10px">${data.bmi || ""}</span>
                  <span style="padding-left:10px">kg/m2</span>
                </p>
              </td>
            </tr>
          </table>

          <div
            style="
                    margin-block: 10pt;
                    border: 1px solid black;
                    width: 93%;
                    margin-left: 20px;
                    margin-right: 20px;
                  "
          ></div>

          <div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 63pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Eye<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 68pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Vision
                  </p>
                </td>
                <td style="width: 103pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Right
                  </p>
                </td>
                <td style="width: 81pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 39pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Left
                  </p>
                </td>
                <td style="width: 105pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 29pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Colour Vision:
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 63pt">
                  <p style="text-indent: 0pt; text-align: left"><br /></p>
                </td>
                <td style="width: 68pt">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    Near
                  </p>
                  <p
                    class="s4"
                    style="padding-top: 5pt; text-indent: 0pt; text-align: left"
                  >
                    Far
                  </p>
                </td>
                <td style="width: 103pt">
                  <p
                    class="s4"
                    style="
                            padding-top: 3pt;
                            padding-left: 1pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    ${data.nearRightEyeSight || ""}
                  </p>
                  <p
                    class="s4"
                    style="
                            padding-top: 5pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    ${data.farRightEyeSight || ""}
                  </p>
                </td>
                <td style="width: 81pt">
                  <p
                    class="s4"
                    style="
                            padding-top: 3pt;
                            padding-left: 10pt;
                            padding-right: 4pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    ${data.nearLeftEyeSight || ""}
                  </p>
                  <p
                    class="s4"
                    style="
                            padding-top: 5pt;
                            padding-left: 10pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    ${data.farLeftEyeSight || ""}
                  </p>
                </td>
                <td style="width: 155pt">
                  <p
                    class="s4"
                    style="
                            padding-top: 3pt;
                            padding-left: 25pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Without Glasses : ${
                      data.eyeSightWithGlasses === true
                        ? "No"
                        : data.eyeSightWithGlasses === false
                        ? "Yes"
                        : ""
                    }
                  </p>
                  <p
                    class="s4"
                    style="
                            padding-top: 5pt;
                            padding-left: 25pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Without Glasses : ${
                      data.eyeSightWithGlasses === true
                        ? "No"
                        : data.eyeSightWithGlasses === false
                        ? "Yes"
                        : ""
                    }
                  </p>
                </td>
              </tr>
              <tr style="height: 18pt">
                <td style="width: 63pt" colspan="5">
                  <p
                    class="s5"
                    style="
                            padding-top: 3pt;
                            padding-left: 2pt;
                            text-indent: 0pt;
                            line-height: 13pt;
                            text-align: left;
                          "
                  >
                    Comments:
                    <span class="s4">${data.comment || ""}</span>
                  </p>
                </td>
              </tr>
            </table>

            <div
              style="
                      margin-block: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <br />
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 63pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    ENT<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 68pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Ears:
                  </p>
                </td>
                <td style="width: 103pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Nose:
                  </p>
                </td>
                <td style="width: 81pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 39pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Throat:
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 63pt">
                  <p style="text-indent: 0pt; text-align: left"><br /></p>
                </td>
                <td style="width: 68pt">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    Tonsils:
                  </p>
                </td>

                <td style="width: 103pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Teeth:
                  </p>
                </td>
                <td style="width: 81pt"></td>
              </tr>
            </table>
            <div
              style="
                      margin-bottom: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>

            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 100%" colspan="3">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Systemic Examination
                  </p>
                </td>
              </tr>
              <tr style="height: 17pt">
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Respiratory System:
                    <span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Rate:<span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 39pt;
                            text-indent: 0pt;
                            text-align: left;
                          "
                  >
                    Auscultation:<span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 130pt" colspan="3">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    X-Ray Chest:
                    <span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-bottom: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 140pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Cardio Vascular System:<span class="s4">:</span>
                  </p>
                </td>
                <td
                  style="
                          width: 200pt;
                          display: flex;
                          justify-content: space-between;
                        "
                >
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Pulse:
                    <span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: right;
                          "
                  >
                    per min
                  </p>
                </td>
              </tr>
              <tr style="height: 17pt">
                <td style="width: 140pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left"></p>
                </td>
                <td
                  style="
                          width: 200pt;
                          display: flex;
                          justify-content: space-between;
                        "
                >
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    BP:
                    <span class="s4" style="text-indent: 0pt; text-align: left"
                      >${data.bp || ""}${" "} </span
                    >
                  </p>
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: right;
                          "
                  >
                mm of Hg
                  </p>
                </td>
              </tr>
              <tr style="height: 17pt">
                <td style="width: 140pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left"></p>
                </td>
                <td
                  style="
                          width: 200pt;
                          display: flex;
                          justify-content: space-between;
                        "
                >
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Heart Sounds:
                    <span
                      class="s4"
                      style="text-indent: 0pt; text-align: left"
                    ></span>
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-block: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 100pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Per Abdomen:<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Liver:
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Spleen:
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 100pt">
                  <p style="text-indent: 0pt; text-align: left"><br /></p>
                </td>
                <td style="width: 130pt" colspan="2">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    Kidney:
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-block: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 150pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Central Nervous System:<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Reflex:
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Sensation:
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 150pt">
                  <p style="text-indent: 0pt; text-align: left"><br /></p>
                </td>
                <td style="width: 130pt" colspan="2">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    Physiological make up:
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-bottom: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 25pt">
                <td style="width: 150pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Genito Urinary System:<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Hyrocoele:
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Hernia:
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-block: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 150pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Central Nervous System:<span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Reflex:
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Sensation:
                  </p>
                </td>
              </tr>
              <tr style="height: 40pt">
                <td style="width: 150pt">
                  <p style="text-indent: 0pt; text-align: left"><br /></p>
                </td>
                <td style="width: 130pt" colspan="2">
                  <p
                    class="s4"
                    style="padding-top: 3pt; text-indent: 0pt; text-align: left"
                  >
                    Physiological make up:
                  </p>
                </td>
              </tr>
            </table>
            <div
              style="
                      margin-bottom: 10pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <table style="border-collapse: collapse; margin-left: 5.62pt">
              <tr style="height: 17pt">
                <td style="width: 150pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left">
                    Musculo Skeletal System : <span class="s4">:</span>
                  </p>
                </td>
                <td style="width: 130pt">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Spine:
                  </p>
                </td>
                <td style="width: 130pt">
                  <p
                    class="s4"
                    style="
                            padding-left: 14pt;
                            padding-right: 16pt;
                            text-indent: 0pt;
                            text-align: center;
                          "
                  >
                    Joints:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="width: 150pt">
                  <p class="s5" style="text-indent: 0pt; text-align: left"></p>
                </td>
                <td style="width: 130pt" colspan="2">
                  <p class="s4" style="text-indent: 0pt; text-align: left">
                    Muscle Tone:
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <div
      style="
            
              border: 1px solid black;
              padding-inline: 30px;
              padding-block: 20px;
              margin: 20px;
              min-height: 140vh;

             
            "
    >
      <div>
        <div>
          <div style="height: 30pt">
            <h3>Other Findings:</h3>
            <span class="s4"></span>
          </div>
          <div>
            <h3>Remarks & Advice:</h3>
            <span class="s4"></span>
            <div
              style="
                      margin-block: 5pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
            <div style="height: 50pt"></div>
            <div
              style="
                      margin-block: 5pt;
                      border: 1px solid black;
                      width: 93%;
                      margin-left: 20px;
                      margin-right: 20px;
                    "
            ></div>
          </div>

          <div style="height: 70pt">
            <h3>Reports:</h3>
            <span class="s4"></span>
          </div>
          <div style="height: 70pt">
            <h3>PFT:</h3>
            <span class="s4"
              ></span
            >
          </div>
          <div style="height: 70pt">
            <h3>Blood:</h3>
            <span class="s4"
              ></span
            >
          </div>
          <div style="height: 70pt">
            <h3>ECG:</h3>
            <span class="s4"
              ></span
            >
          </div>
          <div style="height: 70pt">
            <h3>Audiometry:</h3>
            <span class="s4"
              ></span
            >
          </div>
        </div>
      </div>
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
    formData.append("file", pdfBlob, `${data.empId}_Annexture_report.pdf`);
    // const url2 = URL.createObjectURL(pdfBlob);
    // window.open(url2, "_blank");
    const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=CONSOLIDATED_REPORT&corpId=872cd841-9f7a-432d-b8e9-422b780bca10&campCycleId=252188`;
    // const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=CONSOLIDATED_REPORT&corpId=5cc0376c-1038-4260-9fc3-ee553bfc33b1&campCycleId=`;

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
    // Fetch employees from the API starting from the currentIndex
    const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=872cd841-9f7a-432d-b8e9-422b780bca10&campCycleId=252188`;
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=5cc0376c-1038-4260-9fc3-ee553bfc33b1&campCycleId=`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      setList(result.data);
      setTotalEmployees(result.data.length);
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
    // Fetch employees from the API starting from the currentIndex
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=5cc0376c-1038-4260-9fc3-ee553bfc33b1&toDeletefiletype=CONSOLIDATED_REPORT&empId=${data.empId}`;
    const result = await updateData(url);
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

  return (
    <div>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <span>Total Employees: {totalEmployees}</span> <br />
        <span>Uploaded Files: {uploadedCount}</span> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <span key={index}>{item.name}</span>
            <a href={item.consolidatedReportUrl}>
              <span key={index}>{item.consolidatedReportUrl}</span>
            </a>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuzlonForm;
