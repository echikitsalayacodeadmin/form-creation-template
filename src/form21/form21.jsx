// import React from "react";

// const form21 = () => {
//   const content = `
//   <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <link rel="preconnect" href="https://fonts.googleapis.com" />
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
//     <link
//       href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//       rel="stylesheet"
//     />
//     <title>Document</title>
//     <style type="text/css">
//       @page {
//         size: auto; /* auto is the initial value */
//         margin: 0;
//       }

//       html {
//         background-color: #ffffff;
//       }

//       * {
//         margin: 0;
//         padding: 0;
//         text-indent: 0;
//       }
//       body {
//         font-family: "Roboto", sans-serif;
//       }
//     </style>
//   </head>
//   <body>
//     <div
//       style="
//         margin: 20px;
//         border: 1px solid #000;
//         padding-block: 5px;
//         height: 95vh;
//       "
//     >
//       <div style="padding-inline: 10px; padding-bottom: 5px">
//         <Text style="display: flex; justify-content: space-between">
//           <span style="width: 23%"></span>
//           <span style="font-size: 17px; font-weight: bold">Form 21</span>
//           <span style="font-size: 14px; text-align: right"
//             >ULTRTECH CEMENT LIMITED</span
//           >
//         </Text>
//         <Text style="display: flex; justify-content: space-between">
//           <span style="width: 23%"></span>
//           <span style="font-size: 14px">[Prescribed under Rule (19)]</span>
//           <span style="font-size: 14px; text-align: right"
//             >(Unit: Dhar Cement Works)</span
//           >
//         </Text>
//         <Text style="display: flex; justify-content: space-between">
//           <span style="width: 32%"></span>
//           <span style="font-size: 17px; font-weight: bold; text-align: center"
//             >Health Register</span
//           >
//           <span style="font-size: 14px; text-align: right"
//             >Vill-Tonki, Ta-Manawar, Dist - Dhar (MP)</span
//           >
//         </Text>
//         <Text style="font-size: 14px">
//           (In respect of persons employed in occupations declared to be
//           dangerous under Section 87)
//         </Text>
//       </div>

