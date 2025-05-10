import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";
import { uploadFile } from "../assets/services/PostApiCall";
import { EmployeeList } from "./RebelData";

const updatedDataArray = [
  {
    sno: 1,
    name: "BHUPENDRA TANWAR",
    empId: "20867",
    gender: "M",
    age: 28,
    mobileNo: 9993649785,
    dateOfCamp: "1/4/25",
    bp: "110/60",
    height: 173,
    weight: 69.36,
    hip: 39,
    waist: 31,
    spo2Percent: 93,
    farRightEyeSight: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 23.1,
    heartRate: 78,
  },
  {
    sno: 2,
    name: "VIJAY",
    empId: "49941",
    gender: "M",
    age: 35,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "130/90",
    height: 168,
    weight: 98.1,
    hip: 47,
    waist: 38,
    spo2Percent: 88,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 34.7,
    heartRate: 92,
  },
  // {
  //   sno: 3,
  //   name: "DEEPIKA",
  //   empId: "50264",
  //   gender: "F",
  //   age: "",
  //   mobileNo: "",
  //   dateOfCamp: "",
  //   bp: "",
  //   height: "",
  //   weight: "",
  //   hip: "",
  //   waist: "",
  //   spo2Percent: "",
  //   Eye: "",
  //   colourVision: "",
  //   bmi: "",
  //   heartRate: "",
  // },
  {
    sno: 4,
    name: "POOJA",
    empId: "50884",
    gender: "F",
    age: 30,
    mobileNo: 6264238578,
    dateOfCamp: "1/4/25",
    bp: "100/70",
    height: 161,
    weight: 44.81,
    hip: 36,
    waist: 27,
    spo2Percent: 92,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 17.3,
    heartRate: 88,
  },
  {
    sno: 5,
    name: "REENA",
    empId: "60416",
    gender: "F",
    age: 29,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "120/80",
    height: 159,
    weight: 44.36,
    hip: 34,
    waist: 26,
    spo2Percent: 90,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 17.7,
    heartRate: 77,
  },
  {
    sno: 6,
    name: "SONU",
    empId: "69913",
    gender: "F",
    age: 29,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "110/70",
    height: 148,
    weight: 44.55,
    hip: 33,
    waist: 24,
    spo2Percent: 78,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 20.5,
    heartRate: 81,
  },
  {
    sno: 7,
    name: "SHIVANI",
    empId: "62006",
    gender: "F",
    age: 20,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "110/70",
    height: 151,
    weight: 49.7,
    hip: 34,
    waist: 26,
    spo2Percent: 92,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 21.8,
    heartRate: 89,
  },
  {
    sno: 8,
    name: "JITENDRA",
    empId: "55633",
    gender: "M",
    age: 25,
    mobileNo: 9340172035,
    dateOfCamp: "1/4/25",
    bp: "140/90",
    height: 163,
    weight: 55.9,
    hip: 34,
    waist: 26,
    spo2Percent: 83,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 21,
    heartRate: 82,
  },
  {
    sno: 9,
    name: "MAHESH",
    empId: "69507",
    gender: "M",
    age: 20,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "110/70",
    height: 161,
    weight: 47.02,
    hip: 34,
    waist: 25,
    spo2Percent: 85,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 18.1,
    heartRate: 86,
  },
  {
    sno: 10,
    name: "MANAS",
    empId: "76923",
    gender: "M",
    age: 21,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "140/80",
    height: 175,
    weight: 74.33,
    hip: 38,
    waist: 29,
    spo2Percent: 89,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 24.3,
    heartRate: 99,
  },
  {
    sno: 11,
    name: "SAMRATH",
    empId: "77783",
    gender: "M",
    age: 19,
    mobileNo: 7489774813,
    dateOfCamp: "1/4/25",
    bp: "110/80",
    height: 168,
    weight: 47.88,
    hip: 33,
    waist: 24,
    spo2Percent: 88,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 17,
    heartRate: 91,
  },
  {
    sno: 12,
    name: "SANJANA",
    empId: "77695",
    gender: "F",
    age: 21,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "100/70",
    height: 150,
    weight: 45,
    hip: 32,
    waist: 25,
    spo2Percent: 91,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 20,
    heartRate: 92,
  },
  {
    sno: 13,
    name: "NIDHI",
    empId: "80364",
    gender: "F",
    age: 21,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "150/90",
    height: 144,
    weight: 61.06,
    hip: 36,
    waist: 28,
    spo2Percent: 96,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 29.4,
    heartRate: 114,
  },
  // {
  //   sno: 14,
  //   name: "DEEPAK",
  //   empId: "81001",
  //   gender: "M",
  //   age: "",
  //   mobileNo: "",
  //   dateOfCamp: "",
  //   bp: "",
  //   height: "",
  //   weight: "",
  //   hip: "",
  //   waist: "",
  //   spo2Percent: "",
  //   Eye: "",
  //   colourVision: "",
  //   bmi: "",
  //   heartRate: "",
  // },
  {
    sno: 15,
    name: "SUNIL",
    empId: "81760",
    gender: "M",
    age: 21,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "130/90",
    height: 164,
    weight: 54.15,
    hip: 37,
    waist: 26,
    spo2Percent: 94,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 20.1,
    heartRate: 93,
  },
  {
    sno: 16,
    name: "JITENDRA",
    empId: "33560",
    gender: "M",
    age: 32,
    mobileNo: 9098765650,
    dateOfCamp: "1/4/25",
    bp: "120/70",
    height: 173,
    weight: 57.64,
    hip: 38,
    waist: 27,
    spo2Percent: 91,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 19.3,
    heartRate: 95,
  },
  {
    sno: 17,
    name: "sachin",
    empId: "50698",
    gender: "M",
    age: 29,
    mobileNo: 7217160531,
    dateOfCamp: "1/4/25",
    bp: "120/80",
    height: 186,
    weight: 59,
    hip: 39,
    waist: 28,
    spo2Percent: 97,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 17.1,
    heartRate: 80,
  },
  {
    sno: 18,
    name: "Ramkumar Narbariya",
    empId: "54643",
    gender: "M",
    age: 26,
    mobileNo: 7024477438,
    dateOfCamp: "1/4/25",
    bp: "120/70",
    height: 178,
    weight: 68.7,
    hip: 40,
    waist: 28,
    spo2Percent: 89,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 21.7,
    heartRate: 78,
  },
  {
    sno: 19,
    name: "ravi kothal",
    empId: "29236",
    gender: "M",
    age: 33,
    mobileNo: 8889904888,
    dateOfCamp: "1/4/25",
    bp: "110/70",
    height: 188,
    weight: 56.11,
    hip: 38,
    waist: 29,
    spo2Percent: 89,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 15.9,
    heartRate: 82,
  },
  {
    sno: 20,
    name: "Maharaj",
    empId: "81241",
    gender: "M",
    age: 36,
    mobileNo: "",
    dateOfCamp: "1/4/25",
    bp: "120/80",
    height: 180,
    weight: 52.28,
    hip: 37,
    waist: 28,
    spo2Percent: 83,
    Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
    colourVision: "Normal",
    bmi: 16.4,
    heartRate: 62,
  },
  // {
  //   sno: 21,
  //   name: "Ankit",
  //   empId: "1022062",
  //   gender: "",
  //   age: "",
  //   mobileNo: "",
  //   dateOfCamp: "",
  //   bp: "",
  //   height: "",
  //   weight: "",
  //   hip: "",
  //   waist: "",
  //   spo2Percent: "",
  //   Eye: "",
  //   colourVision: "",
  //   bmi: "",
  //   heartRate: "",
  // },
  // {
  //   sno: 22,
  //   name: "Mohnish Rawal",
  //   empId: "7594",
  //   gender: "M",
  //   age: 33,
  //   mobileNo: 8959894044,
  //   dateOfCamp: "1/4/25",
  //   bp: "130/70",
  //   height: 172,
  //   weight: 81.5,
  //   hip: 41,
  //   waist: 39,
  //   spo2Percent: 97,
  //   Eye: "Far( R-6/6   L-6/9 ) Near ( R- N/6   L-N/6)",
  //   colourVision: "Normal",
  //   bmi: 27.4,
  //   heartRate: 94,
  //   farLeftEyeSight: "6/9",
  //   farRightEyeSight: "6/6",
  //   nearLeftEyeSight: "N/6",
  //   nearRightEyeSight: "N/6",
  // },
  // {
  //   sno: 23,
  //   name: "Rupali",
  //   empId: "65296",
  //   gender: "F",
  //   age: 27,
  //   mobileNo: 9111316568,
  //   dateOfCamp: "1/4/25",
  //   bp: "120/80",
  //   height: 151,
  //   weight: 50,
  //   hip: 28,
  //   waist: 35,
  //   spo2Percent: 98,
  //   Eye: "Far( R-6/9   L-6/6 ) Near ( R- N/6   L-N/6)",
  //   colourVision: "Normal",
  //   bmi: 21.9,
  //   heartRate: 82,
  //   farLeftEyeSight: "6/9",
  //   farRightEyeSight: "6/6",
  //   nearLeftEyeSight: "N/6",
  //   nearRightEyeSight: "N/6",
  // },
  // {
  //   sno: 24,
  //   name: "Anita",
  //   empId: "20187",
  //   gender: "F",
  //   age: 44,
  //   mobileNo: "",
  //   dateOfCamp: "1/4/25",
  //   bp: "130/100",
  //   height: 149,
  //   weight: 60.6,
  //   hip: 37,
  //   waist: 29,
  //   spo2Percent: 92,
  //   Eye: "Far( R-6/18   L-6/18 ) Near ( R- N/12   L-N/12)",
  //   colourVision: "Normal",
  //   bmi: 27,
  //   heartRate: 100,
  //   farLeftEyeSight: "6/18",
  //   farRightEyeSight: "6/18",
  //   nearLeftEyeSight: "N/12",
  //   nearRightEyeSight: "N/12",
  // },
  // {
  //   sno: 25,
  //   name: "Sonali",
  //   empId: "82052",
  //   gender: "F",
  //   age: 20,
  //   mobileNo: 9479873832,
  //   dateOfCamp: "1/4/25",
  //   bp: "130/70",
  //   height: 153,
  //   weight: 54,
  //   hip: 37,
  //   waist: 30,
  //   spo2Percent: 98,
  //   Eye: "Far( R-6/9   L-6/24 ) Near ( R- N/6   L-N/6)",
  //   colourVision: "Normal",
  //   bmi: 23.1,
  //   heartRate: 94,
  //   farLeftEyeSight: "6/24",
  //   farRightEyeSight: "6/9",
  //   nearLeftEyeSight: "N/6",
  //   nearRightEyeSight: "N/6",
  // },
  // {
  //   sno: 26,
  //   name: "Virendra",
  //   empId: "RF01",
  //   gender: "M",
  //   age: 21,
  //   mobileNo: 7307544335,
  //   dateOfCamp: "1/4/25",
  //   bp: "120/80",
  //   height: 170,
  //   weight: 58,
  //   hip: 38,
  //   waist: 27,
  //   spo2Percent: 89,
  //   Eye: "Far( R-6/6   L-6/6 ) Near ( R- N/6   L-N/6)",
  //   colourVision: "Normal",
  //   bmi: 20.1,
  //   heartRate: 64,
  //   farLeftEyeSight: "6/6",
  //   farRightEyeSight: "6/6",
  //   nearLeftEyeSight: "N/6",
  //   nearRightEyeSight: "N/6",
  // },
];

