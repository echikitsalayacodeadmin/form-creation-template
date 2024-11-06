import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";

const GrasimFood = ({
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
            <br />
            <div style="text-align: center; background-color: #fde9d9">
              FOOD HANDLER MEDICAL EXAMINATION RECORD
            </div>
          </div>
        </div>
        <div
          class="section"
          style="
            margin-top: 3px;
            display: flex;
            font-size: 12px;
            font-weight: bold;
          "
        >
          <div style="width: 70%">
            <div style="padding: 2px">Name: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.name?.toLowerCase() || ""}</span
              ></div>
            <div style="padding: 2px">DOB (DD/MM/YYYY): <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.dateOfBirth || ""}</span
              ></div>
            <div style="padding: 2px">Father's / Husbands's Name: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.fathersName?.toLowerCase() || ""}</span
              ></div>
          </div>
          <div style="width: 30%">
            <div style="padding: 2px">Date of examination: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.vitalsCreatedDate || ""}</span
              ></div>
            <div style="padding: 2px">Age / Gender: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.age?.toLowerCase() / data?.gender?.toLowerCase()}</span
              ></div>
            <div style="padding: 2px">Phone no: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.mobileNo || ""}</span
              ></div>
          </div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Permanent Address: <span style="text-transform: capitalize; font-weight: 400;"
                >P.O. Birlagram, Nagda, Madhya Pradesh – 456 331, India.</span
              ></div>
        </div>
        <br />
        <div
          class="section"
          style="
            margin-top: 3px;
            display: flex;
            font-size: 12px;
            font-weight: bold;
          "
        >
          <div style="width: 70%">
            <div style="padding: 2px">Agency Name: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.vendorName || ""}</span
              ></div>
            <div style="padding: 2px">Canteen location: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.canteenLocation || ""}</span
              ></div>
          </div>
          <div style="width: 30%">
            <div style="padding: 2px">Card / ESIC No. : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.empId || ""}</span
              ></div>
            <div style="padding: 2px">Area of work: <span style="text-transform: capitalize; font-weight: 400;"
                >Canteen</span
              ></div>
          </div>
        </div>
        <br />
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: normal"
        >
          <div style="padding: 2px">
            <strong>Medical History :</strong> History of Jaundice / Typhoid / TB / Epilepsy /
            Worms / <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.medicalHistory || ""}</span
              >
          </div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: normal"
        >
          <div style="padding: 2px">
            <strong>Present Complaints :</strong> Fever / Cough / Itching / Diarrhea / Vomiting /
            Wt. Loss / <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.presentComplaint || ""}</span
              >
          </div>
          <br/>
          <div style="font-size: 12px; font-weight: bold">
            <div style="padding: 2px">
              <span style="width: 80px; display: inline-block"
                >Physical Examination:</span
              >
              <span style="width: 110px; display: inline-block"
                >Height:  <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.height || ""} cm</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Weight: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.weight || ""} kg</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Abdomen: <span style="text-transform: capitalize; font-weight: 400;"
                >na</span> </span
              >
              <span style="width: 110px; display: inline-block">
                Chest:(in): <span style="text-transform: capitalize; font-weight: 400;"
                >${
                  data?.chestInspiration ? data?.chestInspiration + " cm" : ""
                }</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >(ex): <span style="text-transform: capitalize; font-weight: 400;"
                >${
                  data?.chestExpiration ? data?.chestExpiration + " cm" : ""
                }</span> </span
              >
            </div>
            <div style="padding: 2px">
              <span style="width: 80px; display: inline-block"></span>
              <span style="width: 110px; display: inline-block"
                >Pulse : <span style="text-transform: capitalize; font-weight: 400;"
                >${
                  data?.pulseRate ? data?.pulseRate + " bpm" : ""
                }</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >B.P. : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.bp ? data?.bp + " mmHg" : ""}</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Temp : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.temp || "-"}</span> </span
              >
              <span style="width: 110px; display: inline-block">
                R.R. : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.respRate ? data?.respRate + " bpm" : "-"}</span> </span
              >
            </div>
            <div style="padding: 2px">
              <span style="width: 80px; display: inline-block"></span>
              <span style="width: 110px; display: inline-block"
                >Pallor : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.pallor || "-"}</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Icterus : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.icterus || "-"}</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Halitosis : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.halitosis || "-"}</span> </span
              >
              <span style="width: 110px; display: inline-block">
                Oedema : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.oedema || "-"}</span> </span
              >
            </div>
            <div style="padding: 2px">
              <span style="width: 80px; display: inline-block"></span>
              <span style="width: 110px; display: inline-block"
                >Nails : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.nails || "-"}</span> </span
              >
              <span style="width: 110px; display: inline-block"
                >Others : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.others || "-"}</span> </span
              >
             
            </div>
          </div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Respiratory System : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.respiratorySystem || "NAD"}</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Cardio Vascular System : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.cardioVascularSystem || "NAD"}</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">CNS : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.cns || "NAD"}</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">P/A : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.pa || ""}</span></div>
        </div>
        <br />
        <div class="section" style="font-size: 12px; font-weight: bold">
          <div style="padding: 2px">
            <span style="width: 100px; display: inline-block"
              >Investigations: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.investigations || ""}</span></span
            >
            <span style="width: 100px; display: inline-block">Hb: <span style="text-transform: capitalize; font-weight: 400;">${
              data?.cholestrolData?.["HB"] || ""
            }</span> </span>
            <span style="width: 100px; display: inline-block">Tc: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.cholestrolData?.["WBC"] || ""}</span> </span>
            <span style="width: 100px; display: inline-block">Dc: <span style="text-transform: capitalize; font-weight: 400;"
                >-</span> </span>
            <span style="width: 100px; display: inline-block">
              BgRH: <span style="text-transform: capitalize; font-weight: 400;"
                >-</span> </span
            >
            <span style="width: 80px; display: inline-block">ESR: <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.cholestrolData?.["ESR"] || ""}</span> </span>
          </div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">ECG : (If Clinically Required): <span style="text-transform: capitalize; font-weight: 400;"
                >NAD</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Urine Exam : <span style="text-transform: capitalize; font-weight: 400;"
                >NAD</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Stool Exam : <span style="text-transform: capitalize; font-weight: 400;"
                >NAD</span></div>
        </div>
        <div
          class="section"
          style="width: 100%; font-size: 12px; font-weight: bold"
        >
          <div style="padding: 2px">Others : <span style="text-transform: capitalize; font-weight: 400;"
                >${data?.others || ""}</span></div>
        </div>
        <br />
        <div
          class="section"
          style="
            display: flex;
            height: 100px;
            font-size: 12px;
            font-weight: bold;
          "
        >
          <div style="width: 50%; padding: 2px">ADVICE / REMARKS :</div>
          <div style="width: 50%; padding: 2px; font-weight: normal"">
            ${checkVitalsStatus(data?.vitalsErrorData) || ""}
          </div>
        </div>
        <div
          class="section"
          style="display: flex; font-size: 12px; font-weight: bold"
        >
          <div style="width: 60%; padding: 2px">Date : <span style="font-weight: normal""> ${
            data?.vitalsCreatedDate || ""
          }</span></div>
          <div style="width: 40%">
            <div style="padding: 2px">Signature & Seal</div>
            <div style="padding: 2px">Examining Doctor</div>
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

      const filterEmpId = ["15252132"];
      const temp = result?.data?.filter((item) =>
        filterEmpId.includes(item.empId)
      );
      // ?.filter((item) =>
      //   filterEmpId.includes(item.empId)
      // );
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

export default GrasimFood;
