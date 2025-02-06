import React, { Fragment, useRef, useState } from "react";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import html2pdf from "html2pdf.js";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import "../App.css";
// import GenerateForm21PDF from "./generateForm21Pdf";
import { BASE_URL } from "../assets/constant";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { useReactToPrint } from "react-to-print";
import { enqueueSnackbar } from "notistack";

function hasAdditionalKeys(vitalsErrorObject) {
  const allowedKeys = [
    "height",
    "weight",
    "bp",
    "lowBp",
    "highBp",
    "IS_HEIGHT_MATCH_PFT_VITALS",
    "IS_WEIGHT_MATCH_PFT_VITALS",
  ];
  const objectKeys = Object.keys(vitalsErrorObject);
  const allAllowedKeys = objectKeys.every((key) => allowedKeys.includes(key));
  return !allAllowedKeys;
}

const CorpsForm21Tracker = ({
  corps = [
    {
      campCycleId: 246226,
      corpId: "1fbae6e0-b9cf-47a7-90aa-f8588b20d711",
      orgName: "Anant Steel",
    },
    {
      campCycleId: 246225,
      corpId: "372cb646-6dff-46c7-ade5-12be4fbb0cef",
      orgName: "CG Power and Industrial Solutions Limited - LIM Division",
    },
    {
      campCycleId: 246248,
      corpId: "c7a222f4-eb45-478f-82f5-cf6cd3a9e8ca",
      orgName: "CD Safety And Security Services LLP",
    },
    {
      campCycleId: 194494,
      corpId: "130aca14-99c6-453a-b64f-1f9cf2672a8d",
      orgName: "Enaltec Labs Pvt Ltd",
    },
    {
      campCycleId: 246285,
      corpId: "f1c6c4d4-85c5-4ab2-bea5-6ddf5a68f646",
      orgName: "Erawat Pharma Limited",
    },
    {
      campCycleId: 246357,
      corpId: "769987c2-0a25-4c1d-922e-3e939e009bcf",
      orgName: "Effotel By Sayaji-Bhopal",
    },
    {
      campCycleId: 246191,
      corpId: "e9310f51-b902-4f58-9a16-a7891e1da51e",
      orgName: "Case Canteen",
    },
    {
      campCycleId: 246402,
      corpId: "c1d3ca37-852b-425b-8af8-b4b5c8b2176f",
      orgName: "manpur",
    },
    {
      campCycleId: 246250,
      corpId: "68279214-fbd5-4e1c-a8bd-acc80c597073",
      orgName: "Harshvardhan's Laboratories Pvt. Ltd.",
    },
    {
      campCycleId: 246186,
      corpId: "c5ef4835-6924-455b-989a-51a541e19903",
      orgName: "Budhraja Packaging Pvt Ltd",
    },
    {
      campCycleId: 246379,
      corpId: "c54d1df6-660e-4fa2-94b8-07bd04ae900d",
      orgName: "HY - TECH ENGINEERS PVT. LTD.",
    },
    {
      campCycleId: 246245,
      corpId: "c59a2fbc-bc3d-453c-aae4-313581793890",
      orgName: "Indore Composite Pvt. Ltd",
    },
    {
      campCycleId: 246292,
      corpId: "11081ae7-ecf3-4e06-b68f-784cba49170c",
      orgName: "Mittal Appliances LTD.",
    },
    {
      campCycleId: 237643,
      corpId: "76cfdb38-722a-4f77-8f67-09d6318e2667",
      orgName: "Kach Motors Pvt. Ltd.",
    },
    {
      campCycleId: 246309,
      corpId: "87bcba05-f95e-4189-89b8-29132ec52b0c",
      orgName: "Khaitan Chemicals and Fertilizers Ltd.",
    },
    {
      campCycleId: 251927,
      corpId: "b4b0b6d0-403b-477f-a6f6-87a7adaf9e63",
      orgName: "Radisson Blu Indore (Bestech Hospitality Pvt Ltd)",
    },
    {
      campCycleId: 246366,
      corpId: "9b7e33eb-d085-4df5-bdc1-146d930c2387",
      orgName: "Aperam Alloys India Private Limited",
    },
    {
      campCycleId: 246389,
      corpId: "181f99f5-45cf-4328-a760-f48c871a81f3",
      orgName: "Tufropes Private Limited (Vadodara)",
    },
    {
      campCycleId: 246345,
      corpId: "4620c347-1a5a-4684-be1e-ea91b168b51f",
      orgName: "RSPL LTD. Unit 3",
    },
    {
      campCycleId: 246380,
      corpId: "4a3906e2-caa8-4417-b427-85b53717e623",
      orgName: "Dewas Hydroquip pvt ltd.",
    },
    {
      campCycleId: 246384,
      corpId: "86d78fb6-1060-447e-83d3-5822aab22e66",
      orgName: "Indore Marriott Hotel",
    },
    {
      campCycleId: 252431,
      corpId: "64eac2de-b039-4526-bffb-9e0e5e17c771",
      orgName: "Lapp India Bangalore",
    },
    {
      campCycleId: 246272,
      corpId: "3d81ec60-952c-48ee-9e15-62ba52bf8097",
      orgName: "ZF Steering Gear (India) Limited",
    },
    {
      campCycleId: 246168,
      corpId: "d14eaf6b-d5e1-4797-93ab-d7c4bd34a763",
      orgName: "Cummins Turbo Technologies Pvt. Ltd.",
    },
    {
      campCycleId: 246195,
      corpId: "2ef9842f-552f-464e-831c-28ce3ada1715",
      orgName: "Lite Bite Foods Medical Camp",
    },
    {
      campCycleId: 254651,
      corpId: "ea0b0598-63e7-4a58-9306-46a27ee4412d",
      orgName: "Kingspan Jindal Pvt. Ltd.",
    },
    {
      campCycleId: 246371,
      corpId: "5cbe1e40-0169-454a-a4df-a4db1029119d",
      orgName: "MAAN Aluminium Ltd",
    },
    {
      campCycleId: 246193,
      corpId: "455f4926-ea38-476d-ad49-0c3587c65200",
      orgName: "MAHINDRA & MAHINDRA LTD.",
    },
    {
      campCycleId: 246241,
      corpId: "297ebd7f-bb72-4837-b98e-ec1b0ed6b7aa",
      orgName: "Mallika Alloy Cast Pvt Ltd.",
    },
    {
      campCycleId: 246360,
      corpId: "eb09387b-178b-495a-aa92-6ee5ef9da7f1",
      orgName: "MINDA CORPORATION LIMITED",
    },
    {
      campCycleId: 246275,
      corpId: "9c9aaa81-d008-44b0-a95e-fb0c15b585a1",
      orgName: "Mittal Coins PVT. LTD.",
    },
    {
      campCycleId: 253638,
      corpId: "5359f5e7-825f-4aa9-b649-0efa013945bc",
      orgName: "Lapp India Dharuhera",
    },
    {
      campCycleId: 246237,
      corpId: "91c72280-4947-405e-8ae7-b9190b955622",
      orgName: "Narmada Milk and Milk Products",
    },

    {
      campCycleId: 253637,
      corpId: "afb32577-5157-4321-87cc-a980ea256e7f",
      orgName: "Lapp India Pune",
    },
    {
      campCycleId: 246294,
      corpId: "453d8528-35e5-4f09-bf20-16e5120503ee",
      orgName: "Padma Polytex India Pvt ltd",
    },
    {
      campCycleId: 237622,
      corpId: "aae5fd1b-8cc5-47ee-839d-cd7815b38798",
      orgName: "PANASONIC ENERGY INDIA CO.LTD.",
    },
    {
      campCycleId: 253639,
      corpId: "96b53daa-d5ca-4d96-952b-3d15d5cdf649",
      orgName: "Lapp India Vadodara",
    },
    {
      campCycleId: 246273,
      corpId: "de076978-fd3e-4e7c-b11a-23c9df1e73d2",
      orgName: "Avantika Gas",
    },
    {
      campCycleId: 246279,
      corpId: "ae492300-db66-467f-90c9-dad37f31b2cb",
      orgName: "Bharat Petroleum Corporation Limited -MRT",
    },
    {
      campCycleId: 246397,
      corpId: "d8925b04-9797-452d-b809-8b24f09a6b6f",
      orgName: "PEB Steel Lloyd India Limited",
    },
    {
      campCycleId: 246299,
      corpId: "eb7c471c-2e64-4bd6-82ed-5f56f63afeb7",
      orgName: "Iskon Balaji Foods Pvt ltd",
    },
    {
      campCycleId: 246387,
      corpId: "ad1c5998-9842-4e14-95da-b35248ddb6b0",
      orgName: "Tufropes Private limited (Silvassa)",
    },
    {
      campCycleId: 246242,
      corpId: "8a8f98e4-6283-44ff-ba1b-e589e7f327b3",
      orgName: "Tufnets Private Limited UNIT 1",
    },

    {
      campCycleId: 258891,
      corpId: "9f2ccdd9-a5d2-426f-a196-1595c09353c0",
      orgName: "Iscon Balaji Foods Pvt. Ltd",
    },
    {
      campCycleId: 246291,
      corpId: "f8f43bf1-383a-49de-a9ea-68ec0a3fe58c",
      orgName: "PTPL TUBING AND PRODUCTS PVT LTD",
    },
    {
      campCycleId: 246149,
      corpId: "a3e384f3-de59-499f-a5dc-f2621cc6e4c1",
      orgName: "Resin and Pigments",
    },
    {
      campCycleId: 246381,
      corpId: "38b5388c-4d5d-4388-847e-cc8d6f6dc939",
      orgName: "Rusan Pharma LTD.",
    },
    {
      campCycleId: 138852,
      corpId: "28372173-fbba-4e78-958d-ebefad5c4498",
      orgName: "SHAKTI PUMP (INDIA) LTD",
    },
    {
      campCycleId: 246409,
      corpId: "c9c7a6d4-c72a-496b-8d38-91e878ec746d",
      orgName: "Dhoot Transmission Pvt Ltd",
    },
    {
      campCycleId: 246180,
      corpId: "cd86fc1d-ca50-42f2-9a53-1003aea3993e",
      orgName: "Pinnacle",
    },
    {
      campCycleId: 246221,
      corpId: "8e673e79-3b0d-421b-8a2e-f378d11ead99",
      orgName: "Shreepati Pharmaceuticals Pvt Ltd",
    },
    {
      campCycleId: 246262,
      corpId: "79eba6ad-8d78-432b-8d31-05e5277e6cb9",
      orgName: "Essentia Luxury Hotel Indore",
    },
    {
      campCycleId: 246315,
      corpId: "bdbeb610-c17b-4f5e-a577-5ba75a30b7db",
      orgName: "Bergwerff Organics India Pvt Ltd",
    },
    {
      campCycleId: 246316,
      corpId: "4099815f-25bf-4afa-9ff4-47dd8a7970b5",
      orgName: "SPR Engenious",
    },
    {
      campCycleId: 246238,
      corpId: "701b58c4-02f2-43fa-9940-6ace06e38c0b",
      orgName: "Hazargo industries Pvt Ltd",
    },
    {
      campCycleId: 246145,
      corpId: "ee825bad-ed64-46ed-a3a2-67a17f81ac7f",
      orgName: "Innovative Clad Solutions Pvt Ltd",
    },
    {
      campCycleId: 246253,
      corpId: "1922409b-e382-430b-8d20-1ddc7bf2dba6",
      orgName: "SURYAVANSHI MACHINE TOOLS",
    },
    {
      campCycleId: 246224,
      corpId: "f912a98a-e492-439a-9dc2-150792b0ee63",
      orgName: "Swaraj Technocrafts Pvt Ltd",
    },
    {
      campCycleId: 246383,
      corpId: "214c8de2-8a6b-49ad-a295-ffe62da75ef0",
      orgName: "Combined Engineering Private Limited",
    },
    {
      campCycleId: 246314,
      corpId: "f28a2521-06e7-4d9b-9323-2549660abef9",
      orgName: "Cummins Turbo Technologies Pvt. Ltd. Dewas",
    },
    // {
    //   campCycleId: 194482,
    //   corpId: "98ced693-bc3c-4562-b6f2-2e057d9bdd8b",
    //   orgName: "Force Motors Limited",
    // }
    // ,
    // {
    //   campCycleId: 246203,
    //   corpId: "6c1a727d-7f98-41b1-9e19-3f6a9a17aae9",
    //   orgName: "Tata International Ltd",
    // },
    // {
    //   campCycleId: 246161,
    //   corpId: "c731f902-2ee0-41b3-a609-f49ce33b24fb",
    //   orgName: "Tufnets Private Limited (Unit-2)",
    // },
    // {
    //   campCycleId: 246198,
    //   corpId: "fde4f329-e3fb-4daf-ad6c-aeed4965aa05",
    //   orgName: "Bectors Food Specialities Limited",
    // },
    // {
    //   campCycleId: 246233,
    //   corpId: "1a8ad530-2544-4a9c-91c9-f207d7795460",
    //   orgName: "ENTITLED SOLUTIONS PRIVATE LIMITED",
    // },
    // {
    //   campCycleId: 246222,
    //   corpId: "a2a627a8-7396-4156-8c12-9dd2fca2120b",
    //   orgName: "TPGLOBAL CREATIONS PRIVATE LIMITED",
    // },
    // {
    //   campCycleId: 246350,
    //   corpId: "a9aff3e6-3bd0-40f7-b9c2-4c7cf444c439",
    //   orgName: "Tufropes Pvt. Ltd Mumbai",
    // },
    // {
    //   campCycleId: 246214,
    //   corpId: "f868c152-695f-4059-b10f-ac62fabf7be2",
    //   orgName: "MAAN ALUMINIUM LTD.",
    // },
    // {
    //   campCycleId: 246289,
    //   corpId: "cd8365a2-6277-40a3-a1bd-4473284fe528",
    //   orgName: "Wonder Cement",
    // },
    // {
    //   campCycleId: 246247,
    //   corpId: "e3c09e06-145f-40c4-bce6-f8772789601b",
    //   orgName: "Larsen & Toubro Limited",
    // },
    // {
    //   campCycleId: 246392,
    //   corpId: "f7f15895-a3c3-49c6-9b43-7c748b750eec",
    //   orgName: "Vikram Woollens",
    // },
    // {
    //   campCycleId: 246159,
    //   corpId: "fae5d4c3-7f90-4ee9-95c5-21bf2b1b6037",
    //   orgName: "Zest Pharma",
    // },
    // {
    //   campCycleId: 246187,
    //   corpId: "01f1ba23-91fc-406e-8dfe-d733814bfacc",
    //   orgName: "Daulat Ram Engineering Services (P) Ltd",
    // },
    // {
    //   campCycleId: 246286,
    //   corpId: "296c76ed-9a62-48e2-aa38-9131d7f4a08e",
    //   orgName: "Capital Logistics",
    // },
    // {
    //   campCycleId: 246326,
    //   corpId: "37636a41-3bdb-4cd5-988c-513b08655d7d",
    //   orgName: "Singaji Thermal Power Plant",
    // },
  ],
}) => {
  console.log({ corps });
  const [generatedForms, setGeneratedForms] = useState([]);
  const [uploadedForms, setUploadedForms] = useState([]);
  const [form21Data, setForm21Data] = useState([]);
  const contentRef = useRef();
  const [file, setFile] = useState(null);
  const [paginatedEmployees, setPaginatedEmployees] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState(null);

  const generateForm21PDF = async (corpData) => {
    const { corpId, campCycleId } = corpData;
    const url = `${BASE_URL}org/form21?corpId=${corpId}&campCycleId=${
      campCycleId || ""
    }`;
    const url2 =
      BASE_URL +
      `org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId || ""}`;
    const response = await getData(url);
    const response2 = await getData(url2);
    if (response.error) {
      setForm21Data([]);
    } else {
      if (response.data && response2.data) {
        const form21 = response.data;
        const master = response2.data;
        const temp = form21
          .map((item) => ({
            ...item,
            fitness:
              master.find((val) => item.empId === val.empId)?.val
                ?.vitalsErrorData &&
              Object.keys(val.vitalsErrorData).length &&
              hasAdditionalKeys(val.vitalsErrorData)
                ? "Medical Consultation Advised"
                : "Fit",
          }))
          .filter((item) => item.medicalDate)
          ?.map((item, index) => ({
            ...item,
            sno: index + 1,
          }));

        setPaginatedEmployees(paginateEmployeesFunction(temp));
        setIsDataReady(true);
        await waitForPaginatedData();

        // Once the data is ready, proceed with generating the PDF
        generatePDF(corpData);
      }
    }
  };

  const waitForPaginatedData = async () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (isDataReady && paginatedEmployees.length > 0) {
          clearInterval(interval);
          resolve(); // Continue when data is ready
        }
      }, 500); // Check every 500ms if the data is ready
    });
  };

  const uploadForm21Handler = async (corpData) => {
    if (
      generatedForms.includes(corpData?.corpId) &&
      !uploadedForms.includes(corpData?.corpId)
    ) {
      if (!file) {
        console.error("No file selected for upload");
        return;
      }

      await uploadForm21(file, corpData);
    }
  };

  const uploadForm21 = async (file, corpData) => {
    const { corpId, campCycleId } = corpData;
    const formData = new FormData();
    formData.append("file", file);

    const date = new Date().toISOString().split("T")[0];
    const url = `${BASE_URL}org/corpUpload?corpId=${
      corpId || ""
    }&corpUploadType=FORM_21&formCreateDate=${date}&campCycleId=${
      campCycleId || ""
    }`;

    try {
      const result = await uploadFile(url, formData);
      if (result.error) {
        console.error("Upload failed:", result.error);
      } else {
        console.log("Upload success");
        setUploadedForms((prev) => [...prev, corpData?.corpId]);
        setSelectedCorp(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const MAX_ROWS_FIRST_PAGE = 50;
  const MAX_ROWS_OTHER_PAGES = 55;
  const [isLoading, setIsLoading] = useState(false);
  const paginateEmployeesFunction = (data) => {
    const pages = [];
    let remainingRows = data.length;

    pages.push(data.slice(0, MAX_ROWS_FIRST_PAGE));
    remainingRows -= MAX_ROWS_FIRST_PAGE;

    while (remainingRows > 0) {
      const nextPageRows = Math.min(remainingRows, MAX_ROWS_OTHER_PAGES);
      pages.push(
        data.slice(
          data.length - remainingRows,
          data.length - remainingRows + nextPageRows
        )
      );
      remainingRows -= nextPageRows;
    }

    return pages;
  };

  const printRef = useRef();

  const generatePDF = async (corpData) => {
    if (!isDataReady || paginatedEmployees.length === 0) {
      console.log("Waiting for data...");
      return; // Prevent PDF generation if paginated data is not ready
    }
    setFile(null);
    setIsLoading(true);
    const element = printRef.current;

    const options = {
      // margin: 5,
      filename: "form21.pdf",
      // image: { type: "jpeg", quality: 0.98 },
      // html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      // jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: {
        avoid: "tr",
        mode: "css",
        before: "#page2el",
        after: "1cm",
      },
    };

    try {
      const pdfBlob = await html2pdf()
        .from(element)
        .set(options)
        .output("blob");
      const file = new File([pdfBlob], "Form21.pdf", {
        type: "application/pdf",
      });

      setFile(file); // Ensure file state is updated
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setGeneratedForms((prev) => [...prev, corpData?.corpId]); // Update generated forms

      console.log("PDF Generated Successfully");
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Normal
  const [tableWidthColumn, setTableWidthColumn] = useState({
    colSrNo: "5%",
    colEmpId: "8%",
    colName: "13%",
    colGender: "5%",
    colAge: "3%",
    colOccupation: "16%",
    colDOJ: "8%",
    colDOL: "5%",
    colROL: "5%",
    colSection: "4%",
    colMedicalData: "8%",
    colFitness: "8%",
    colDoctorSign: "5.5%",
    colSergeonSign: "5.5%",
  });

  // // Modified;
  // const [tableWidthColumn, setTableWidthColumn] = useState({
  //   colSrNo: "5%",
  //   colEmpId: "8%",
  //   colName: "14%",
  //   colGender: "5%",
  //   colAge: "3%",
  //   colOccupation: "25%",
  //   colDOJ: "4%",
  //   colDOL: "4%",
  //   colROL: "4%",
  //   colSection: "4%",
  //   colMedicalData: "8%",
  //   colFitness: "5%",
  //   colDoctorSign: "5.5%",
  //   colSergeonSign: "5.5%",
  // });

  const [noOfRowsForSingleSign, setNoOfRowsForSingleSign] = useState(8);
  const [gapBetweenSign, setGapBetweenSign] = useState(130);
  const [topMarginFromFirstSign, setTopMarginFromFirstSign] = useState(230);

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  //   documentTitle: `Form21.pdf`,
  //   copyStyles: true,
  // });

  const handlePrint = useReactToPrint({
    documentTitle: "Form21",
    contentRef: printRef,
    copyStyles: true,
  });

  const [files, setFiles] = useState(null);
  // const [isLoading, setIsLoading] = React.useState(false);

  const handleUpload = async (corpData) => {
    const { corpId, campCycleId } = corpData;

    if (!files) {
      console.log("No file selected");
      return;
    }

    setIsLoading(true);
    const propertyName = "file";
    const updatedFormData = new FormData();
    updatedFormData.append(propertyName, files);
    const date = new Date().toISOString().split("T")[0];
    const url =
      BASE_URL +
      `org/corpUpload?corpId=${corpId}&corpUploadType=FORM_21&formCreateDate=${date}&campCycleId=${
        campCycleId || ""
      }`;

    const result = await uploadFile(url, updatedFormData);

    if (result.data) {
      setIsLoading(false);
      console.log("SUCCESS");
      enqueueSnackbar("Successfully Uploaded!", {
        variant: "success",
      });
    } else {
      setIsLoading(false);
      console.log("ERROR");
      enqueueSnackbar("An error Occured!", {
        variant: "error",
      });
    }
  };

  return (
    <Paper
      sx={{ padding: 2, maxWidth: 600, margin: "auto", textAlign: "center" }}
    >
      <Typography variant="h6" gutterBottom>
        Form 21 Status Tracker
      </Typography>
      <Typography variant="body1">Total Corps: {corps.length}</Typography>
      <Typography variant="body1">
        Forms Generated: {generatedForms.length}
      </Typography>
      <Typography variant="body1">
        Forms Uploaded: {uploadedForms.length}
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Corp Id</TableCell>
              <TableCell>CampCycleId</TableCell>
              <TableCell>orgName</TableCell>
              <TableCell>Generate Form 21</TableCell>
              <TableCell>Print</TableCell>
              <TableCell>Upload Form 21</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {corps.map((corp) => (
              <TableRow key={corp.corpId}>
                <TableCell>{corp.corpId}</TableCell>
                <TableCell>{corp.campCycleId}</TableCell>
                <TableCell>{corp.orgName}</TableCell>
                <TableCell>
                  {/* <GenerateForm21PDF
                    generateForm21PDF={generateForm21PDF}
                    generatedForms={generatedForms}
                    setGeneratedForms={setGeneratedForms}
                    corpData={corp}
                    data={form21Data}
                    setFile={setFile} */}
                  {/* /> */}
                  <Button
                    disabled={generatedForms.includes(corp.id)}
                    onClick={() => generateForm21PDF(corp)}
                    variant="contained"
                  >
                    Generate Form 21 PDF
                  </Button>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      paddingInline: "10px",
                      paddingBlock: "2px",
                      border: "1px solid #777777",
                      borderRadius: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        setFiles(e.target.files[0]);
                      }}
                    />
                    <Button
                      sx={{ m: 0, p: "5px" }}
                      size="small"
                      color="primary"
                      onClick={() => handleUpload(corp)}
                    >
                      Upload File
                    </Button>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={
                      !generatedForms.includes(corp.corpId) ||
                      uploadedForms.includes(corp.corpId)
                    }
                    onClick={() => {
                      uploadForm21Handler(corp);
                    }}
                  >
                    {uploadedForms.includes(corp.id) ? "Uploaded" : "Upload"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "none" }}>
        <div
          ref={printRef}
          style={{
            position: "relative",
            fontStyle: "Arial",
            fontSize: "11px",
          }}
        >
          {paginatedEmployees.map((page, pageIndex) => (
            <div
              key={pageIndex}
              id="page2el"
              style={{
                height: "270.4mm",
                paddingBlock: "40px",
                position: "relative",
                marginBlock: "20px",
              }}
            >
              <Fragment>
                <p
                  style={{
                    textAlign: "center",
                    margin: "0 0 10px",
                    fontWeight: "bold",
                  }}
                >
                  Form Number 21
                </p>
                <p
                  style={{
                    textAlign: "center",
                    margin: "0 0 20px",
                    fontWeight: "bold",
                  }}
                >
                  Prescribed under Rule (19) Health Register
                </p>
                <p
                  style={{
                    textAlign: "center",
                    margin: "0 0 20px",
                    fontWeight: "bold",
                  }}
                >
                  In respect of person employed in occupation declared to be
                  dangerous operations under section 87
                </p>
                <p
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Name of certifying surgeon: Dr Kunal Sharma
                </p>

                <div>
                  <table
                    style={{
                      width: `${100 / 0.9}%`,
                      borderCollapse: "collapse",
                      fontSize: "11px",
                      textAlign: "center",
                      transform: "scale(0.9)", // Reduce the scale to 80% (adjust the value as needed)
                      transformOrigin: "top left",
                      display: "inline-block",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colSrNo,
                          }}
                        >
                          Sr No.
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colEmpId,
                          }}
                        >
                          Emp ID
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            textAlign: "center",
                            width: tableWidthColumn.colName,
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colGender,
                          }}
                        >
                          Gender
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colAge,
                          }}
                        >
                          Age
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            textAlign: "center",
                            width: tableWidthColumn.colOccupation,
                          }}
                        >
                          Occupation
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            textAlign: "center",
                            width: tableWidthColumn.colDOJ,
                          }}
                        >
                          Date of joining
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colDOL,
                          }}
                        >
                          Date of leaving or transfer
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colROL,
                          }}
                        >
                          Reason for leaving or transfer
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colSection,
                          }}
                        >
                          Section
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colMedicalData,
                          }}
                        >
                          Medical Date
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            textAlign: "center",
                            width: tableWidthColumn.colFitness,
                          }}
                        >
                          Fitness
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colDoctorSign,
                          }}
                        >
                          Doctor Signature
                        </th>
                        <th
                          style={{
                            ...headerStyle,
                            width: tableWidthColumn.colSergeonSign,
                          }}
                        >
                          Certifying Surgeon Signature
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {page.map((emp, index) => (
                        <tr key={index} style={{ pageBreakInside: "avoid" }}>
                          <td style={cellStyle}>{emp.sno}</td>
                          <td style={cellStyle}>{emp.empId}</td>
                          <td
                            style={{
                              textAlign: "left",
                              ...cellStyle,
                              textTransform: "capitalize",
                            }}
                          >
                            {emp?.name?.toLowerCase()}
                          </td>
                          <td
                            style={{
                              textTransform: "capitalize",
                              ...cellStyle,
                            }}
                          >
                            {emp?.gender?.toLowerCase()}
                          </td>
                          <td style={cellStyle}>{emp.age}</td>
                          <td
                            style={{
                              textTransform: "capitalize",
                              ...cellStyle,
                            }}
                          >
                            {emp?.occupation?.toLowerCase()}
                          </td>
                          <td style={cellStyle}>{emp.dateOfJoining}</td>
                          <td style={cellStyle}>
                            {emp.dateOfLeavingOrTransfer}
                          </td>
                          <td style={cellStyle}>
                            {emp.reasonsForLeavingOrTransfer}
                          </td>
                          <td style={cellStyle}>{emp.section}</td>
                          <td style={cellStyle}>{emp.medicalDate}</td>
                          <td style={{ textAlign: "center", ...cellStyle }}>
                            {emp.fitness?.toLowerCase()}
                          </td>
                          <td style={cellStyle}></td>
                          <td style={cellStyle}></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {page.map((emp, rowIndex) => {
                  const noOfRowsPerPage = page.length;

                  const noOfSignature = Math.floor(
                    noOfRowsPerPage / (parseInt(noOfRowsForSingleSign) || 6)
                  );

                  for (let i = 0; i < noOfSignature; i++) {
                    const signatureTopOffset =
                      (parseInt(topMarginFromFirstSign) || 270) +
                      i * (parseInt(gapBetweenSign) || 110);

                    if (rowIndex === i * parseInt(noOfRowsForSingleSign || 6)) {
                      return (
                        <img
                          key={`stamp-${i}-${rowIndex}`}
                          src={dr_kunal_stamp_sign}
                          alt="Certifying Surgeon Seal"
                          style={{
                            position: "absolute",
                            top: signatureTopOffset + "px",
                            left: "90%",
                            height: "80px",
                            objectFit: "contain",
                            opacity: 0.8,
                          }}
                        />
                      );
                    }
                  }
                })}
              </Fragment>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
};

export default CorpsForm21Tracker;

const headerStyle = {
  border: "0.2px solid black",
  fontStyle: "Arial",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#ddd",
};

const cellStyle = {
  fontStyle: "Arial",
  border: "0.2px solid black",
  fontWeight: "500",
  textTransform: "capitalize",
};