const RebelMERForm = ({
  corpId = "dd491d3b-8a1b-493a-99cf-730fafa7c468",
  campCycleId = "246327",
  fileType = "CONSOLIDATED_REPORT",
  corpName = "Rebel Foods Pvt. Ltd",
  campDate = "22 March 2025",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const PHYSICAL_FITNESS_FORM = `

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
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 30pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #c0c0c0;
                "
                colspan="3"
              >
                <p
                  class="s1"
                  style="
                    padding-top: 9pt;
                    padding-left: 122pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Health Check Up Form - MER
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
                colspan="3"
              >
                <p
                  class="s2"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  GENERAL INFORMATION
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 44pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Name
                </p>
              </td>
              <td
                style="
                  width: 270pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><span style="text-transform: capitalize; font-weight: 400"
                    >${data?.name?.toLowerCase() || ""}</span
                  ></p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 6pt;
                    padding-left: 8pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Employee ID:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.empId || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Age and Gender:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.age ? data?.age + " " + "Years" : ""} ${
      data?.gender?.toLowerCase() || ""
    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Date of Health check-up:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${campDate}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 22pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
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
                  Contact Number:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.mobileNo || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
                colspan="2"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Vaccine
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Remark
                </p>
              </td>
            </tr>
            <tr style="height: 23pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p class="s3" style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  Bio Typh (Bio-Med Private Limited)
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p class="s3" style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  Batch Number: T021024
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 3pt;
                    padding-left: 1pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Date of Expiry: <span style="text-transform: capitalize; font-weight: 400"
                    >${"March, 2027"}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
                colspan="3"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Vitals
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Height
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.height ? data?.height + " " + "cm" : ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Weight
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.weight ? data?.weight + " " + "kg" : ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  BMI
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.bmi ? data?.bmi : ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Waist Hip Ratio
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.waistGirth && data?.hipGirth
                        ? (data?.waistGirth / data?.hipGirth).toFixed(2)
                        : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Blood Pressure
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.bp ? data?.bp + " " + "mmHg" : ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Heart Rate
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.pulseRate ? data?.pulseRate : ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  SPO2
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.spO2Percent ? data?.spO2Percent + " " + "%" : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
          </table>
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 20pt">
              <td
                style="
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
                colspan="4"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Eye Vision
                </p>
              </td>
            </tr>
            <tr style="height: 29pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Left Eye
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"></p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 1pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Right Eye
                </p>
              </td>
            </tr>
            <tr style="height: 20pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.nearLeftEyeSight ? data?.nearLeftEyeSight : ""
                    }</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Near Vision
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.nearRightEyeSight ? data?.nearRightEyeSight : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 21pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.farLeftEyeSight ? data?.farLeftEyeSight : ""}</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Distance Vision
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.farRightEyeSight ? data?.farRightEyeSight : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 25pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      ""
                      // data?.colourVision ? data?.colourVision : ""
                      // updatedDataArray.find(
                      //   (item) => item.empId === data?.empId
                      // )?.colourVision
                      //   ? updatedDataArray.find(
                      //       (item) => item.empId === data?.empId
                      //     )?.colourVision
                      //   : ""
                    }</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Colour Vision-
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.colourVision ? data?.colourVision : "NORMAL"}</span
                  >
                </p>
              </td>
            </tr>
          </table>
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 25pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Skin Examination
                </p>
              </td>
            </tr>
            <tr style="height: 25pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Remark: NORMAL
                </p>
              </td>
            </tr>
            <tr style="height: 38pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s2"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 15pt;
                    text-align: left;
                  "
                >
                  Doctor Consultation with Fitness certificate:
                </p>
              </td>
            </tr>
          </table>
         </div>
      </body>
    </html>
    
    `;

    const pdfBlob = await html2pdf()
      .from(PHYSICAL_FITNESS_FORM)
      .output("blob")
      .then((data) => {
        return data;
      });

    // const url = URL.createObjectURL(pdfBlob);
    // window.open(url, "_blank");

    const formData = new FormData();
    formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);
    // formData.append("file", pdfBlob, `${data.empId}_physical_fitness_form.pdf`);

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

      const empIDS = ["83625", "82985", "83598", "83305"];

      const temp = result?.data.filter((item) => empIDS.includes(item.empId));

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

            {fileType === "FITNESS_CERTIFICATE" ? (
              <a href={item.fitnessCertificateUrl}>
                <div key={index}>{item.fitnessCertificateUrl}</div>
              </a>
            ) : (
              <a href={item.consolidatedRUrl}>
                <div key={index}>{item.consolidatedRUrl}</div>
              </a>
            )}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RebelMERForm;
