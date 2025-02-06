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
} from "@mui/material";
import "../App.css";
// import GenerateForm21PDF from "./generateForm21Pdf";
import { BASE_URL } from "../assets/constant";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { useReactToPrint } from "react-to-print";

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
      campCycleId: 246351,
      corpId: "2887eb90-36c5-4850-93c1-0c20a298cff6",
      orgName: "Green Agro",
    },
    {
      campCycleId: 246321,
      corpId: "4cca6ada-9279-46f1-a9ef-ff8b3eec9ac0",
      orgName: "volvo Eicher",
    },
    {
      campCycleId: 246348,
      corpId: "4048a3cc-076f-46e9-8212-9729f72b3862",
      orgName: "VRS Food - Gwalior",
    },
    {
      campCycleId: 246398,
      corpId: "6208be7c-4632-4757-bec4-bc42ddcc54b6",
      orgName: "HARI OM SAI",
    },
    {
      campCycleId: 246248,
      corpId: "c7a222f4-eb45-478f-82f5-cf6cd3a9e8ca",
      orgName: "CD Safety And Security Services LLP",
    },
    {
      campCycleId: 246240,
      corpId: "2e6fb1ac-2720-4536-ab9a-dcd005d5a707",
      orgName: "JSW Steel Coated Products Limited",
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
      campCycleId: 246257,
      corpId: "f4db2426-00b7-4fc0-91d7-99f073bd8be3",
      orgName: "Flexituff Ventures Int",
    },
    {
      campCycleId: 246357,
      corpId: "769987c2-0a25-4c1d-922e-3e939e009bcf",
      orgName: "Effotel By Sayaji-Bhopal",
    },
    {
      campCycleId: 246395,
      corpId: "e770c933-4f5b-4638-bde2-7ac67a572658",
      orgName: "JAI KALYAN HERBALS AND EXPORTS",
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
      campCycleId: 246330,
      corpId: "f37d6dd1-0ba8-4217-bd28-cca55fb3a2da",
      orgName: "Hitech Butterfly Valves",
    },
    {
      campCycleId: 246208,
      corpId: "2a562223-7ded-44f6-b9bb-47877cd1312e",
      orgName: "B. PRASHAL",
    },
    {
      campCycleId: 246236,
      corpId: "c4dfe545-adb2-4fa3-8319-643650543e5a",
      orgName: "Gagan Gases Ltd.",
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
      campCycleId: 246199,
      corpId: "22badbea-6233-4534-b41f-d551898bd85b",
      orgName: "Imperial Auto",
    },
    {
      campCycleId: 246341,
      corpId: "f013ba4d-d09a-4fdd-bb26-3a2bdd211680",
      orgName: "INDO BORAX & CHEMICALS LTD.",
    },
    {
      campCycleId: 246245,
      corpId: "c59a2fbc-bc3d-453c-aae4-313581793890",
      orgName: "Indore Composite Pvt. Ltd",
    },
    {
      campCycleId: 246251,
      corpId: "24287003-6b59-40e8-9af4-8874389be26f",
      orgName: "Jay Kalyan Herbals",
    },
    {
      campCycleId: 246292,
      corpId: "11081ae7-ecf3-4e06-b68f-784cba49170c",
      orgName: "Mittal Appliances LTD.",
    },
    {
      campCycleId: 246344,
      corpId: "8b4b4288-a02a-4158-8f1b-cd26817a176d",
      orgName: "UNIT-4 RSPL LIMITED",
    },
    {
      campCycleId: 246187,
      corpId: "01f1ba23-91fc-406e-8dfe-d733814bfacc",
      orgName: "Daulat Ram Engineering Services (P) Ltd",
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
      campCycleId: 246190,
      corpId: "0e74ce39-34be-4a80-80a3-a2a02f27c319",
      orgName: "Mantram",
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
      campCycleId: 246269,
      corpId: "83fc8ee8-9988-4a2d-b477-970bc5fe26c5",
      orgName: "Flexi Caps & Polymers Pvt. Ltd.",
    },
    {
      campCycleId: 246230,
      corpId: "44dd092f-3c86-4d2d-8a26-0e6b14dc00c3",
      orgName: "Deccan Techno Security & Utility services Pvt. Ltd.",
    },
    {
      campCycleId: 246293,
      corpId: "723c7fe8-f9af-40ad-9951-e7b0b901b938",
      orgName: "Kesar Alloys & Metals Pvt Ltd",
    },
    {
      campCycleId: 246394,
      corpId: "8be91366-618a-4173-a90b-b66cab9aa563",
      orgName: "Kisan Irrigation and Infrasturcture Ltd",
    },
    {
      campCycleId: 246157,
      corpId: "1b11dfbb-8957-4d88-af0a-30c38bb4ffe4",
      orgName: "Krishna Enterprises",
    },
    {
      campCycleId: 246389,
      corpId: "181f99f5-45cf-4328-a760-f48c871a81f3",
      orgName: "Tufropes Private Limited (Vadodara)",
    },
    {
      campCycleId: 246144,
      corpId: "35d2620a-bd2b-4b20-be9c-ee93afe0e446",
      orgName: "Life First Pharma Pvt. Ltd.",
    },
    {
      campCycleId: 246345,
      corpId: "4620c347-1a5a-4684-be1e-ea91b168b51f",
      orgName: "RSPL LTD. Unit 3",
    },
    {
      campCycleId: 246169,
      corpId: "e9b4c7f3-025b-41ca-b078-e342c79abf16",
      orgName: "Kohinoor Elastic Private Limited Indore",
    },
    {
      campCycleId: 246359,
      corpId: "4d9b57f5-a06b-4d69-982a-fdfa24633273",
      orgName: "Cyno Pharma Pvt Ltd.",
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
      campCycleId: 246301,
      corpId: "f5e33ff7-7b5a-4240-b647-2371526bc156",
      orgName: "J.B. Mangharam Foods Pvt. Ltd",
    },
    {
      campCycleId: 246189,
      corpId: "bba25d9d-25b2-4441-844b-8acaaae1f249",
      orgName: "SYMBOISIS FOUNDATION",
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
      campCycleId: 246349,
      corpId: "086e463d-634a-4945-8960-12b03fed0a8f",
      orgName: "Endo India Par Formulations Private Limited",
    },
    {
      campCycleId: 246334,
      corpId: "716a056f-a42c-4a37-9168-271bde618e22",
      orgName: "Balaji Wafers Pvt ltd",
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
      campCycleId: 246170,
      corpId: "c7f0c404-0e82-49e4-ba53-7be95760f407",
      orgName: "UNIK MEDICCARE SOLUTION",
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
      campCycleId: 246297,
      corpId: "627ee97a-532c-4c72-b1dd-2880b044c4a6",
      orgName: "Acoem Ecotech Industries Pvt Ltd",
    },
    {
      campCycleId: 246146,
      corpId: "51ad976c-39b9-48c4-9b9f-f159541948ef",
      orgName: "TEMP UNO",
    },
    {
      campCycleId: 246320,
      corpId: "0abfe968-a710-4bae-8a01-d09034adca55",
      orgName: "Asian Organics",
    },
    {
      campCycleId: 246162,
      corpId: "38326c7e-b4cf-4134-9da4-a7c5819d2024",
      orgName: "Greencross Agro Chemicals Pvt. Ltd",
    },
    {
      campCycleId: 246154,
      corpId: "912b6281-37a9-468b-897d-ad8feea70e10",
      orgName: "Methodex Systems Pvt Ltd Indore",
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
      campCycleId: 246369,
      corpId: "6d5ce94f-6b9b-4efa-a650-1298481cb413",
      orgName: "Encube Ethicals Private Limited",
    },
    {
      campCycleId: 253638,
      corpId: "5359f5e7-825f-4aa9-b649-0efa013945bc",
      orgName: "Lapp India Dharuhera",
    },
    {
      campCycleId: 246167,
      corpId: "9e264b41-a6bc-4d9d-83cb-4fd5f54173a9",
      orgName: "G.G. Automotive Gears Ltd.",
    },
    {
      campCycleId: 246205,
      corpId: "0b516a46-0a07-4daf-9518-cd23b391523a",
      orgName: "MSL EYE",
    },
    {
      campCycleId: 246385,
      corpId: "0143386f-5bc2-4df8-ad70-43d4c7360cb2",
      orgName: "MUDRA STEEL INDUSTRIES PRIVATE LIMITED",
    },
    {
      campCycleId: 246237,
      corpId: "91c72280-4947-405e-8ae7-b9190b955622",
      orgName: "Narmada Milk and Milk Products",
    },
    {
      campCycleId: 246342,
      corpId: "ba6058d3-fe9e-44fa-80e6-ae6fb385c605",
      orgName: "Nasik Steel",
    },
    {
      campCycleId: 253637,
      corpId: "afb32577-5157-4321-87cc-a980ea256e7f",
      orgName: "Lapp India Pune",
    },
    {
      campCycleId: 246363,
      corpId: "9ccbb3b7-1732-46e8-b131-c321555804e4",
      orgName: "Gabriel Dewas..",
    },
    {
      campCycleId: 246164,
      corpId: "1d49173b-ab6d-44d2-9a68-1895af1f8ca2",
      orgName: "Grasim Chemical Divisions",
    },
    {
      campCycleId: 246408,
      corpId: "e64f77f8-528a-42cf-852b-a093b1d3d318",
      orgName: "JK Cement Limited, Ujjain",
    },
    {
      campCycleId: 246294,
      corpId: "453d8528-35e5-4f09-bf20-16e5120503ee",
      orgName: "Padma Polytex India Pvt ltd",
    },
    {
      campCycleId: 246173,
      corpId: "4a9a4ba9-5a0d-45fe-a4c8-2c882e20a4e2",
      orgName: "Papcon Indore Pvt Ltd",
    },
    {
      campCycleId: 246155,
      corpId: "d2a6fd96-c3ca-4e4e-8a3c-45875964d15a",
      orgName: "THE PARK HOTEL",
    },
    {
      campCycleId: 246261,
      corpId: "d4023c61-27f9-4063-8238-7a54435ffb37",
      orgName: "Panasonic Energy India Co. Ltd",
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
      campCycleId: 246368,
      corpId: "46323520-c46b-4b81-96ab-43f1ac090445",
      orgName: "Methodex Systems Private Limited",
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
      campCycleId: 246267,
      corpId: "696f5b26-9737-4e4d-974e-080676c21f95",
      orgName: "GG Automotive gears limited",
    },
    {
      campCycleId: 246194,
      corpId: "d17fab6f-5d60-4d2d-b65a-41397929606d",
      orgName: "Hinduja Housing Finance",
    },
    {
      campCycleId: 246387,
      corpId: "ad1c5998-9842-4e14-95da-b35248ddb6b0",
      orgName: "Tufropes Private limited (Silvassa)",
    },
    {
      campCycleId: 246183,
      corpId: "a931c620-7809-4f41-9c88-82a08bf33bcf",
      orgName: "Porwal Auto Components Ltd",
    },
    {
      campCycleId: 246242,
      corpId: "8a8f98e4-6283-44ff-ba1b-e589e7f327b3",
      orgName: "Tufnets Private Limited UNIT 1",
    },
    {
      campCycleId: 246185,
      corpId: "0d9e84f5-8548-43be-8f62-936452e0a21b",
      orgName: "Azis Labs",
    },
    {
      campCycleId: 246227,
      corpId: "e8bec757-c176-43dc-b708-fb2eaa6b0a81",
      orgName: "IPCA",
    },
    {
      campCycleId: 258891,
      corpId: "9f2ccdd9-a5d2-426f-a196-1595c09353c0",
      orgName: "Iscon Balaji Foods Pvt. Ltd",
    },
    {
      campCycleId: 246323,
      corpId: "87423b0d-7753-4321-9ac6-ab38eeed02ab",
      orgName: "Asian Organics",
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
      campCycleId: 246327,
      corpId: "dd491d3b-8a1b-493a-99cf-730fafa7c468",
      orgName: "Rebel Foods",
    },
    {
      campCycleId: 246264,
      corpId: "0d2ef92b-5527-4170-88b4-a3a72c7f1071",
      orgName: "Satya Sai Enterprise",
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
      campCycleId: 246220,
      corpId: "0d613a7a-8fa5-4faf-a945-c67df46e9664",
      orgName: "Shivangi Rolling Mills Pvt. Ltd.",
    },
    {
      campCycleId: 246156,
      corpId: "16d6c57c-93cb-40d6-949f-d5f821e6e320",
      orgName: "Shivani Detergents Pvt. Ltd. 2",
    },
    {
      campCycleId: 246200,
      corpId: "b1cd1ee7-1c0d-4702-b9e8-39c3dc4a6537",
      orgName: "Bridgestone Indore",
    },
    {
      campCycleId: 246180,
      corpId: "cd86fc1d-ca50-42f2-9a53-1003aea3993e",
      orgName: "Pinnacle",
    },
    {
      campCycleId: 246337,
      corpId: "42a58e7d-a63b-4efb-9b81-1aac0595bf67",
      orgName: "Bharat Petroleum Corporation Limited",
    },
    {
      campCycleId: 246310,
      corpId: "5ddfb84b-d63a-4a49-bc26-00c4694d0023",
      orgName: "Govt. Girls Higher Secondary School Mhow",
    },
    {
      campCycleId: 246307,
      corpId: "9356260d-2afd-40d8-a20a-a9f3adacb605",
      orgName: "Shreepati Pharmaceuticals",
    },
    {
      campCycleId: 246221,
      corpId: "8e673e79-3b0d-421b-8a2e-f378d11ead99",
      orgName: "Shreepati Pharmaceuticals Pvt Ltd",
    },
    {
      campCycleId: 246308,
      corpId: "123f4f17-82c6-42e3-9d26-a10e1e719c70",
      orgName: "SHYAM SEL & POWER LIMITED",
    },
    {
      campCycleId: 246262,
      corpId: "79eba6ad-8d78-432b-8d31-05e5277e6cb9",
      orgName: "Essentia Luxury Hotel Indore",
    },
    {
      campCycleId: 246303,
      corpId: "8110bcb0-c982-4caa-b1ab-fbab1fe08795",
      orgName: "Baerlocher Additives India Private Limited",
    },
    {
      campCycleId: 246315,
      corpId: "bdbeb610-c17b-4f5e-a577-5ba75a30b7db",
      orgName: "Bergwerff Organics India Pvt Ltd",
    },
    {
      campCycleId: 246286,
      corpId: "296c76ed-9a62-48e2-aa38-9131d7f4a08e",
      orgName: "Capital Logistics",
    },
    {
      campCycleId: 246179,
      corpId: "c6883fa1-46a0-4e9d-aa4a-11ee2c2b9663",
      orgName: "Beryl Drugs Ltd.",
    },
    {
      campCycleId: 246243,
      corpId: "7de5c5cb-02b9-4936-8322-a5fb8dc8853b",
      orgName: "MAJESTIC RICE BHOPAL",
    },
    {
      campCycleId: 246404,
      corpId: "3057763e-8f22-401c-9581-12491695ee69",
      orgName: "SM Auto Engineering Pvt Ltd",
    },
    {
      campCycleId: 246406,
      corpId: "1e514c4c-e3f3-4798-a283-c74b1826eb73",
      orgName: "Speciality Organics Pvt Ltd",
    },
    {
      campCycleId: 246316,
      corpId: "4099815f-25bf-4afa-9ff4-47dd8a7970b5",
      orgName: "SPR Engenious",
    },
    {
      campCycleId: 246209,
      corpId: "4fdbefd5-acbc-456d-8ced-0d91fa377d7f",
      orgName: "SPR ENGENIOUS LIMITED",
    },
    {
      campCycleId: 246258,
      corpId: "0ae5a507-15c6-492e-b8b8-fd3d0843d317",
      orgName: "SRF LIMITED",
    },
    {
      campCycleId: 246228,
      corpId: "cbec195d-8d3c-4513-bb20-130a5cfda2f7",
      orgName: "Supreme Facility Management pvt ltd",
    },
    {
      campCycleId: 246326,
      corpId: "37636a41-3bdb-4cd5-988c-513b08655d7d",
      orgName: "Singaji Thermal Power Plant",
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
      campCycleId: 246216,
      corpId: "b046abc6-fc5a-468e-b4b7-8068b7b185c9",
      orgName:
        "CG Power and Industrial Solutions Limited - Drives & Automation Division",
    },
    {
      campCycleId: 246224,
      corpId: "f912a98a-e492-439a-9dc2-150792b0ee63",
      orgName: "Swaraj Technocrafts Pvt Ltd",
    },
    {
      campCycleId: 246147,
      corpId: "32c69ad9-a2b8-4739-af32-e0114df03ef8",
      orgName: "Swastik Plasticizers and Pvc Pipes Indore Pvt ltd",
    },
    {
      campCycleId: 246374,
      corpId: "656f54f4-e8c0-42f5-afc1-31e158fe8f6f",
      orgName: "Symbiosis University of Applied Sciences",
    },
    {
      campCycleId: 246347,
      corpId: "e563fef3-5e74-4a56-8397-81af7787fa7a",
      orgName: "Syncom Formulations India Limited",
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
    {
      campCycleId: 194482,
      corpId: "98ced693-bc3c-4562-b6f2-2e057d9bdd8b",
      orgName: "Force Motors Limited",
    },
    {
      campCycleId: 246203,
      corpId: "6c1a727d-7f98-41b1-9e19-3f6a9a17aae9",
      orgName: "Tata International Ltd",
    },
    {
      campCycleId: 246213,
      corpId: "d7a2ebb9-e91d-400a-b290-69a8d7c0bdfb",
      orgName: "Tru worth/Aceom",
    },
    {
      campCycleId: 246161,
      corpId: "c731f902-2ee0-41b3-a609-f49ce33b24fb",
      orgName: "Tufnets Private Limited (Unit-2)",
    },
    {
      campCycleId: 246198,
      corpId: "fde4f329-e3fb-4daf-ad6c-aeed4965aa05",
      orgName: "Bectors Food Specialities Limited",
    },
    {
      campCycleId: 246233,
      corpId: "1a8ad530-2544-4a9c-91c9-f207d7795460",
      orgName: "ENTITLED SOLUTIONS PRIVATE LIMITED",
    },
    {
      campCycleId: 246222,
      corpId: "a2a627a8-7396-4156-8c12-9dd2fca2120b",
      orgName: "TPGLOBAL CREATIONS PRIVATE LIMITED",
    },
    {
      campCycleId: 246350,
      corpId: "a9aff3e6-3bd0-40f7-b9c2-4c7cf444c439",
      orgName: "Tufropes Pvt. Ltd Mumbai",
    },
    {
      campCycleId: 246214,
      corpId: "f868c152-695f-4059-b10f-ac62fabf7be2",
      orgName: "MAAN ALUMINIUM LTD.",
    },
    {
      campCycleId: 246289,
      corpId: "cd8365a2-6277-40a3-a1bd-4473284fe528",
      orgName: "Wonder Cement",
    },
    {
      campCycleId: 266243,
      corpId: "1d9770ff-5424-4b0a-abc6-08bf0962cbbd",
      orgName: "Iscon Balaji Foods Pvt Ltd",
    },
    {
      campCycleId: 246188,
      corpId: "ee0fa3c5-09c4-4b6b-b63c-e0892d6d5062",
      orgName: "Piramal Pharma Solutions",
    },
    {
      campCycleId: 246215,
      corpId: "f14751b4-1603-48ef-8b89-b108c943be7a",
      orgName: "Shivani True Packers",
    },
    {
      campCycleId: 266579,
      corpId: "47f6ab07-4fc2-45f8-83e0-38c88504861a",
      orgName: "RICH Products and Solutions",
    },
    {
      campCycleId: 246247,
      corpId: "e3c09e06-145f-40c4-bce6-f8772789601b",
      orgName: "Larsen & Toubro Limited",
    },
    {
      campCycleId: 246401,
      corpId: "72685ad2-9e7b-4ce9-9d6f-82f89cb5a604",
      orgName: "Adhoc Patients",
    },
    {
      campCycleId: 246392,
      corpId: "f7f15895-a3c3-49c6-9b43-7c748b750eec",
      orgName: "Vikram Woollens",
    },
    {
      campCycleId: 246212,
      corpId: "13a4b8c6-750f-442a-8414-f5465481e5d9",
      orgName: "VE Commercial Vehicles Bagroda",
    },
    {
      campCycleId: 246152,
      corpId: "6001f014-f157-42a4-915b-8f4d80434059",
      orgName: "Zedblack",
    },
    {
      campCycleId: 246159,
      corpId: "fae5d4c3-7f90-4ee9-95c5-21bf2b1b6037",
      orgName: "Zest Pharma",
    },
    {
      campCycleId: 246271,
      corpId: "b848a17b-4e27-4a57-9ccc-0847e5bfd0c4",
      orgName: "Uno.care",
    },
    {
      campCycleId: 246150,
      corpId: "69296dad-992a-4222-881e-862296efc4b0",
      orgName: "Lupin Limited",
    },
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
            fitness: master.find((val) => item.empId === val.empId)
              ?.isVitalsErrorData
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

  const MAX_ROWS_FIRST_PAGE = 45;
  const MAX_ROWS_OTHER_PAGES = 45;
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
    colOccupation: "12%",
    colDOJ: "8%",
    colDOL: "5%",
    colROL: "5%",
    colSection: "4%",
    colMedicalData: "8%",
    colFitness: "15%",
    colDoctorSign: "5.5%",
    colSergeonSign: "5.5%",
  });

  //Modified
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
  const [gapBetweenSign, setGapBetweenSign] = useState(120);
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
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      handlePrint();
                    }}
                  >
                    Print
                  </Button>
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
                height: "270mm",
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