//       <div>
//         <table
//           style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
//           width="100%"
//           cellspacing="0"
//         >
//           <thead>
//             <tr>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Serial No.
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Employee ID
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Name of Employee
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Age
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Sex
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Date of Birth
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Date of Employment on present work
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Date of transfer to other work
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Date of leaving, or discharge
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Reasons for leaving or transfer
//               </th>
//               <th
//                 scope="col"
//                 style="font-size: 12px; font-weight: 300; padding: 5px"
//               >
//                 Nature of Job or Occupation
//               </th>
//             </tr>
//             <tr>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 1
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 2
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 3
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 4
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 5
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 6
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 7
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 8
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 9
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 10
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                 "
//               >
//                 11
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr style="height: 30px">
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="font-size: 12px; font-weight: 300; padding: 5px"
//               ></th>
//             </tr>
//             <tr>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 2px;
//                   border-top: 0.5px solid #000;
//                 "
//               ></th>
//             </tr>
//           </tbody>
//         </table>
//         <table
//           style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
//           width="100%"
//           cellspacing="0"
//         >
//           <thead>
//             <tr>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Raw material or by-product handled
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Date of Medical Examination by certifying surgeon
//               </th>
//               <th
//                 scope="col"
//                 colspan="2"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 and Result of medical examination
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 If suspended from work, state period of suspension with detailed
//                 reasons (certifying surgeon)
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 Recertified fit to resume duty on (with signature of certifying
//                 surgeon)
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 If certificate of unfitness or suspension issued to work
//                 (certifying surgeon)
//               </th>
//               <th
//                 scope="col"
//                 style="font-size: 12px; font-weight: 300; padding: 5px"
//               >
//                 Signature with date of certifying surgeon
//               </th>
//             </tr>
//             <tr>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 10
//               </th>
//               <th
//                 colspan="2"
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 11
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 12
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 13
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                   border-right: 0.5px solid #000;
//                 "
//               >
//                 14
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-block: 0.5px solid #000;
//                 "
//               >
//                 15
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr style="height: 30px">
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   width: 60px;
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   width: 140px;
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   text-align: left;
//                 "
//               >
//                 <Text style="height: 25px">G / E:</Text>
//                 <Text style="height: 25px">Blood:</Text>
//                 <Text style="height: 25px">CXR:</Text>
//                 <Text style="height: 25px">ECG:</Text>
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   width: 60px;
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   text-align: center;
//                 "
//               >
//                 <span>Fit</span>
//               </th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="
//                   font-size: 10px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></th>
//               <th
//                 scope="col"
//                 style="font-size: 10px; font-weight: 300; padding: 5px"
//               ></th>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div style="border-top: 1px solid #000; margin-top: 5px">
//         <Text
//           style="
//             font-size: 17px;
//             font-weight: bold;
//             text-align: center;
//             padding: 5px;
//           "
//         >
//           <u>MEDICAL CHECK UP REPORT</u>
//         </Text>
//       </div>
//       <div
//         style="
//           padding: 5px;
//           border-top: 1px solid #000;
//           display: flex;
//           justify-content: space-between;
//         "
//       >
//         <Text style="width: 48%; font-weight: 400; display: flex">
//           <span style="font-size: 13px; font-weight: 400"
//             >Contractor's Name:</span
//           >
//           <span style="font-size: 13px; font-weight: 400"></span>
//         </Text>
//         <Text style="width: 26%; display: flex">
//           <span style="font-size: 13px; font-weight: 400">Department:</span>
//           <span style="font-size: 13px; font-weight: 400"></span>
//         </Text>
//         <Text style="width: 26%; display: flex">
//           <span style="font-size: 13px; font-weight: 400">Designation:</span>
//           <span style="font-size: 13px; font-weight: 400"></span>
//         </Text>
//       </div>
//       <div style="padding: 5px; display: flex; justify-content: space-between">
//         <Text style="width: 48%; font-weight: 400; display: flex">
//           <span style="font-size: 13px; font-weight: 400">Mob No:</span>
//           <span style="font-size: 13px; font-weight: 400"></span>
//         </Text>
//         <Text style="width: 52%; display: flex">
//           <span style="font-size: 13px; font-weight: 400">H/o Habit:</span>
//           <span style="font-size: 13px; font-weight: 400; margin-left: 10px"
//             >No / Tobacco / Smoking / Gutka / Alcohol ...</span
//           >
//         </Text>
//       </div>
//       <div
//         style="
//           padding: 5px;
//           border-bottom: 1px solid #000;
//           display: flex;
//           justify-content: space-between;
//         "
//       >
//         <Text style="width: 48%; display: flex">
//           <span style="font-size: 13px; font-weight: 400">Blood Group:</span>
//           <span
//             style="font-size: 13px; font-weight: 400; margin-left: 10px"
//           ></span>
//         </Text>
//         <Text style="width: 52%; display: flex">
//           <span style="font-size: 14px; font-weight: 400">ID Mark:</span>
//           <span style="font-size: 14px; font-weight: 400; margin-left: 10px"
//             >A Black Mole / Cust Marl / Scar / Tatoo Mark on ...</span
//           >
//         </Text>
//       </div>
//       <div style="padding: 5px">
//         <Text style="font-size: 17px; font-weight: 400">General Check Up</Text>
//       </div>
//       <table
//         style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
//         width="60%"
//         cellspacing="0"
//       >
//         <thead>
//           <tr>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               Weight (Kg)
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               Height (cm)
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               B.P. (mm of Hg)
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               Pulse/min
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               Resp. Rate/min
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               scope="col"
//             >
//               SpO2%
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr style="height: 50px">
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//           </tr>
//         </tbody>
//       </table>
//       <div style="padding: 5px">
//         <Text style="font-size: 17px; font-weight: 400">Eye Examination :</Text>
//       </div>
//       <div style="display: flex; justify-content: space-between">
//         <table
//           style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
//           width="48%"
//           cellspacing="0"
//         >
//           <thead>
//             <tr>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Use of Spectacles
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 colspan="2"
//                 scope="col"
//               >
//                 Right Eye
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 colspan="2"
//                 scope="col"
//               >
//                 Left Eye
//               </th>
//             </tr>
//             <tr>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Yes / No
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Right Eye
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Left Eye
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Right Eye
//               </th>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="col"
//               >
//                 Left Eye
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="row"
//               >
//                 Distant Vision
//               </th>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//             </tr>
//             <tr>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//                 scope="row"
//               >
//                 Near Vision
//               </th>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                   border-bottom: 0.5px solid #000;
//                 "
//               ></td>
//             </tr>
//             <tr>
//               <th
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//                 scope="row"
//               >
//                 Colour Vision
//               </th>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></td>
//               <td
//                 style="
//                   font-size: 12px;
//                   font-weight: 300;
//                   padding: 5px;
//                   border-right: 0.5px solid #000;
//                 "
//               ></td>
//             </tr>
//           </tbody>
//         </table>
//         <div
//           style="
//             width: 48%;
//             border: 0.5px solid #000;
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//             padding: 5px;
//           "
//         >
//           <Text style="font-size: 12px; font-weight: 400">
//             K/C/O:
//             <span> NO / DM / HT / IHD / Br. Asthma / Epilepsy / TB / ...</span>
//           </Text>
//           <Text style="font-size: 12px; font-weight: 400">
//             Occupational Disease if any <u>.................</u>
//           </Text>
//           <Text style="font-size: 12px; font-weight: 400">Present Complaint:</Text>
//           <Text style="font-size: 12px; font-weight: 400">Past History:</Text>
//           <Text style="font-size: 12px; font-weight: 400">Occupational History:</Text>
//         </div>
//       </div>
//       <div style="padding: 5px">
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">
//           Family History: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Father:
//           NAD / HT / DM / IHD / Br.Asthama / Any Disease / Death due to
//         </Text>
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">
//           <span
//             >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
//           >

//           Mother: NAD / HT / DM / IHD / Br.Asthama / Any Disease / Death due to
//         </Text>
//         <Text
//           style="
//             display: flex;
//             justify-content: space-between;
//             font-size: 12px;
//             font-weight: 400;
//             padding: 5px;
//           "
//         >
//           Local Exam: Skin / Teeth / Eye / Nose

//           <span>Hernia: Present/ Absent</span>
//         </Text>
//         <Text
//           style="
//             display: flex;
//             justify-content: space-between;
//             font-size: 12px;
//             font-weight: 400;
//             padding: 5px;
//           "
//         >
//           Systematic Examination:

//           <span>Hydrocele: Present/ Absent</span>
//         </Text>
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">
//           (RS / CVS/ CNS/ PA / GUS)
//         </Text>
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">
//           Further Investigation required:
//         </Text>
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">Advice</Text>
//         <Text style="font-size: 12px; font-weight: 400; padding: 5px">
//           Remarks: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
//           CLINICALLY FIT / UNFIT
//         </Text>
//         <Text style="display: flex; justify-content: right">
//           <span style="font-size: 14px; font-weight: bold"
//             >Signature Of FMO</span
//           >
//         </Text>
//       </div>
//       <table
//         style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
//         width="100%"
//         cellspacing="0"
//       >
//         <thead>
//           <tr>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               colspan="2"
//               scope="row"
//             >
//               Blood Test
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               colspan="2"
//               scope="row"
//             >
//               X-Ray Chest
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               colspan="2"
//               scope="row"
//             >
//               ECG (For > 40 yrs old)
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//                 border-bottom: 0.5px solid #000;
//               "
//               colspan="2"
//               scope="row"
//             >
//               PFT
//             </th>
//             <th
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-bottom: 0.5px solid #000;
//               "
//               colspan="2"
//               scope="row"
//             >
//               Audiometry
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr style="height: 40px">
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td
//               style="
//                 font-size: 12px;
//                 font-weight: 300;
//                 padding: 5px;
//                 border-right: 0.5px solid #000;
//               "
//             ></td>
//             <td style="font-size: 12px; font-weight: 300; padding: 5px"></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </body>
// </html>

//   `;
//   return <div></div>;
// };

// export default form21;

import React, { Fragment, useRef, useState } from "react";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import { Button } from "@mui/material";
import html2pdf from "html2pdf.js";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const data = [
  {
    empId: "KC0124383",
    name: "Raju Mandloi",
    gender: "MALE",
    age: "24",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0125605",
    name: "Mohan Jarman",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0125735",
    name: "Sanjaysen Sen",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mines operation",
  },
  {
    empId: "KC0124365",
    name: "Pushpendra Jarman",
    gender: "MALE",
    age: "20",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0124363",
    name: "Rahul Rathod",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0122113",
    name: "Mukesh Muvel",
    gender: "MALE",
    age: "31",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- Environment",
  },
  {
    empId: "KC0124369",
    name: "Chandan Bhawel",
    gender: "MALE",
    age: "20",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0124552",
    name: "Sohan Jarman",
    gender: "MALE",
    age: "26",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Utility",
  },
  {
    empId: "KC0124521",
    name: "Sunil Chouhan",
    gender: "MALE",
    age: "22",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0124558",
    name: "Rajesh Dodwe",
    gender: "MALE",
    age: "22",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0125444",
    name: "Santosh s/o som Singh ",
    gender: "MALE",
    age: "22",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: null,
  },
  {
    empId: "276090",
    name: "Radhe Garg",
    gender: "MALE",
    age: "42",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "E & I",
  },
  {
    empId: "KC0121884",
    name: "Jitendra Dodwe",
    gender: "MALE",
    age: "35",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Admin/Estate",
  },
  {
    empId: "KC0123840",
    name: "Badal Panwar",
    gender: "MALE",
    age: "20",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- LAB",
  },
  {
    empId: "KC0120205",
    name: "Chen Singh Kalme",
    gender: "MALE",
    age: "31",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0122474",
    name: "Sanjay Muwel",
    gender: "MALE",
    age: "26",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "431136",
    name: "M Babu",
    gender: "MALE",
    age: "31",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "E & I",
  },
  {
    empId: "KC0124391",
    name: "Shivram Mourya",
    gender: "MALE",
    age: "24",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Cement Mill",
  },
  {
    empId: "KC0125638",
    name: "Sankar Kalme",
    gender: "MALE",
    age: "35",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0124571",
    name: "Kallu Muwel",
    gender: "MALE",
    age: "39",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0124327",
    name: "Mohan Gwale",
    gender: "MALE",
    age: "27",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0125165",
    name: "Jain Singh Muwel",
    gender: "MALE",
    age: "32",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0125021",
    name: "Lakhan Rathore",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Coal Mill",
  },
  {
    empId: "KC0124266",
    name: "Kamal Rathod",
    gender: "MALE",
    age: "21",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0125141",
    name: "Sohan Bhawar",
    gender: "MALE",
    age: "26",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- LAB",
  },
  {
    empId: "KC0124978",
    name: "Laxman Bhawel",
    gender: "MALE",
    age: "20",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0125288",
    name: "Nikhil s/o Jagnnath",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- WHRS",
  },
  {
    empId: "KC0124283",
    name: "Sunil Kanel",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- LS Crusher",
  },
  {
    empId: "KC0122759",
    name: "Galsingh Bhawel",
    gender: "MALE",
    age: "36",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- AFR",
  },
  {
    empId: "KC0125125",
    name: "Gopal Dharve",
    gender: "MALE",
    age: "35",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0125930",
    name: "Arjun Chouhan",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0124519",
    name: "Bharat Kanel",
    gender: "MALE",
    age: "38",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0120184",
    name: "Kansingh Madiya",
    gender: "MALE",
    age: "49",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0125603",
    name: "Motesingh Dodwe",
    gender: "MALE",
    age: "40",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124605",
    name: "Vikramsingh Rawat",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124060",
    name: "Raghuvir Malwiy",
    gender: "MALE",
    age: "21",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Coal Mill",
  },
  {
    empId: "411776",
    name: "Arif Ali",
    gender: "MALE",
    age: "37",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mechanical I",
  },
  {
    empId: "KC0122961",
    name: "Dharmendra",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0123830",
    name: "Shah Alam",
    gender: "MALE",
    age: "28",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "8900159",
    name: "Manohar",
    gender: "MALE",
    age: "37",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "BPD",
  },
  {
    empId: "KC0124609",
    name: "Ankit Kumar",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0124600",
    name: "Priyanshu Barman",
    gender: "MALE",
    age: "23",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Utility",
  },
  {
    empId: "KC0124604",
    name: "Rahul Sharma",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-22",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "KC0124569",
    name: "Yersingh Solanki",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-22",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0124579",
    name: "Mukesh Dodve",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124568",
    name: "Jitendra Jarman",
    gender: "MALE",
    age: "24",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0124572",
    name: "Aankesh Muwel",
    gender: "MALE",
    age: "26",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0120421",
    name: "Kamal  Muwel",
    gender: "MALE",
    age: "33",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "1300018",
    name: "Govind Sisodiya",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Canteen",
  },
  {
    empId: "KC0124658",
    name: "Nitesh Nigwal",
    gender: "MALE",
    age: "28",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-22",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Utility",
  },
  {
    empId: "KC0124654",
    name: "Dharmendra Eske",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Packing Plant",
  },
  {
    empId: "KC0124665",
    name: "Avdhesh Singh",
    gender: "MALE",
    age: "43",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0124620",
    name: "Sameer Khan",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124651",
    name: "Deepak Mandloi",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "KC0124630",
    name: "Suresh Bhanwar",
    gender: "MALE",
    age: "31",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0124672",
    name: "Sawan Kanel",
    gender: "MALE",
    age: "28",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- LS Crusher",
  },
  {
    empId: "KC0125626",
    name: "Sunil Bhawel",
    gender: "MALE",
    age: "18",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0124680",
    name: "Onkar Waskel",
    gender: "MALE",
    age: "26",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Admin/Estate",
  },
  {
    empId: "KC0124713",
    name: "Ranchhod Muwel",
    gender: "MALE",
    age: "37",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Kiln",
  },
  {
    empId: "KC0124717",
    name: "Rahul Muwel",
    gender: "MALE",
    age: "21",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0125908",
    name: "Manoj Bhanwar",
    gender: "MALE",
    age: "19",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- L/S Stacker & reclaimer",
  },
  {
    empId: "KC0124747",
    name: "Anand Ram Banjare",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124737",
    name: "Kalusingh Chouhan",
    gender: "MALE",
    age: "32",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0124743",
    name: "Ravi Chouhan",
    gender: "MALE",
    age: "21",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "KC0124756",
    name: "Santosh Lal",
    gender: "MALE",
    age: "34",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124774",
    name: "Sitaram",
    gender: "MALE",
    age: "19",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0121607",
    name: "Mohabbat Solanki",
    gender: "MALE",
    age: "35",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Ele- Cement Mill",
  },
  {
    empId: "KC0124776",
    name: "Mustak s/o Mubarik",
    gender: "MALE",
    age: "46",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Ele- Cement Mill",
  },
  {
    empId: "KC0124796",
    name: "Kalu Shivlal Garg",
    gender: "MALE",
    age: "39",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-15",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124802",
    name: "Arpit Singh Gaherwar",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-15",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- WHRS",
  },
  {
    empId: "KC0124804",
    name: "Nanuram Waskel",
    gender: "MALE",
    age: "33",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-22",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- Environment",
  },
  {
    empId: "KC0125947",
    name: "Kamal Achale",
    gender: "MALE",
    age: "30",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Instrumentation",
  },
  {
    empId: "KC0124826",
    name: "Radheshyam Chouhan",
    gender: "MALE",
    age: "38",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Cement Mill",
  },
  {
    empId: "KC0125889",
    name: "Arjun Anjnave",
    gender: "MALE",
    age: "18",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124860",
    name: "Babban Yadav",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "KC0124864",
    name: "Suraj Kumar",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0124872",
    name: "Jitendra Mandloi",
    gender: "MALE",
    age: "32",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- RMH",
  },
  {
    empId: "KC0124856",
    name: "Nilesh s/o Pappu singh",
    gender: "MALE",
    age: "23",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- AFR",
  },
  {
    empId: "KC0124851",
    name: "Ganesh Prajapati",
    gender: "MALE",
    age: "33",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124903",
    name: "Pintu Alawa",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- AFR",
  },
  {
    empId: "KC0124882",
    name: "Tersingh s/o Phatlya",
    gender: "MALE",
    age: "51",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Raw Mill",
  },
  {
    empId: "KC0124914",
    name: "Dinesh Waskel",
    gender: "MALE",
    age: "34",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Coal Mill",
  },
  {
    empId: "KC0124915",
    name: "Mahesh Muwel",
    gender: "MALE",
    age: "23",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Coal Mill",
  },
  {
    empId: "KC0124907",
    name: "Rajkumar Rakshak",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- WHRS",
  },
  {
    empId: "KC0124942",
    name: "Jitendra Solanki",
    gender: "MALE",
    age: "22",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-17",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "QC- LAB",
  },
  {
    empId: "KC0124939",
    name: "Mahesh Bhawel",
    gender: "MALE",
    age: "22",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0123240",
    name: "Kailash Muwel",
    gender: "MALE",
    age: "46",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124988",
    name: "Vijay Singh Raghuvanshi",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124983",
    name: "Umesh Singh",
    gender: "MALE",
    age: null,
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: null,
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0124991",
    name: "Jeevan Solanki",
    gender: "MALE",
    age: "38",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Cement Mill",
  },
  {
    empId: "KC0124995",
    name: "Sanjay Bhawel",
    gender: "MALE",
    age: "33",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Ele- Cement Mill",
  },
  {
    empId: "KC0124987",
    name: "Raja Dodwe",
    gender: "MALE",
    age: "23",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-20",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0125026",
    name: "Prabhu Muwel",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0120591",
    name: "Suresh Mourya",
    gender: "MALE",
    age: "25",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-21",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0125017",
    name: "Dinesh Morya",
    gender: "MALE",
    age: "39",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-23",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Process- Kiln",
  },
  {
    empId: "KC0125014",
    name: "Umrav Mandloi",
    gender: "MALE",
    age: "32",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Admin/Estate",
  },
  {
    empId: "KC0125018",
    name: "Sukhendra Kumar Kori",
    gender: "MALE",
    age: "29",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-18",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Inst- Utility",
  },
  {
    empId: "KC0125808",
    name: "Gangaram s/o Muliya",
    gender: "MALE",
    age: "40",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Utility",
  },
  {
    empId: "KC0125052",
    name: "Gopal Brajwasi",
    gender: "MALE",
    age: "33",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-22",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- Packing Plant",
  },
  {
    empId: "KC0125084",
    name: "Ankit Hammad",
    gender: "MALE",
    age: "23",
    dateOfJoining: null,
    dateOfLeavingOrTransfer: null,
    reasonsForLeavingOrTransfer: null,
    section: null,
    medicalDate: "2024-05-24",
    fitness: "FIT",
    doctorSignature: null,
    certifyingSurgeonSignature: null,
    occupation: "Mech- WHRS",
  },
];
// const Form21 = () => {
//   const employees = data.map((item, index) => ({ ...item, sno: index + 1 }));
//   const MAX_ROWS_FIRST_PAGE = 66; // First page will have 66 rows
//   const MAX_ROWS_OTHER_PAGES = 66; // Subsequent pages will have 71 rows

//   const paginateEmployees = (data) => {
//     const pages = [];
//     let remainingRows = data.length;

//     // First page with 66 rows
//     pages.push(data.slice(0, MAX_ROWS_FIRST_PAGE));
//     remainingRows -= MAX_ROWS_FIRST_PAGE;

//     // Subsequent pages with 71 rows
//     while (remainingRows > 0) {
//       const nextPageRows = Math.min(remainingRows, MAX_ROWS_OTHER_PAGES);
//       pages.push(
//         data.slice(
//           data.length - remainingRows,
//           data.length - remainingRows + nextPageRows
//         )
//       );
//       remainingRows -= nextPageRows;
//     }

//     return pages;
//   };
//   const paginatedEmployees = paginateEmployees(employees);
//   console.log({ paginatedEmployees });
//   const printRef = useRef();

//   const generatePDF = async () => {
//     const element = printRef.current;
//     const options = {
//       margin: 3,
//       filename: "form21.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };
//     // html2pdf().from(element).set(options).save();

//     const pdfBlob = await html2pdf().from(element).set(options).output("blob");

//     // Create a URL for the Blob and open it in a new tab
//     const pdfUrl = URL.createObjectURL(pdfBlob);
//     window.open(pdfUrl, "_blank");
//   };

//   return (
//     <div>
//       <div
//         ref={printRef}
//         style={{
//           position: "relative",
//           fontStyle: "Arial",
//           fontSize: "10px",
//         }}
//       >
//         {paginatedEmployees.map((page, pageIndex) => (
//           <div
//             key={pageIndex}
//             style={{
// position: "relative",
// pageBreakAfter:
//   pageIndex < paginatedEmployees.length - 1 ? "always" : "auto",
//             }}
//           >
//             <Fragment>
//               {/* Header Section */}

//               <>
//                 <Text
//                   style={{
//                     textAlign: "center",
//                     margin: "0 0 10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Form Number 21
//                 </Text>
//                 <Text
//                   style={{
//                     textAlign: "center",
//                     margin: "0 0 20px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Prescribed under Rule (19) Health Register
//                 </Text>
//                 <Text
//                   style={{
//                     textAlign: "center",
//                     margin: "0 0 20px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   In respect of person employed in occupation declared to be
//                   dangerous operations under section 87
//                 </Text>
//                 <Text
//                   style={{
//                     textAlign: "center",
//                     marginBottom: "20px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Name of certifying surgeon: Dr Kunal Sharma
//                 </Text>
//               </>

//               {/* Table Section */}
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: "10px",
//                   textAlign: "center",
//                 }}
//               >
//                 <thead>
//                   <tr style={{ backgroundColor: "#f2f2f2" }}>
//                     <th style={{ ...headerStyle, width: "5%" }}>Sr.No.</th>
//                     <th style={{ ...headerStyle, width: "5%" }}>Emp ID</th>
//                     <th
//                       style={{
//                         ...headerStyle,
//                         textAlign: "center",
//                         width: "20%",
//                       }}
//                     >
//                       Name
//                     </th>
//                     <th style={{ ...headerStyle, width: "5%" }}>Gender</th>
//                     <th style={{ ...headerStyle, width: "3%" }}>Age</th>
//                     <th
//                       style={{
//                         ...headerStyle,
//                         textAlign: "center",
//                         width: "15%",
//                       }}
//                     >
//                       Occupation
//                     </th>
//                     <th
//                       style={{
//                         ...headerStyle,
//                         textAlign: "center",
//                         width: "8%",
//                       }}
//                     >
//                       Date of joining
//                     </th>
//                     <th style={{ ...headerStyle, width: "5%" }}>
//                       Date of leaving or transfer
//                     </th>
//                     <th style={{ ...headerStyle, width: "5%" }}>
//                       Reason for leaving or transfer
//                     </th>
//                     <th style={{ ...headerStyle, width: "3%" }}>Section</th>
//                     <th style={{ ...headerStyle, width: "8%" }}>
//                       Medical Date
//                     </th>
//                     <th
//                       style={{ ...headerStyle, textAlign: "left", width: "8%" }}
//                     >
//                       Fitness
//                     </th>
//                     <th style={{ ...headerStyle, width: "5%" }}>
//                       Doctor Signature
//                     </th>
//                     <th style={{ ...headerStyle, width: "6%" }}>
//                       Certifying Surgeon Signature
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {page.map((emp, index) => (
//                     <tr key={index}>
//                       <td style={cellStyle}>{emp.sno}</td>
//                       <td style={cellStyle}>{emp.empId}</td>
//                       <td
//                         style={{
//                           textAlign: "left",
//                           ...cellStyle,
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         {emp?.name?.toLowerCase()}
//                       </td>
//                       <td style={{ textTransform: "capitalize", ...cellStyle }}>
//                         {emp?.gender?.toLowerCase()}
//                       </td>
//                       <td style={cellStyle}>{emp.age}</td>
//                       <td style={{ textTransform: "capitalize", ...cellStyle }}>
//                         {emp?.occupation?.toLowerCase()}
//                       </td>
//                       <td style={cellStyle}>{emp.dateOfJoining}</td>
//                       <td style={cellStyle}>{emp.dateOfLeavingOrTransfer}</td>
//                       <td style={cellStyle}>
//                         {emp.reasonsForLeavingOrTransfer}
//                       </td>
//                       <td style={cellStyle}>{emp.section}</td>
//                       <td style={cellStyle}>{emp.medicalDate}</td>
//                       <td style={{ textAlign: "center", ...cellStyle }}>
//                         {emp.fitness}
//                       </td>
//                       <td style={cellStyle}></td>
//                       <td style={cellStyle}></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {page.map((emp, rowIndex) => {
//                 const noOfRowsPerPage = page.length;

//                 // Calculate the number of signatures to render based on the rows per page (rounded down)
//                 const noOfSignature = Math.floor(noOfRowsPerPage / 8);

//                 console.log({ noOfSignature, noOfRowsPerPage });

//                 // Loop to render the signature 'noOfSignature' times
//                 for (let i = 0; i < noOfSignature; i++) {
//                   // Calculate the vertical position for each signature, spaced 120px apart
//                   const signatureTopOffset = 180 + i * 120;

//                   // Only render the signature for every 8th row (rowIndex % 8 === 0)
//                   if (rowIndex === i * 8) {
//                     return (
//                       <img
//                         key={`stamp-${i}-${rowIndex}`}
//                         src={dr_kunal_stamp_sign}
//                         alt="Certifying Surgeon Seal"
//                         style={{
//                           position: "absolute",
//                           top: signatureTopOffset + "px", // Dynamic offset based on 'i'
//                           left: "88%",
//                           height: "90px",
//                           objectFit: "contain",
//                           opacity: 0.8,
//                         }}
//                       />
//                     );
//                   }
//                 }

//                 // Render other content for non-signature rows
//                 return <div key={rowIndex}>{/* Row content goes here */}</div>;
//               })}
//             </Fragment>
//           </div>
//         ))}
//       </div>

//       <Button variant="contained" onClick={generatePDF}>
//         Generate PDF
//       </Button>
//     </div>
//   );
// };

// export default Form21;

// const headerStyle = {
//   border: "0.2px solid black",
//   fontStyle: "Arial",
//   fontWeight: "bold",
//   textAlign: "center",
//   backgroundColor: "#ddd",
// };

// const cellStyle = {
//   fontStyle: "Arial",
//   border: "0.2px solid black",
//   fontWeight: "500",
// };

const Form21 = () => {
  const employees = data.map((item, index) => ({ ...item, sno: index + 1 }));
  const MAX_ROWS_FIRST_PAGE = 40; // First page will have 66 rows
  const MAX_ROWS_OTHER_PAGES = 40; // Subsequent pages will have 71 rows

  const paginateEmployees = (data) => {
    const pages = [];
    let remainingRows = data.length;

    // First page with 66 rows
    pages.push(data.slice(0, MAX_ROWS_FIRST_PAGE));
    remainingRows -= MAX_ROWS_FIRST_PAGE;

    // Subsequent pages with 71 rows
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
  const paginatedEmployees = paginateEmployees(employees);
  console.log({ paginatedEmployees });
  const printRef = useRef();

  const generatePDF = async () => {
    const element = printRef.current;
    const options = {
      margin: 3,
      filename: "form21.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    // html2pdf().from(element).set(options).save();

    const pdfBlob = await html2pdf().from(element).set(options).output("blob");

    // Create a URL for the Blob and open it in a new tab
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  // const styles = StyleSheet.create({
  //   page: {
  //     display: "flex",
  //     flexDirection: "column",
  //     backgroundColor: "#E4E4E4",
  //   },
  //   section: {
  //     display: "flex",
  //     flexDirection: "column",
  //   },
  // });

  const styles = StyleSheet.create({
    page: {
      display: "flex",
      flexDirection: "column",
    },
    outerContent: {
      position: "relative",
      fontStyle: "Arial",
      fontSize: 13,
    },
    mainContent: {
      position: "relative",
    },
    section: {
      marginBottom: 10,
    },
    header: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 13,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",
      fontSize: 13,
    },
    tableRow: {
      display: "flex",
      flexDirection: "row",
    },
    tableHeader: {
      border: "0.2px solid black",
      fontStyle: "Arial",
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#ddd",
    },
    tableCell: {
      fontStyle: "Arial",
      border: "0.2px solid black",
      fontWeight: "500",
    },
    signature: {
      position: "absolute",
      left: "85%",
      height: 60,
      objectFit: "contain",
      opacity: 0.8,
    },
  });

  return (
    // <div>
    //   <div
    //     ref={printRef}
    //     style={{
    //       position: "relative",
    //       fontStyle: "Arial",
    //       fontSize: "10px",
    //     }}
    //   >
    //     {paginatedEmployees.map((page, pageIndex) => (
    //       <div
    //         key={pageIndex}
    //         style={{
    //           position: "relative",
    //           pageBreakAfter:
    //             pageIndex < paginatedEmployees.length - 1 ? "always" : "auto",
    //         }}
    //       >
    //         <Fragment>
    //           {/* Header Section */}

    //           <>
    //             <Text
    //               style={{
    //                 textAlign: "center",
    //                 margin: "0 0 10px",
    //                 fontWeight: "bold",
    //               }}
    //             >
    //               Form Number 21
    //             </Text>
    //             <Text
    //               style={{
    //                 textAlign: "center",
    //                 margin: "0 0 20px",
    //                 fontWeight: "bold",
    //               }}
    //             >
    //               Prescribed under Rule (19) Health Register
    //             </Text>
    //             <Text
    //               style={{
    //                 textAlign: "center",
    //                 margin: "0 0 20px",
    //                 fontWeight: "bold",
    //               }}
    //             >
    //               In respect of person employed in occupation declared to be
    //               dangerous operations under section 87
    //             </Text>
    //             <Text
    //               style={{
    //                 textAlign: "center",
    //                 marginBottom: "20px",
    //                 fontWeight: "bold",
    //               }}
    //             >
    //               Name of certifying surgeon: Dr Kunal Sharma
    //             </Text>
    //           </>

    //           {/* Table Section */}
    //           <table
    //             style={{
    //               width: "100%",
    //               borderCollapse: "collapse",
    //               fontSize: "10px",
    //               textAlign: "center",
    //             }}
    //           >
    //             <thead>
    //               <tr style={{ backgroundColor: "#f2f2f2" }}>
    //                 <th style={{ ...headerStyle, width: "5%" }}>Sr.No.</th>
    //                 <th style={{ ...headerStyle, width: "5%" }}>Emp ID</th>
    //                 <th
    //                   style={{
    //                     ...headerStyle,
    //                     textAlign: "center",
    //                     width: "20%",
    //                   }}
    //                 >
    //                   Name
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "5%" }}>Gender</th>
    //                 <th style={{ ...headerStyle, width: "3%" }}>Age</th>
    //                 <th
    //                   style={{
    //                     ...headerStyle,
    //                     textAlign: "center",
    //                     width: "15%",
    //                   }}
    //                 >
    //                   Occupation
    //                 </th>
    //                 <th
    //                   style={{
    //                     ...headerStyle,
    //                     textAlign: "center",
    //                     width: "8%",
    //                   }}
    //                 >
    //                   Date of joining
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "5%" }}>
    //                   Date of leaving or transfer
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "5%" }}>
    //                   Reason for leaving or transfer
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "3%" }}>Section</th>
    //                 <th style={{ ...headerStyle, width: "8%" }}>
    //                   Medical Date
    //                 </th>
    //                 <th
    //                   style={{ ...headerStyle, textAlign: "left", width: "8%" }}
    //                 >
    //                   Fitness
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "5%" }}>
    //                   Doctor Signature
    //                 </th>
    //                 <th style={{ ...headerStyle, width: "6%" }}>
    //                   Certifying Surgeon Signature
    //                 </th>
    //               </tr>
    //             </thead>

    //             <tbody>
    //               {page.map((emp, index) => (
    //                 <tr key={index}>
    //                   <td style={cellStyle}>{emp.sno}</td>
    //                   <td style={cellStyle}>{emp.empId}</td>
    //                   <td
    //                     style={{
    //                       textAlign: "left",
    //                       ...cellStyle,
    //                       textTransform: "capitalize",
    //                     }}
    //                   >
    //                     {emp?.name?.toLowerCase()}
    //                   </td>
    //                   <td style={{ textTransform: "capitalize", ...cellStyle }}>
    //                     {emp?.gender?.toLowerCase()}
    //                   </td>
    //                   <td style={cellStyle}>{emp.age}</td>
    //                   <td style={{ textTransform: "capitalize", ...cellStyle }}>
    //                     {emp?.occupation?.toLowerCase()}
    //                   </td>
    //                   <td style={cellStyle}>{emp.dateOfJoining}</td>
    //                   <td style={cellStyle}>{emp.dateOfLeavingOrTransfer}</td>
    //                   <td style={cellStyle}>
    //                     {emp.reasonsForLeavingOrTransfer}
    //                   </td>
    //                   <td style={cellStyle}>{emp.section}</td>
    //                   <td style={cellStyle}>{emp.medicalDate}</td>
    //                   <td style={{ textAlign: "center", ...cellStyle }}>
    //                     {emp.fitness}
    //                   </td>
    //                   <td style={cellStyle}></td>
    //                   <td style={cellStyle}></td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>

    //           {page.map((emp, rowIndex) => {
    //             const noOfRowsPerPage = page.length;

    //             // Calculate the number of signatures to render based on the rows per page (rounded down)
    //             const noOfSignature = Math.floor(noOfRowsPerPage / 8);

    //             console.log({ noOfSignature, noOfRowsPerPage });

    //             // Loop to render the signature 'noOfSignature' times
    //             for (let i = 0; i < noOfSignature; i++) {
    //               // Calculate the vertical position for each signature, spaced 120px apart
    //               const signatureTopOffset = 180 + i * 120;

    //               // Only render the signature for every 8th row (rowIndex % 8 === 0)
    //               if (rowIndex === i * 8) {
    //                 return (
    //                   <img
    //                     key={`stamp-${i}-${rowIndex}`}
    //                     src={dr_kunal_stamp_sign}
    //                     alt="Certifying Surgeon Seal"
    //                     style={{
    //                       position: "absolute",
    //                       top: signatureTopOffset + "px", // Dynamic offset based on 'i'
    //                       left: "88%",
    //                       height: "90px",
    //                       objectFit: "contain",
    //                       opacity: 0.8,
    //                     }}
    //                   />
    //                 );
    //               }
    //             }

    //             // Render other content for non-signature rows
    //             return <div key={rowIndex}>{/* Row content goes here */}</div>;
    //           })}
    //         </Fragment>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    // <Document>
    //   <Page size={"A4"}>
    //     <View style={styles.section}>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           marginTop: 20,
    //           fontWeight: "bold",
    //         }}
    //       >
    //         Form Number 21
    //       </Text>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           marginTop: 20,
    //           fontWeight: "bold",
    //         }}
    //       >
    //         Prescribed under Rule (19) Health Register
    //       </Text>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           marginTop: 20,
    //           fontWeight: "bold",
    //         }}
    //       >
    //         In respect of person employed in occupation declared to be dangerous
    //         operations under section 87
    //       </Text>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           marginTop: 20,
    //           fontWeight: "bold",
    //         }}
    //       >
    //         Name of certifying surgeon: Dr Kunal Sharma
    //       </Text>
    //     </View>
    //   </Page>
    // </Document>

    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerContent}>
          {paginatedEmployees.map((page, pageIndex) => (
            <View
              key={pageIndex}
              style={{
                ...styles.mainContent,
              }}
            >
              <View
                style={{ flexDirection: "column", display: "flex" }}
                break={pageIndex < paginatedEmployees.length - 1 ? true : false}
              >
                <Text style={styles.header}>Form Number 21</Text>
                <Text style={styles.header}>
                  Prescribed under Rule (19) Health Register
                </Text>
                <Text style={styles.header}>
                  In respect of persons employed in occupations declared to be
                  dangerous operations under section 87
                </Text>
                <Text style={styles.header}>
                  Name of certifying surgeon: Dr Kunal Sharma
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Sr.No.
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Emp ID
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "18%" }}>
                    Name
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Gender
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "3%" }}>
                    Age
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "15%" }}>
                    Occupation
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "8%" }}>
                    Date of Joining
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Date of Leaving or Transfer
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Reason for Leaving or Transfer
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "3%" }}>
                    Section
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "10%" }}>
                    Medical Date
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "8%" }}>
                    Fitness
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Doctor Signature
                  </Text>
                  <Text style={{ ...styles.tableHeader, width: "5%" }}>
                    Certifying Surgeon Signature
                  </Text>
                </View>

                {page.map((emp, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={{ ...styles.tableCell, width: "5%" }}>
                      {emp.sno}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCell,
                        width: "5%",
                        flexWrap: "wrap",
                      }}
                    >
                      {emp.empId}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCell,
                        width: "18%",
                        textTransform: "capitalize",
                        flexWrap: "wrap",
                      }}
                    >
                      {emp.name?.toLowerCase()}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCell,
                        width: "5%",
                        textTransform: "capitalize",
                      }}
                    >
                      {emp.gender?.toLowerCase()}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "3%" }}>
                      {emp.age}
                    </Text>
                    <Text
                      style={{
                        ...styles.tableCell,
                        width: "15%",
                        textTransform: "capitalize",
                        flexWrap: "wrap",
                      }}
                    >
                      {emp.occupation?.toLowerCase()}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "8%" }}>
                      {emp.dateOfJoining}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "5%" }}>
                      {emp.dateOfLeavingOrTransfer}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "5%" }}>
                      {emp.reasonsForLeavingOrTransfer}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "3%" }}>
                      {emp.section}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "10%" }}>
                      {emp.medicalDate}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "8%" }}>
                      {emp.fitness}
                    </Text>
                    <Text style={{ ...styles.tableCell, width: "5%" }}></Text>
                    <Text style={{ ...styles.tableCell, width: "5%" }}></Text>
                  </View>
                ))}
              </View>

              {page.map((_, rowIndex) => {
                const noOfRowsPerPage = page.length;
                const noOfSignatures = Math.floor(noOfRowsPerPage / 6);

                if (rowIndex % 6 === 0 && rowIndex / 6 < noOfSignatures) {
                  return (
                    <Image
                      key={`stamp-${pageIndex}-${rowIndex}`}
                      src={dr_kunal_stamp_sign}
                      style={{
                        ...styles.signature,
                        top: 250 + rowIndex * 20, // Adjust spacing
                      }}
                    />
                  );
                }
                return null;
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default Form21;
