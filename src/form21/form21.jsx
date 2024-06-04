import React from "react";

const form21 = () => {
  const content = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet"
    />
    <title>Document</title>
    <style type="text/css">
      @page {
        size: auto; /* auto is the initial value */
        margin: 0;
      }

      html {
        background-color: #ffffff;
      }

      * {
        margin: 0;
        padding: 0;
        text-indent: 0;
      }
      body {
        font-family: "Roboto", sans-serif;
      }
    </style>
  </head>
  <body>
    <div
      style="
        margin: 20px;
        border: 1px solid #000;
        padding-block: 5px;
        height: 95vh;
      "
    >
      <div style="padding-inline: 10px; padding-bottom: 5px">
        <p style="display: flex; justify-content: space-between">
          <span style="width: 23%"></span>
          <span style="font-size: 17px; font-weight: bold">Form 21</span>
          <span style="font-size: 14px; text-align: right"
            >ULTRTECH CEMENT LIMITED</span
          >
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 23%"></span>
          <span style="font-size: 14px">[Prescribed under Rule (19)]</span>
          <span style="font-size: 14px; text-align: right"
            >(Unit: Dhar Cement Works)</span
          >
        </p>
        <p style="display: flex; justify-content: space-between">
          <span style="width: 32%"></span>
          <span style="font-size: 17px; font-weight: bold; text-align: center"
            >Health Register</span
          >
          <span style="font-size: 14px; text-align: right"
            >Vill-Tonki, Ta-Manawar, Dist - Dhar (MP)</span
          >
        </p>
        <p style="font-size: 14px">
          (In respect of persons employed in occupations declared to be
          dangerous under Section 87)
        </p>
      </div>

      <div>
        <table
          style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
          width="100%"
          cellspacing="0"
        >
          <thead>
            <tr>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Serial No.
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Employee ID
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Name of Employee
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Age
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Sex
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Date of Birth
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Date of Employment on present work
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Date of transfer to other work
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Date of leaving, or discharge
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Reasons for leaving or transfer
              </th>
              <th
                scope="col"
                style="font-size: 12px; font-weight: 300; padding: 5px"
              >
                Nature of Job or Occupation
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                1
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                2
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                3
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                4
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                5
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                6
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                7
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                8
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                9
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                10
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                "
              >
                11
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="height: 30px">
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="font-size: 12px; font-weight: 300; padding: 5px"
              ></th>
            </tr>
            <tr>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 2px;
                  border-top: 0.5px solid #000;
                "
              ></th>
            </tr>
          </tbody>
        </table>
        <table
          style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
          width="100%"
          cellspacing="0"
        >
          <thead>
            <tr>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Raw material or by-product handled
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Date of Medical Examination by certifying surgeon
              </th>
              <th
                scope="col"
                colspan="2"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                and Result of medical examination
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                If suspended from work, state period of suspension with detailed
                reasons (certifying surgeon)
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                Recertified fit to resume duty on (with signature of certifying
                surgeon)
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              >
                If certificate of unfitness or suspension issued to work
                (certifying surgeon)
              </th>
              <th
                scope="col"
                style="font-size: 12px; font-weight: 300; padding: 5px"
              >
                Signature with date of certifying surgeon
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                10
              </th>
              <th
                colspan="2"
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                11
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                12
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                13
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                  border-right: 0.5px solid #000;
                "
              >
                14
              </th>
              <th
                scope="col"
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-block: 0.5px solid #000;
                "
              >
                15
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="height: 30px">
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  width: 60px;
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  width: 140px;
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  text-align: left;
                "
              >
                <p style="height: 25px">G / E:</p>
                <p style="height: 25px">Blood:</p>
                <p style="height: 25px">CXR:</p>
                <p style="height: 25px">ECG:</p>
              </th>
              <th
                scope="col"
                style="
                  width: 60px;
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  text-align: center;
                "
              >
                <span>Fit</span>
              </th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="
                  font-size: 10px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></th>
              <th
                scope="col"
                style="font-size: 10px; font-weight: 300; padding: 5px"
              ></th>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="border-top: 1px solid #000; margin-top: 5px">
        <p
          style="
            font-size: 17px;
            font-weight: bold;
            text-align: center;
            padding: 5px;
          "
        >
          <u>MEDICAL CHECK UP REPORT</u>
        </p>
      </div>
      <div
        style="
          padding: 5px;
          border-top: 1px solid #000;
          display: flex;
          justify-content: space-between;
        "
      >
        <p style="width: 48%; font-weight: 400; display: flex">
          <span style="font-size: 13px; font-weight: 400"
            >Contractor's Name:</span
          >
          <span style="font-size: 13px; font-weight: 400"></span>
        </p>
        <p style="width: 26%; display: flex">
          <span style="font-size: 13px; font-weight: 400">Department:</span>
          <span style="font-size: 13px; font-weight: 400"></span>
        </p>
        <p style="width: 26%; display: flex">
          <span style="font-size: 13px; font-weight: 400">Designation:</span>
          <span style="font-size: 13px; font-weight: 400"></span>
        </p>
      </div>
      <div style="padding: 5px; display: flex; justify-content: space-between">
        <p style="width: 48%; font-weight: 400; display: flex">
          <span style="font-size: 13px; font-weight: 400">Mob No:</span>
          <span style="font-size: 13px; font-weight: 400"></span>
        </p>
        <p style="width: 52%; display: flex">
          <span style="font-size: 13px; font-weight: 400">H/o Habit:</span>
          <span style="font-size: 13px; font-weight: 400; margin-left: 10px"
            >No / Tobacco / Smoking / Gutka / Alcohol ...</span
          >
        </p>
      </div>
      <div
        style="
          padding: 5px;
          border-bottom: 1px solid #000;
          display: flex;
          justify-content: space-between;
        "
      >
        <p style="width: 48%; display: flex">
          <span style="font-size: 13px; font-weight: 400">Blood Group:</span>
          <span
            style="font-size: 13px; font-weight: 400; margin-left: 10px"
          ></span>
        </p>
        <p style="width: 52%; display: flex">
          <span style="font-size: 14px; font-weight: 400">ID Mark:</span>
          <span style="font-size: 14px; font-weight: 400; margin-left: 10px"
            >A Black Mole / Cust Marl / Scar / Tatoo Mark on ...</span
          >
        </p>
      </div>
      <div style="padding: 5px">
        <p style="font-size: 17px; font-weight: 400">General Check Up</p>
      </div>
      <table
        style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
        width="60%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              Weight (Kg)
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              Height (cm)
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              B.P. (mm of Hg)
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              Pulse/min
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              Resp. Rate/min
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              scope="col"
            >
              SpO2%
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="height: 50px">
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
          </tr>
        </tbody>
      </table>
      <div style="padding: 5px">
        <p style="font-size: 17px; font-weight: 400">Eye Examination :</p>
      </div>
      <div style="display: flex; justify-content: space-between">
        <table
          style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
          width="48%"
          cellspacing="0"
        >
          <thead>
            <tr>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Use of Spectacles
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                colspan="2"
                scope="col"
              >
                Right Eye
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                colspan="2"
                scope="col"
              >
                Left Eye
              </th>
            </tr>
            <tr>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Yes / No
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Right Eye
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Left Eye
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Right Eye
              </th>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="col"
              >
                Left Eye
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="row"
              >
                Distant Vision
              </th>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
            </tr>
            <tr>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
                scope="row"
              >
                Near Vision
              </th>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                  border-bottom: 0.5px solid #000;
                "
              ></td>
            </tr>
            <tr>
              <th
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
                scope="row"
              >
                Colour Vision
              </th>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></td>
              <td
                style="
                  font-size: 12px;
                  font-weight: 300;
                  padding: 5px;
                  border-right: 0.5px solid #000;
                "
              ></td>
            </tr>
          </tbody>
        </table>
        <div
          style="
            width: 48%;
            border: 0.5px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 5px;
          "
        >
          <p style="font-size: 12px; font-weight: 400">
            K/C/O:
            <span> NO / DM / HT / IHD / Br. Asthma / Epilepsy / TB / ...</span>
          </p>
          <p style="font-size: 12px; font-weight: 400">
            Occupational Disease if any <u>.................</u>
          </p>
          <p style="font-size: 12px; font-weight: 400">Present Complaint:</p>
          <p style="font-size: 12px; font-weight: 400">Past History:</p>
          <p style="font-size: 12px; font-weight: 400">Occupational History:</p>
        </div>
      </div>
      <div style="padding: 5px">
        <p style="font-size: 12px; font-weight: 400; padding: 5px">
          Family History: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Father:
          NAD / HT / DM / IHD / Br.Asthama / Any Disease / Death due to
        </p>
        <p style="font-size: 12px; font-weight: 400; padding: 5px">
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >

          Mother: NAD / HT / DM / IHD / Br.Asthama / Any Disease / Death due to
        </p>
        <p
          style="
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;
            padding: 5px;
          "
        >
          Local Exam: Skin / Teeth / Eye / Nose

          <span>Hernia: Present/ Absent</span>
        </p>
        <p
          style="
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;
            padding: 5px;
          "
        >
          Systematic Examination:

          <span>Hydrocele: Present/ Absent</span>
        </p>
        <p style="font-size: 12px; font-weight: 400; padding: 5px">
          (RS / CVS/ CNS/ PA / GUS)
        </p>
        <p style="font-size: 12px; font-weight: 400; padding: 5px">
          Further Investigation required:
        </p>
        <p style="font-size: 12px; font-weight: 400; padding: 5px">Advice</p>
        <p style="font-size: 12px; font-weight: 400; padding: 5px">
          Remarks: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          CLINICALLY FIT / UNFIT
        </p>
        <p style="display: flex; justify-content: right">
          <span style="font-size: 14px; font-weight: bold"
            >Signature Of FMO</span
          >
        </p>
      </div>
      <table
        style="border-top: 0.5px solid #000; border-bottom: 0.5px solid #000"
        width="100%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              colspan="2"
              scope="row"
            >
              Blood Test
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              colspan="2"
              scope="row"
            >
              X-Ray Chest
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              colspan="2"
              scope="row"
            >
              ECG (For > 40 yrs old)
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
                border-bottom: 0.5px solid #000;
              "
              colspan="2"
              scope="row"
            >
              PFT
            </th>
            <th
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-bottom: 0.5px solid #000;
              "
              colspan="2"
              scope="row"
            >
              Audiometry
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="height: 40px">
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td
              style="
                font-size: 12px;
                font-weight: 300;
                padding: 5px;
                border-right: 0.5px solid #000;
              "
            ></td>
            <td style="font-size: 12px; font-weight: 300; padding: 5px"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>

  `;
  return <div></div>;
};

export default form21;
