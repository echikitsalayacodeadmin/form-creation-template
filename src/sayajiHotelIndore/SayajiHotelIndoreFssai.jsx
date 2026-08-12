import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { LogoImage } from "../effotelFassai/assets";
import { KUNALSIGNBASE64 } from "../assets/images/base64Images";
import dayjs from "dayjs";

const TARGET_EMP_IDS = [
  "S017901", "S07997", "S015561", "S011640", "S07521", "S013823", "S02608", "S07061",
  "S019525", "S09578", "S018068", "S014492", "S07757", "S02225", "S019748", "S05129",
  "S010959", "S011552", "S019388", "S019131", "S020140", "S011491", "S018074", "S019237",
  "S012584", "S019614", "S00316", "S018213", "S02255", "S04131", "S018512", "S016082",
  "S011379", "S02259", "S014227", "S05195", "S012465", "S010987", "S011697", "S00201",
  "S014281", "S012534", "S018197", "S020148", "S015836", "S014646", "S013678", "S012133",
  "S00438", "S04347", "S018235", "S011898", "S017623", "S014531", "S015857", "S05335",
  "S02895", "S09636", "S018331", "S05896", "S09634", "S012121", "S018745", "S03082",
  "S00044", "S020547", "S019454", "S00444", "S016950", "S018869", "S01037", "S012555",
  "S017758", "S01939", "S02446", "S019865", "S010808", "S02320", "S018840", "S016943",
  "S019117", "S09596", "S012609", "S011987", "S09669", "S01395", "S01047", "S01775",
  "S018977", "S017682", "S019391", "S010732", "S010540", "S018513", "S014536", "S010616",
  "S00106", "S016638", "S07491", "S02550", "S015254", "S020281", "S00069", "S09589",
  "S012366", "S016150", "S019826", "S01826", "S014426", "S019532", "S011438", "S01866",
  "S01959", "S010662", "S00173", "S014710", "S018271", "S014524", "S012559", "S015863",
  "S02670", "S03088", "S020406", "S014477", "S013150", "S018406", "S011624", "S07957",
  "S012485", "S04838", "S012463", "S016037", "S07956", "S012715", "S05602", "S011744",
  "S011625", "S011116", "S00743", "S06306", "S04130", "S02782", "S011224", "S018414",
  "S018868", "S016410", "S07652", "S011746", "S018694", "S016241", "S015562", "S016439",
  "S013812", "S017223", "S06385", "S09631", "S015993", "S00055", "S014731", "S013945",
  "S014788", "S04009", "S011489", "S02278", "S013891", "S011698", "S010789", "S010488",
  "S014423", "S012058", "S012386", "S014600", "S016646", "S020489", "S020116", "S018274",
  "S06139", "S02561", "S012860", "S012443", "S07523", "S012139", "S01045", "S02748",
  "S07464", "S019287", "S012558", "S00131", "S010928", "S04179", "S00401", "S00119",
  "S015862", "S013535", "S017882", "S02419", "S010575",
];

const SayajiHotelIndoreFssai = ({
  corpId = "8ca794e0-3e9b-48ce-adf6-2701dc99e57e",
  campCycleId = "445086",
  fileType = "FITNESS_CERTIFICATE_FOOD",
  corpName = "Sayaji Hotel Indore Limited",
  campDate = "24th July, 2026",
  year = "2026",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDF = async (data) => {
    const FoodCertificate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Medical Fitness Certificate</title>
        <style type="text/css">
          * { margin: 0; padding: 0; text-indent: 0; }
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
          li { display: block; }
          #l1 { padding-left: 0pt; counter-reset: c1 1; }
          #l1 > li > *:first-child:before {
            counter-increment: c1;
            content: counter(c1, decimal) ". ";
            color: black;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
          }
          #l1 > li:first-child > *:first-child:before { counter-increment: c1 0; }
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
          <p style="padding-top: 4pt; padding-left: 2pt; text-indent: 0pt; text-align: left;"><br /></p>
        </div>
        <img src=${LogoImage} alt="" style="width: 100%" />
        <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%">
          <br />
          <p style="padding-left: 11pt; text-indent: 0pt; text-align: justify;">
            Shri/ Smt.
            <span style="text-transform: capitalize; text-decoration: underline">${data?.name?.toLowerCase() || ""}</span>
            employed with <b>M/S ${corpName}</b> coming in direct
            contact with food items has been carefully examined* by me on date <u>&nbsp;&nbsp;&nbsp;${data?.vitalsCreatedDate ? dayjs(data?.vitalsCreatedDate).format("DD MMM, YYYY") : ""}&nbsp;</u>
            Based on the medical examination conducted, he/she is found free from any
            infectious or communicable diseases and the person is fit to work in the
            above-mentioned food establishment.
          </p>
          <br /><br />
          <img src=${KUNALSIGNBASE64} style="height:200px;" />
          <br /><br /><br />
          <p class="s10" style="padding-left: 2pt; text-indent: 0pt; text-align: left;">
            Name &amp; Signature with Seal <br />
            <span class="s11">Registered Medical Practitioner / Civil <br />Surgeon</span>
          </p>
          <h2 style="padding-left: 2pt; padding-top: 4pt; text-indent: 0pt; text-align: left;">
            *<span class="h4">Medical Examinations conducted:</span>
          </h2>
          <ol id="l1">
            <li data-list-text="1."><p class="s12" style="padding-top: 8pt; padding-left: 26pt; text-indent: -21pt; text-align: left;">Physical Examination</p></li>
            <li data-list-text="2."><p class="s12" style="padding-left: 26pt; text-indent: -21pt; text-align: left">Eye Test</p></li>
            <li data-list-text="3."><p class="s12" style="padding-left: 26pt; text-indent: -21pt; text-align: left">Skin Examination</p></li>
            <li data-list-text="4."><p class="s12" style="padding-left: 26pt; text-indent: -21pt; text-align: left">Compliance with schedule of VACCINE to be inoculated against enteric group of diseases</p></li>
            <li data-list-text="5."><p class="s12" style="padding-left: 26pt; text-indent: -21pt; text-align: left">Any test required to confirm any communicable or infectious disease which the person suspected to be suffering from on clinical examination</p></li>
          </ol>
        </div>
    `;

    const pdfBlob = await html2pdf().from(FoodCertificate).output("blob");

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
      const temp = result.data.filter((item) => item.vitalsCreatedDate === "2026-07-24");
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
      <h3>Sayaji Hotel Indore FSSAI Certificate</h3>
      <div>corpId: {corpId}</div>
      <div>campCycleId: {campCycleId}</div>
      <div>corpName: {corpName}</div>
      <div>campDate: {campDate}</div>
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

export default SayajiHotelIndoreFssai;
