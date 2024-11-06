import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";

const GrasimAgencyStaff = ({
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

  const generatePDF = async (data, index) => {
    const content = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        font-family: Calibri, sans-serif;
        margin: 0;
        padding: 0;
      }
      /* Container styling for A4 layout */
      .container {
        display: flex;
        flex-direction: column;
        height: 297mm;
        width: 210mm;
        padding: 20mm;
        box-sizing: border-box;
        justify-content: space-between;
      }
      /* Section styling */
      .section {
        padding: 10px;
        font-size: 12px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%">
     <div style="border: 1px solid #000">
        <div class="section" style="display: flex">
          <img
            style="height: 50px; width: 50px"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAtCAMAAADiBnmWAAADAFBMVEUAAABjBQYVi0bKiDRLHh6dYCI8ZUqLXV1+vpm2NDFYGxldpW9/BQfhQimqAFU+oGbeuTb/gACvRBzobyeZERKnRUKy2ML1ml+MHyH/tLRGm1+QFxbVHyRVDAi0ciWHuZaUKS3ZWicmZ0acIhv2iyz3tn1qLyugdG+SJhTMRiKtTk62GRtjsoVrrHmkJivzeigrkFTP5tiaJSfgW0WnYzHJOibxiUupICO1MiGvZmD//wCAAACzcW/pxkX22VntXCaPCw3gfz2RMyahExX/AACgJym0SzuAKCmZWWDDYCOWy62GOxmGTFLfRDP////woFnQrC5qHR2cMTRVqqr4r3t0GBWlMzXyw1KXZVxJhGk9llxKpXEaiUjNaETqlVPxbyZ9KirpZybtoT2fIiTtfkzXLyjlu0TGUFCyNTNrJCbKJyCZKSx2Hxy2dStzCArrxFDeUSWpcmujNRxiCwzlWyXLSDJqamqrUS+wICCqFhebGxaTDhHDNB6ZMC/zz1TQaGOmOzfZ6+LxejqyJh6XRELBTUn0gi2jNTKfQGAwllj12G7apjzbNSr1k0meHCVqm3q1SkqICgufKCofkE7KfjfymldWEg/iUj23WjexMzO93cvjaDa/YmDcly+uMzfxcTGnODijYWCLIR/VJyeYIiaygXOjHBfyijyoIxqNJivebzTvYSfkuVF2uYCpMSmKxKOQNDWUEhLrz0fLcCaZZjNtt4zwaCX1omnzey5yPDS5VieqJirxxF3xhTmTIyS0VVVUqniiayR2Mi6OHByvLzFzIyVaim/nVCfszlJ6GxCi0LalHSPmZCa6RSwol1edEhNiGhkaiUeyUlCBHx7HWyzCOCz1lVKqOkJtDhDISDx3uYVmDxHZZinvqEraHyS7UzqqJi2YLzG6OTbAGxzyj0+zPCpwLittpJLSbzuze2u3TkoycFHdrz8Zjkq8JSB+EAypKSDOTiZ1r4rk8Okzml5So2qcKSxrBQfaOiylFBbelkTbJyfbrDLZSiKsY1zydSjHL8quAAABAHRSTlMAuv//EbUmC/+2aEf//wP+/wL///8y/+GGA3O6/0L/Kz7/V///4BAR//9D//+Nav/x/9D/Xf/vT/8WAQL///////9+/wHw5Ego//+3G/8F//9qRgPgKZP/JjB6///h//89//+04P//NFlT/3zvtbr//yP/hP//DOsI/////77/Meb///9pVf/PCO3/////hycb/6b+/+Aw/+0k//8Y/3r/tifw/48i////W////4/4/3////8F///h/xL/yf//pwf/tycJkzQj//+6/6f/////R/8teP//6kKE/5F2////6Fqqc//g/0IO/yFKUv///////yP/+3CQuv///////yj/R5gRjAAABgZJREFUeNqN03tYU2UcB/ADdqGChnKcWjMz8Aq1gCws3RmexEaSZirWyDloU/EC6lZto8WlzZTNHKjoUFFnY3pQHLYxFRRJHdJkpvAkaPOClNomEIQssPV7D0L80/P43RnPOe/74bf3djAMm4Cduqeaim2+tFSlWjr5iY8mj5qAQS6p7mGbh09V3fvg1CV4/HY2aty559iPUSui5t3YPS8vZd6KLtVJbOESaN90MmXFW/vnRe3P2/ETPN7rQnjZ4SVfpmAvd93YjS3bhD0dlVm9M3MkwmfOXAZ88+sUGp+JOgZ/90zLA/zLQoQBvdaF3ZqWOR7w/pF5gGfOnIXwzvV7DmDY0q++iao+oVo/6xFetnBUypGTB1DlWzcB5x3I23FCNXz3zSMnMezstndGb7t6dfbbC5a8Wz166NCzv42/iFUvx4ZevPrhhAUXq5f/8Cx0X1w+/vnln2OX467HZX46orx8fvn8+ePG0d/y8hEo5Shbb2+9ffuz63FxcesXYVdaFVyu7nhYGFvtY6Oo2baw+hCKoKwCiFAYYiWIKSZZePO+Rdg6s0LB1U08aPOxfQLgAquPbW9xC6xWq4CihA6HxCF5aPKSsnDAV8w4rgsMXFtUZGP3YcpuaHEnUxRlpRyEROJwOGKMpLcfKwC31ttsNjWtqR7Dhdw0LWW1UkKh0CGRPDR6wfZhEtdB1h60QWl2mJqtcRku9KYpiwVWYYhQKJGk50Bhbx+WkzhXB3Osz7bZfGp1mN0FODhNqbSFCENChBL7FKOcJI19w5A7ubAe3MCJsZVqtU1tdblcPdLe6RxOopDG6TkmuRN/NMFQVFkHK3JcC1ggcrEAB4uVyppkwA5JRpvRaabxXsBeHBYPromx2TZ1UE8PiyWS9oprlDU1sTDo9JhQM1R2evsx7sShcuCwN212jcZgMIiku8TKtLSaEl+IoztGDnWdpEy27x/ATggaSmDrncLubqRF0lxxTVpJSYk7JL2hTW42406SpLEcB+wlUem10UEJGpHIoJH2lnEAi4N3aVpMCJBwoWHIZTJYcy8OK5LRWJDQDVojDS6Dym733F3XYHowTK+XJOnKgEmvE8aRIZkSXZCg0dC4bLrY3Ts3OTsGlgLKomGggySTkSgKE2GXNEQXaILshfVrhw1xi925u7RFEhLNH0cT3Iuwl0QTMNoJwtHeWFgEO8PTmeEkDsnVZhdRD9GccC+9zutwGQnLSMokBOD09uLKSnUlT6FAx6tdWwSHLwOHjfCGN698D7tsJgErnJMIgiKCXKkHtaB5CgBcb0EQAZgygZXJWleuwWZcG2uCY5SDmoNYLNaUYm0xqgxb2h0tEhHwvkicuLl14tgvvgdcWXxNLicIq9UO1sWqn1NZyeNC4fsFCSKWRgDvTHtr6EPCuh1hH1udPacQpidioWTEaosB486g6G4Dy2D3XeMdPWqHH6Yxm+1L3LixIjaox0XrSYu1PIWTTEWFYeuPvzQ3WGyDCSE8ViBI5nA4Gzcebu6Bs8xipd6ZAzg8oaAb6H3nS9Nhg6ZbKeL6XWxGOlWUCJiT23bY1EzXzljMU5AG2MvUHHOgLrQMkpZM9FWmShKVgLcojDEtoc1QO7X+KB5eUNDQhqN3wuwGnJhYbN0Olcf+WkHj406jKUbaAtVdGTy8pzHHrKAPI3dIYplSmViRjfDfnIoKhC/I5aachgZpY9t917BmoHBevCSc5S1KJUcJfPsa7I1Vq07TOe/3wK8vq1985ryf34PVq1c/gPi9/ySd06vuYs8damqCq+nQ/6epL6+ewz7x+D9mkj7GXsj39IcfX1rXWWrx+FdVeRjxfEYVI8Kfzx/ofn0wrorkWyx8Zm2EJ5LpqQ2IsJQGRHqY8f4D+NwgHF+Vz2DwOzr4VbXMTn4Ww1IanxURyfwPfzcIlwYw9B1V0BuflRXg4estpUxLR4A+fxD+a+ChLpIZGcCvrbXo6zr1TL3eUquvy2IwO/v7N/w5CHs8jE7//Lr8ujr4x3xGPrqBz0D/hjFYU1LSz48CdwP36C6JzkBL5xjsqVceN3/8/i9Lo9hmK05ecAAAAABJRU5ErkJggg=="
          />
          <div style="font-size: 14px; font-weight: bold; width: 100%">
            <div style="text-align: center; background-color: #dbe5f1">
              GRASIM INDUSTRIES LIMITED - CHEMICAL DIVISION, Nagda
            </div>

            <div style="text-align: center; background-color: #fde9d9">
              PERIODIC MEDICAL EXAMINATION RECORD - Agency staff
            </div>
            <div style="text-align: center; background-color: #ffffff">
              FORMAT NO.: OHC-04 (Rev. no. 01, Revised on 15.01.2020)
            </div>
          </div>
        </div>
      </div>

      <table
        style="
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          font-weight: bold;
        "
      >

 <tr>
          <td  style="border: 1px solid black; padding: 8px">
            Name: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.name?.toLowerCase() || ""}</span
              >
          </td>
          <td   style="border: 1px solid black; padding: 8px">Age: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.age || ""}</span
              ></td>

             <td style="border: 1px solid black; padding: 8px">Gender: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.gender || ""}</span
              ></td>
              
          <td style="border: 1px solid black; padding: 8px">
            Date of examination: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.vitalsCreatedDate || ""}</span
              >
          </td>
        </tr>
        <tr>
         
          <td  style="border: 1px solid black; padding: 8px">Father's Name: <span style="text-transform: capitalize; font-weight: 400;"
                > ${data?.fathersName?.toLowerCase() || ""}</span
              ></td>
          <td colspan="2"  style="border: 1px solid black; padding: 8px">
            ESIC No.: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.empId || ""}</span
              >
          </td>
            <td style="border: 1px solid black; padding: 8px">
            Date of Joining: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.dateOfJoining || ""}</span
              >
          </td>
        </tr>

          <tr>
          <td colspan="3" style="border: 1px solid black; padding: 8px">
            Agency / Contractor: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.contractorName?.toLowerCase() || ""}</span
              >
          </td>
          <td style="border: 1px solid black; padding: 8px">Occupation: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.designation?.toLowerCase() || ""}</span
              ></td>
        </tr>
      
        <tr>
          <td style="border: 1px solid black; padding: 8px">
            Department: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.department?.toLowerCase() || ""}</span
              >
          </td>
         
          <td  colspan="2" style="border: 1px solid black; padding: 8px">Mobile no. <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.mobileNo?.toLowerCase() || ""}</span
              ></td>
          <td style="border: 1px solid black; padding: 8px">
            Telephone no. in plant: <span style="text-transform: capitalize; font-weight: 400;"
                ></span
              >
          </td>
        </tr>

        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            HISTORY
          </td>
        </tr>
        <!-- This row has four columns -->
        <tr>
          <td style="border: 1px solid black; padding: 8px">Diabetes: --------</td>
          <td style="border: 1px solid black; padding: 8px">Hypertension: --------</td>
          <td style="border: 1px solid black; padding: 8px">CAD: --------</td>
          <td style="border: 1px solid black; padding: 8px">Other: --------</td>
        </tr>
        <!-- Other rows have fewer columns, so colspan is used to keep alignment -->
        <tr>
          <td style="border: 1px solid black; padding: 8px">Angioplasty: ----------</td>
          <td style="border: 1px solid black; padding: 8px">CABG: ----------</td>
          <td colspan="2" style="border: 1px solid black; padding: 8px">
             Any other surgery: ${data?.anyOtherSurgery || "----------"} 
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Regular medicines: NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            1)
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            2)
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            3)
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            4)
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            5)
          </td>
        </tr>

        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Diet: <span>Veg${
              false
                ? `<span style="position: relative;top:-10px;left:-10px;">&#x2714;</span>`
                : "&nbsp;"
            }</span><span>/&nbsp;&nbsp;Non-Veg${
      false
        ? `<span style="position: relative;top:-10px;left:-25px;">&#x2714;</span>`
        : "&nbsp;"
    }</span><span>/&nbsp;&nbsp;Mixed${
      false
        ? `<span style="position: relative;top:-10px;left:-20px;">&#x2714;</span>`
        : "&nbsp;"
    }</span>
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Smoking: <span>No${
              false
                ? `<span style="position: relative;top:-10px;left:-10px;">&#x2714;</span>`
                : "&nbsp;"
            }</span> <span>/&nbsp;&nbsp;Yes${
      false
        ? `<span style="position: relative;top:-10px;left:-10px;">&#x2714;</span>`
        : "&nbsp;"
    }</span>
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Tobacco chewing: <span>No${
              false
                ? `<span style="position: relative;top:-10px;left:-10px;">&#x2714;</span>`
                : "&nbsp;"
            }</span> <span>/&nbsp;&nbsp;Yes${
      false
        ? `<span style="position: relative;top:-10px;left:-10px;">&#x2714;</span>`
        : "&nbsp;"
    }</span>
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            CLINICAL EXAMINATION FINDINGS:
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Marks of Identification 1) ----------
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2) ----------
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
              width: 33%;
            "
          >
            Height: ${data?.height || ""}cm
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
              width: 33%;
            "
          >
            Weight: ${data?.weight || ""}Kgs
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            BMI: ${data?.bmi || ""}Kg/m2
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
              width: 33%;
            "
          >
            Chest Inspiration: ${data?.chestInspiration}cm
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
              width: 33%;
            "
          >
            Chest Expiration: ${data?.chestExpiration}cm
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              text-align: left;
            "
          >
            Chest Expansion: NA
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            CARDIO –VASCULAR SYSTEM
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Pulse: ${data?.pulseRate || ""}/min
          </td>
          <td
            colspan="2"
            style="
              padding: 8px;
              background-color: #fff;
              text-align: left;
              border-bottom: 1px solid #000;
            "
          >
            Regular/Irregular:  NAD
          </td>
          <td
            style="
              border-right: 1px solid black;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Blood Pressure:${data?.bp || ""}mmHg
          </td>
        </tr>

        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Heart Sounds: ----------
          </td>
          <td
            colspan="2"
            style="
              padding: 8px;
              background-color: #fff;
              text-align: left;
              border-bottom: 1px solid #000;
              
            "
          >
            Murmur: NAD
          </td>
         
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 10px;
              font-weight: bold;
              text-align: center;
            "
          ></td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            RESPIRATORY SYSTEM
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Resp.Rate: ----------
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Shape of Chest:NA
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Trachea:NAD
          </td>
        </tr>
        <tr>
          <td
            style="
              padding: 8px;
              background-color: #fff;
              text-align: left;
              border-bottom: 1px solid #000;
              border-left: 1px solid #000;
            "
          >
            Breath sounds:NAD
          </td>
          <td
            colspan="3"
            style="
              border-right: 1px solid black;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Any Adventitious sound:NA
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 10px;
              font-weight: bold;
              text-align: center;
            "
          ></td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            CENTRAL NERVOUS SYSTEM
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Cranial Nerves:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Sensory Functions:NA
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Motor Functions:NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid #000;
              padding: 8px;
              background-color: #fff;
              text-align: left;
              border-bottom: 1px solid #000;
            "
          >
            Reflexes:NAD
          </td>
        </tr>

        <tr style="page-break-after: always"></tr>

        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            GASTRO-INTESTINAL SYSTEM:
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Teeth:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Gums:NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Tongue:NAD
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Liver:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Spleen:NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Any Lump:NAD
          </td>
        </tr>
         </table>
        <br/>
        <br/>
        <br/>
        <br/>
         <table  
        style="
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          font-weight: bold;
        "
        >
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            GENITO-URINARY SYSTEM
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Hernia:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Hydrocoele:NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
           Phimosis:NAD
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
           Crypto-Orchidism:NAD
          </td>
          <td
            colspan="3"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              border-right: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Any feature of STD:NAD
          </td>
          
        </tr>
       
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            EXAMINATION OF EYES
          </td>
        </tr>

        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Pupils:
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Cornea:
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Eye lids:
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Ptosis:
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Squint:
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Nystagmus:
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
        <tr>
          <td style="border: 1px solid black; padding: 8px"></td>
          <td style="border: 1px solid black; padding: 8px">
            Far Vision - Right
          </td>
          <td style="border: 1px solid black; padding: 8px">
            Far Vision - Left
          </td>
          <td style="border: 1px solid black; padding: 8px">
            Near Vision - Right
          </td>
          <td style="border: 1px solid black; padding: 8px">
            Near Vision - Left
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px">Without Glass</td>
          <td style="border: 1px solid black; padding: 8px"> ${
            data?.farRightEyeSight || ""
          } </td>
          <td style="border: 1px solid black; padding: 8px"> ${
            data?.farLeftEyeSight || ""
          } </td>
          <td style="border: 1px solid black; padding: 8px"> ${
            data?.nearRightEyeSight || ""
          } </td>
          <td style="border: 1px solid black; padding: 8px"> ${
            data?.nearLeftEyeSight || ""
          } </td>
        </tr>

        <tr>
          <td style="border: 1px solid black; padding: 8px">With Glass</td>
          <td style="border: 1px solid black; padding: 8px">6/6</td>
          <td style="border: 1px solid black; padding: 8px">6/6</td>
          <td style="border: 1px solid black; padding: 8px">N/6</td>
          <td style="border: 1px solid black; padding: 8px">N/6</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px">Power of Glass</td>
          <td style="border: 1px solid black; padding: 8px"></td>
          <td style="border: 1px solid black; padding: 8px"></td>
          <td style="border: 1px solid black; padding: 8px"></td>
          <td style="border: 1px solid black; padding: 8px"></td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px">Color Vision</td>
          <td align ="center" colspan="4" style="border: 1px solid black; padding: 8px">NAD</td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px">
            Titmus / Key stone Vision
          </td>
          <td colspan="4" style="border: 1px solid black; padding: 8px;"></td>
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
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            EXAMINATION OF EAR, NOSE & THROAT
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Nose:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Throat:NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Ear canal:NAD
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Any Discharge:NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
            "
          >
            Tympanic membrane:NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Whispered voice @ 2 ft:NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            LOCOMOTOR SYSTEM
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Gait :NAD
          </td>
          <td
            colspan="2"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Spine :NAD
          </td>
          <td
            style="
              border-right: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Any abnormality:NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Remarks : NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            For Females Only:
          </td>
        </tr>
        <tr>
          <td
            style="
              border-left: 1px solid #000;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            LMP
          </td>
          <td
            colspan="3"
            style="
              border-left: 1px solid #fff;
              padding: 8px;
              border-bottom: 1px solid #000;
              background-color: #fff;
              text-align: left;
            "
          >
            Pregnancy test (If indicated):
          </td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 10px;
              background-color: #fff;
              font-weight: bold;
              text-align: center;
            "
          ></td>
        </tr>
        <tr>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 10px;
              background-color: #d9e1f2;
              font-weight: bold;
              text-align: center;
            "
          >
            TEST / INVESTIGATION REPORT
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
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            B. Sugar F: ----------
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Blood Group: ----------
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Total Cholesterol: ${
              data?.cholestrolData?.["S.CHOLESTEROL"] || ""
            } mg/dl
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            B. Sugar R: ${
              data?.cholestrolData?.["BLOOD SUGAR RANDOM"] || ""
            } mg/dl
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Haemoglobin: ${data?.cholestrolData?.["HB"] || ""} mg/dl gm/dl
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            LDL Cholesterol: ${data?.cholestrolData?.["LDL"] || ""} mg/dl
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            B. Sugar PPBS: ----------
          </td>
          <td
            colspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Total WBC count: ${data?.cholestrolData?.["WBC"] || ""}/cmm
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            HDL Cholesterol: ${
              data?.cholestrolData?.["HDL Cholesterol"] || ""
            }mg/dl
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
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            S. Creat.: ${data?.cholestrolData?.["S.CREATININE"] || ""}mg/dl
          </td>
          <td
            rowspan="2"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Differential<br /> count
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            N: ${data?.cholestrolData?.["Neutrophils"] || ""}
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            L: ${data?.cholestrolData?.["Lymphocytes"] || ""}
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            E: ${data?.cholestrolData?.["Eosinophils"] || ""}
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            S. Triglycerides:: ${
              data?.cholestrolData?.["S.TRIGLYCERIDE"] || ""
            }mg/dl
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            B. Urea.: ----------
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            M: ${data?.cholestrolData?.["Monocytes"] || ""}
          </td>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            B: ${data?.cholestrolData?.["Basophils"] || ""}
          </td>

          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            I
          </td>

          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Urine R/M: Colour: ${
              data?.cholestrolData?.["URINE.COLOUR"] || ""
            }<br />Ph: 
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            S. Uric Acid: ${data?.cholestrolData?.["URIC_ACID"] || ""} mg/dl
          </td>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Total RBC count: ${data?.cholestrolData?.["RBC"] || ""}/cmm
          </td>

          <td
            colspan="3"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              justify-content: space-between;
              display: flex;
            "
          >
            <span style="width: 50%">Albumin: ----------</span>
            <span style="width: 50%">Sugar: ----------</span>
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            SGOT: ----------
          </td>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Total Platelet count:  ${
              data?.cholestrolData?.["PLATELET"] || ""
            }/cmm
          </td>

          <td
            colspan="3"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              justify-content: space-between;
              display: flex;
            "
          >
            <span style="width: 50%">Pus cells: ${
              data?.cholestrolData?.["URINE.PUS_CELLS"] || ""
            } </span>
            <span style="width: 50%">RBCs: ${
              data?.cholestrolData?.["RBC"] || ""
            }</span>
          </td>
        </tr>
        <tr>
          <td
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            SGPT: ${data?.cholestrolData?.["SGPT"] || ""}mg/dl
          </td>
          <td
            colspan="4"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            ESR ${data?.cholestrolData?.["ESR"] || ""} mm in 1st Hr
          </td>

          <td
            colspan="3"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              justify-content: space-between;
              display: flex;
            "
          >
            <span style="width: 50%">Cast: ${
              data?.cholestrolData?.["URINE.CASTS"] || ""
            }</span>
            <span style="width: 50%">Crystals: ${
              data?.cholestrolData?.["URINE.CRYSTALS"] || ""
            }</span>
          </td>
        </tr>
        <tr>
          <td
            colspan="5"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            X-Ray Chest Report: NA
          </td>
          <td
            colspan="3"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            ECG Report: NAD
          </td>
        </tr>
        <tr>
          <td
            colspan="5"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            PFT Report: <span style="width: 50%">FVC: </span>
            <span style="width: 50%">FEV1/FVC</span>
          </td>
          <td
            colspan="3"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Audiometry Report: ${data?.audiometryValue || ""}
          </td>
        </tr>
        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Ultrasonography report (If required)
          </td>
        </tr>
          </table>
        <br/>
        <br/>
        <br/>
        <br/>
        <table  
        style="
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          font-weight: bold;
        "
        >
        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              height: 70px;
            "
          >
            Any Other Investigation done:
          </td>
        </tr>

        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              height: 70px;
              text-align: center;
            "
          >
            OBSERVATIONS
          </td>
        </tr>
      
        <tr>
          <td
            colspan="7"
            style="
              border: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              height: 70px;
              text-align: center;
            "
          >
            ADIVCE
          </td>
        </tr>
        <tr>
          <td
            colspan="1"
            style="
              border-left: 1px solid black;
              border-bottom: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
            "
          >
            Date:
          </td>
          <td
            colspan="6"
            style="
              border-right: 1px solid black;
              border-bottom: 1px solid black;
              padding: 8px;
              background-color: #fff;
              font-weight: bold;
              height: 100px;
            "
          >
            Signature & Seal: <br />
            Examining Doctor: <br />
            Registration Number:
          </td>
        </tr>
      </table>
      <br />
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
    // formData.append("file", pdfBlob, `${data?.empId}_consolidated.pdf`);

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

      // const filterEmpId = ["433952"];
      // const temp = result?.data?.filter(
      //   (item) => item.employmentType === "CONTRACTOR"
      // );

      const audiometryEmployee = [
        "150666",
        "150665",
        "150674",
        "150717",
        "1814690445",
        "10926039",
        "10929989",
        "10926011",
        "13515672",
        "1816194334",
        "13515673",
        "10928825",
        "10929539",
        "1813600467",
        "1815551588",
        "1815551585",
        "10927385",
        "1815019685",
        "1814103079",
        "10929362",
        "10902885",
        "1813309127",
        "1815266904",
        "244103",
        "293195",
        "1815230843",
        "1813017765",
        "1815560125",
        "342240",
        "9913348",
        "150670",
        "141021",
        "150670",
        "10916113",
        "342203",
        "343182",
        "343048",
        "343049",
        "343050",
        "141010",
      ];

      const tokensList = {
        12: "high Abnormal ECG",
        14: "Not Significant",
        17: "Not Significant",
        23: "Not Significant",
        25: "Not Significant",
        36: "Tachycardia",
        37: "Anteroseptal Infarct",
        38: "Not Significant",
        39: "Not Significant",
        40: "Not Significant",
        73: "Inferior ST Abnormality",
        97: "Inferior and Interior Infarct",
        109: "Inferior and Interior Infarct",
        114: "Inferior and T wave Abnormality",
        121: "Lateral Wall ST Abnormality",
        137: "AV Block in ECG",
        150: "Fascicular Block in ECG",
        159: "Incomplete Right Bundle Branch Block",
        162: "Abnormal ECG",
        173: "Abnormal T Wave in ECG",
        191: "Left Bundle Branch Block",
        217: "Inferior ST Abnormality",
        236: "Inferior ST Abnormality",
        247: "	Inferior Infarct",
        256: "Right Bundle Branch Block",
        317: "Not Significant",
        324: "Left Anterior fascicular Block",
        367: "Inferior Septal Infarct",
        432: "Right Bundle Branch Block",
      };

      const filterEmpId = ["1815842448"];
      const temp = result?.data
        ?.filter((item) => filterEmpId.includes(item.empId))
        .map((emp) => {
          return {
            ...emp,
            audiometryValue: audiometryEmployee.includes(emp.empId)
              ? "NAD"
              : "NA",
            anyOtherSurgery: tokensList[emp.tokenNumber] || "",
          };
        });

      // .filter((item) => {
      //   const itemDate = dayjs(item.date).format("YYYY-MM-DD");
      //   return (
      //     // empId &&
      //     // bloodReportExist &&
      //     // audioReportExist &&
      //     // pftReportExist &&
      //     // bloodReportExist &&
      //     itemDate >= dayjs(startDate).format("YYYY-MM-DD") &&
      //     itemDate <= dayjs(endDate).format("YYYY-MM-DD")
      //   );
      // });

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
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data?.empId}`;
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

export default GrasimAgencyStaff;
