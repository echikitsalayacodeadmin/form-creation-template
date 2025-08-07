import React, { Fragment, useEffect, useState } from "react";
import { uploadFile } from "../assets/services/PostApiCall";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";
import html2pdf from "html2pdf.js";
import { BASE_URL } from "../assets/constant";
import dayjs from "dayjs";

const HindalcoMERForm = ({
  corpId = "c4c64ef9-91e8-4242-8390-b188afe101ff",
  campCycleId = "315576",
  fileType = "ANNEXURE",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const generatePDF = async (data) => {
    const htmlCOntent = `
            <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Annual Medical Examination Record</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
          }
          .form-container {
            background: #fff;
            margin-inline: 20px;
            margin-block: 10px;
          }
          .form-title {
            text-align: center;
            font-weight: bold;
            font-size: 10px;
            letter-spacing: 1px;
          }
          .form-subtitle {
            text-align: center;
            font-size: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1px;
            font-size: 10px;
          }
          th,
          td {
            border: 0.2px solid #222;
            padding: 1px 3px;
            vertical-align: middle;
            min-height: 32px;
          }
          th {
            background: #e3f2fd;
            font-weight: bold;
            text-align: left;
          }
          .section-header {
            background: #bbdefb;
            font-weight: bold;
            text-align: left;
            font-size: 10px;
          }
          .signature-row td {
            height: 60px;
            vertical-align: bottom;
          }
          .label {
            font-weight: bold;
          }
          .no-border {
            border: none !important;
          }
          .center {
            text-align: center;
          }
          .small {
            font-size: 0.95em;
          }
        </style>
      </head>
      <body>
        <div class="form-container">
          <div
            style="
              border: 1px solid #000000;
              width: 100%;
              margin-bottom: 2px;
              padding: 2px;
            "
          >
            <div class="form-title">HINDALCO INDUSTRIES LIMITED</div>
            <div class="form-subtitle">
              PERSONAL MOBILITY - CHAKAN PUNE<br />ANNUAL MEDICAL
              EXAMINATION RECORD<br />
            </div>
          </div>
          <table>
            <tr>
              <td class="label">Name :</td>
              <td>${data?.name || ""}</td>
              <td class="label">Age:</td>
              <td>${data?.age || ""}</td>
              <td class="label">Gender:</td>
              <td>${data?.gender || ""}</td>
            </tr>
            <tr>
              <td class="label">Emp ID :</td>
              <td>${data?.empId}</td>
              <td class="label">Date of Examination :</td>
              <td>${
                dayjs(data?.vitalsCreatedDate).format("DD-MM-YYYY") || ""
              }</td>
              <td class="label">Date of Joining:</td>
              <td>${data?.dateOfJoining || ""}</td>
            </tr>
            <tr>
              <td class="label">CLMS Code:</td>
              <td>${data?.cfmsCode || "Not applicable"}</td>
              <td class="label">Dept:</td>
              <td>${data?.department || ""}</td>
              <td class="label">Mobile No:</td>
              <td>${data?.mobileNo || ""}</td>
            </tr>
            <tr>
              <td class="label">Identification Mark:</td>
              <td>${data?.identificationMark || ""}</td>
              <td class="label">Occupation:</td>
              <td colspan="3">${data?.designation || ""}</td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="6" style="text-align: center">
                CLINICAL HISTORY
              </td>
            </tr>
            <tr>
              <td  class="label">Present complaint/s, if any:</td>
              <td >
                ${
                  data?.pemMedicalFormData?.clinical_complaints ||
                  "No Complaint revealed"
                }
              </td>
              <td  class="label">Present disease/s, if any:</td>
              <td >
                ${
                  data?.pemMedicalFormData?.clinical_diseases ||
                  "Not revealed at the time of examination"
                }
              </td>
            </tr>
            <tr>
              <td  class="label">
                Regular medication/s, if any:
              </td>
              <td >
                ${
                  data?.pemMedicalFormData?.clinical_medications ||
                  "Not revealed at the time of examination"
                }
              </td>
              <td  class="label">
                Hospitalization /surgery since last PME:
              </td>
              <td >
                ${
                  data?.pemMedicalFormData?.clinical_hospitalization ||
                  "No (As per the candidate self declaration)"
                }
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="11" style="text-align: center">
                GENERAL EXAMINATION
              </td>
            </tr>
            <tr>
              <td colspan="2" class="label">Height:</td>
              <td colspan="2">${data?.height ? data?.height + " cm" : ""}</td>
              <td colspan="2" class="label">Weight:</td>
              <td colspan="2">${data?.weight ? data?.weight + " kg" : ""}</td>
              <td colspan="2" class="label">BMI:</td>
              <td colspan="2">${data?.bmi ? data?.bmi + " kg/m" : ""}</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Pulse:</td>
              <td colspan="2">${
                data?.pulseRate ? data?.pulseRate + " bpm" : ""
              }</td>
              <td colspan="2" class="label">Blood Pressure:</td>
              <td colspan="2">${data?.bp ? data?.bp + " mm Of hg" : ""}</td>
              <td colspan="2" class="label">Resp Rate:</td>
              <td colspan="2">${
                data?.respRate ? data?.respRate + " / min" : ""
              }</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Chest Inspiration:</td>
              <td colspan="2">${
                data?.chestInspiration ? data?.chestInspiration + " cm" : ""
              }</td>
              <td colspan="2" class="label">Chest Expiration:</td>
              <td colspan="2">${
                data?.chestExpiration ? data?.chestExpiration + " cm" : ""
              }</td>
              <td colspan="2" class="label">Chest Expansion:</td>
              <td colspan="2">
                ${
                  data?.pemMedicalFormData?.general_chest_expansion
                    ? data?.pemMedicalFormData?.general_chest_expansion + " cm"
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td colspan="6" class="label">
                Pallor / Icterus / Lymphadenopathy / Clubbing / Edema:
              </td>
              <td colspan="6">
                ${
                  data?.pemMedicalFormData?.general_pallor_or_edema ||
                  "Not found at the time of examination"
                }
              </td>
            </tr>
            <tr>
              <td colspan="6" class="label">Remarks:</td>
              <td colspan="6">${
                data?.pemMedicalFormData?.general_remarks || "NIL"
              }</td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="6" style="text-align: center">
                EXAMINATION OF EYES
              </td>
            </tr>
            <tr>
              <td class="label">Squint:</td>
              <td>${
                data?.pemMedicalFormData?.eyes_squint ||
                "Not found at the time of examination"
              }</td>
              <td class="label">Nystagmus:</td>
              <td>${
                data?.pemMedicalFormData?.eyes_nystagmus ||
                "Not found at the time of examination"
              }</td>
              <td class="label">Ptosis:</td>
              <td>${
                data?.pemMedicalFormData?.eyes_ptosis ||
                "Not found at the time of exam"
              }</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2" class="center label">Far Vision</td>
              <td colspan="2" class="center label">Near Vision</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td class="center label">Right</td>
              <td class="center label">Left</td>
              <td class="center label">Right</td>
              <td class="center label">Left</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Without Glass</td>
              <td>${data?.farRightEyeSight || "NA"}</td>
              <td>${data?.farLeftEyeSight || "NA"}</td>
              <td>${data?.nearRightEyeSight || "NA"}</td>
              <td>${data?.nearLeftEyeSight || "NA"}</td>
            </tr>
            <tr>
              <td colspan="2" class="label">With Glass</td>
              <td>${data?.farRightEyeSightWithGlasses || "NA"}</td>
              <td>${data?.farLeftEyeSightWithGlasses || "NA"}</td>
              <td>${data?.nearRightEyeSightWithGlasses || "NA"}</td>
              <td>${data?.nearLeftEyeSightWithGlasses || "NA"}</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Power of Glasses</td>
              <td>${data?.pemMedicalFormData?.eyes_power_rightFar || "NA"}</td>
              <td>${data?.pemMedicalFormData?.eyes_power_leftFar || "NA"}</td>
              <td>${data?.pemMedicalFormData?.eyes_power_rightNear || "NA"}</td>
              <td>${data?.pemMedicalFormData?.eyes_power_leftNear || "NA"}</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Colour Vision</td>
              <td colspan="4">${
                data?.colourVision === "Both"
                  ? "BOTH EYES (L + R)"
                  : data?.colourVision === "NAD"
                  ? "Easily identified basic colours by candidate"
                  : data?.colourVision || "Within Normal Limits"
              }</td>
            </tr>
            <tr>
              <td colspan="2" class="label">Titmus / Key stone Vision</td>
              <td colspan="4">
                ${data?.pemMedicalFormData?.eyes_titmus_vision || "Not Done"}
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="4" style="text-align: center">
                EXAMINATION OF EAR, NOSE & THROAT
              </td>
            </tr>
            <tr>
              <td class="label">Whispered Voice</td>
              <td>[R] ${
                data?.pemMedicalFormData?.ent_voice_right ||
                "Audible at the time of examination"
              }</td>
              <td>[L] ${
                data?.pemMedicalFormData?.ent_voice_left ||
                "Audible at the time of examination"
              }</td>
              <td></td>
            </tr>
            <tr>
              <td class="label">Tympanic Membrane</td>
              <td>[R] ${
                data?.pemMedicalFormData?.ent_tympanic_right ||
                "Healthy & Intact"
              }</td>
              <td>[L] ${
                data?.pemMedicalFormData?.ent_tympanic_left ||
                "Healthy & Intact"
              }</td>
              <td></td>
            </tr>
            <tr>
              <td class="label">Teeth</td>
              <td>${data?.pemMedicalFormData?.ent_teeth || "Clear Teeth"}</td>
              <td class="label">Gums:</td>
              <td>${data?.pemMedicalFormData?.ent_gums || "Healthy Mucosa"}</td>
            </tr>
            <tr>
              <td class="label">Tongue</td>
              <td>${
                data?.pemMedicalFormData?.ent_tongue ||
                "No ulcer found at the time of examination"
              }</td>
              <td class="label">Tonsils:</td>
              <td>${
                data?.pemMedicalFormData?.ent_tonsils || "Non Palpable"
              }</td>
            </tr>
            <tr>
              <td class="label">Any Disease</td>
              <td colspan="3">${
                data?.pemMedicalFormData?.ent_disease ||
                "Not revealed at the time of examination"
              }</td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="4" style="text-align: center">
                CARDIO-VASCULAR SYSTEM
              </td>
            </tr>
            <tr>
              <td class="label">Heart Sounds</td>
              <td>S1 + ${
                data?.pemMedicalFormData?.cardio_heart_sound_s1 || ""
              }</td>
              <td>S2 + ${
                data?.pemMedicalFormData?.cardio_heart_sound_s2 || ""
              }</td>
              <td>
                <span class="label">Murmur:</span>
                ${data?.pemMedicalFormData?.cardio_murmur || "Not Audible"}
              </td>
            </tr>
            <tr>
              <td class="label">Others</td>
              <td colspan="3">${
                data?.pemMedicalFormData?.cardio_other || "NIL"
              }</td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="5" style="text-align: center">
                RESPIRATORY SYSTEM
              </td>
            </tr>
            <tr>
              <td class="label">Chest Deformity:</td>
              <td colspan="2">
                ${
                  data?.pemMedicalFormData?.respiratory_chest_deformity ||
                  "B/L Symetrical No external deformity seen"
                }
              </td>
              <td class="label">Lungs:</td>
              <td>${
                data?.pemMedicalFormData?.respiratory_lungs || "B/L AE +"
              }</td>
            </tr>
            <tr>
              <td class="label">Breath sounds:</td>
              <td colspan="2">
                ${
                  data?.pemMedicalFormData?.respiratory_breath_sounds ||
                  "B/L Clear"
                }
              </td>
              <td class="label">Adventitious sounds:</td>
              <td>
                ${
                  data?.pemMedicalFormData?.respiratory_adventitious_sounds ||
                  "Not Audible"
                }
              </td>
            </tr>
            <tr>
              <td colspan="5" class="label">
                Others:
                <span style="font-weight: 400"
                  >${
                    data?.pemMedicalFormData?.respiratory_others || "NIL"
                  }</span
                >
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="5" style="text-align: center">
                ABDOMEN
              </td>
            </tr>
            <tr>
              <td>
                <span class="label">Liver:</span>
                ${data?.pemMedicalFormData?.abdomen_liver || "Non Palpable"}
              </td>
              <td>
                <span class="label">Spleen:</span>
                ${data?.pemMedicalFormData?.abdomen_spleen || "Non Palpable"}
              </td>
              <td>
                <span class="label">Any Lump:</span>
                ${data?.pemMedicalFormData?.abdomen_lump || "Non Palpable"}
              </td>
            </tr>
            <tr>
              <td>
                <span class="label">Hernia:</span>
                ${data?.pemMedicalFormData?.abdomen_hernia || "Non Found"}
              </td>
              <td>
                <span class="label">Hydrocele:</span>
                ${data?.pemMedicalFormData?.abdomen_hydrocele || "Non Found"}
              </td>
              <td>
                <span class="label">Hemorrhoids:</span>
                ${data?.pemMedicalFormData?.abdomen_hemorrhoids || "Non Found"}
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span class="label">Skin & Genitals:</span>
                ${
                  data?.pemMedicalFormData?.abdomen_genitals ||
                  "No rashes and pigmentation seen. Externally genital apears normal"
                }
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="8" style="text-align: center">
                CENTRAL NERVOUS SYSTEM
              </td>
            </tr>
            <tr>
              <td class="label">Gait:</td>
              <td>${data?.pemMedicalFormData?.cns_gait || "Normal"}</td>
              <td class="label">Speech:</td>
              <td>${data?.pemMedicalFormData?.cns_speech || "Clear"}</td>
              <td class="label">Cranial Nerve:</td>
              <td>${
                data?.pemMedicalFormData?.cns_cranial_nerve || "Well Functional"
              }</td>
              <td class="label">Reflexes deep:</td>
              <td>${
                data?.pemMedicalFormData?.cns_reflex_deep ||
                "Within Normal Limits"
              }</td>
            </tr>
            <tr>
              <td class="label">Reflexes superficial:</td>
              <td>${
                data?.pemMedicalFormData?.cns_reflex_superficial ||
                "Within Normat Limits"
              }</td>
              <td class="label">Sensory Nerves:</td>
              <td>${
                data?.pemMedicalFormData?.cns_sensory || "Well Functional"
              }</td>
              <td class="label">Appearance:</td>
              <td>${data?.pemMedicalFormData?.cns_appearance || "Healthy"}</td>
              <td class="label">Behavior:</td>
              <td>${data?.pemMedicalFormData?.cns_behavior || "Calm"}</td>
            </tr>
            <tr>
              <td class="label">Posture:</td>
              <td>${
                data?.pemMedicalFormData?.cns_posture || "Healthy dynamics"
              }</td>
              <td colspan="6" class="label">
                Remarks:
                <span style="font-weight: 400"
                  >${data?.pemMedicalFormData?.cns_remarks || "NIL"}</span
                >
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="9" style="text-align: center">
                SKELETAL SYSTEM
              </td>
            </tr>
            <tr>
              <td class="label">Limbs:</td>
              <td colspan="2">${
                data?.pemMedicalFormData?.skeletal_limbs || "B/L Symetrical"
              }</td>
              <td class="label">Spine:</td>
              <td colspan="3">${
                data?.pemMedicalFormData?.skeletal_spine ||
                "No external deformity seen"
              }</td>
            </tr>
            <tr>
              <td class="label">Any Other:</td>
              <td colspan="7">${
                data?.pemMedicalFormData?.skeletal_other || "NIL"
              }</td>
            </tr>
          </table>
          <table>
            <tr>
              <td class="section-header" colspan="9" style="text-align: center">
                FOR FEMALES
              </td>
            </tr>
            <tr>
              <td class="label">Menstrual History:</td>
              <td colspan="2">
                ${data?.pemMedicalFormData?.female_menstrual_history || ""}
              </td>
              <td class="label">Obstetric History:</td>
              <td colspan="3">
                ${data?.pemMedicalFormData?.female_obstetric_history || ""}
              </td>
            </tr>
            <tr>
              <td class="label">Breast Exam:</td>
              <td colspan="2">
                ${data?.pemMedicalFormData?.female_breast_exam || ""}
              </td>
              <td class="label">Pelvic Exam:</td>
              <td colspan="3">
                ${data?.pemMedicalFormData?.female_pelvic_exam || ""}
              </td>
            </tr>
          </table>
          <table>
            <tr class="signature-row">
              <td class="center">Employee Signature:<br /><br /></td>
              <td class="center">
                Assisting Staff Nurse<br />Signature with Reg no.<br /><br />
              </td>
              <td colspan="6" class="center">
                Dr Ram Sahoo (MD AFIH) (REG NO. 11177)<br /><br />
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
              `;

    const pdfBlob = await html2pdf()
      .from(htmlCOntent)
      .output("blob")
      .then((data) => {
        return data;
      });
    const formData = new FormData();

    formData.append("file", pdfBlob, `${data.empId}_MER_Form.pdf`);

    const url =
      BASE_URL +
      `org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
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

      const temp = result?.data.filter(
        (item) =>
          item.employmentType === "ONROLL" &&
          item.gender === "MALE" &&
          item.colourVision === "NAD"
        // item.vitalsCreatedDate &&
        // item.employment === "ONROLL" &&
        // !item.empId.startsWith("PEM")
      );

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
    for (let i = 0; i < 1; i++) {
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
    <Fragment>
      <div>
        <div>
          <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
          <button onClick={handleDeletePDF}>Delete Files</button>
          <div>Total Employees: {totalEmployees}</div> <br />
          <div>Uploaded Files: {uploadedCount}</div> <br />
          {list.map((item, index) => (
            <div key={index} style={{ display: "flex" }}>
              <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

              <a href={item.annexureUrl}>
                <div key={index}>{item.annexureUrl}</div>
              </a>

              <br />
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default HindalcoMERForm;
