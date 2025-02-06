import React, { Fragment, useEffect, useRef, useState } from "react";
import { BASE_URL } from "../assets/constant";
import { getData } from "../assets/services/GetApiCall";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import html2pdf from "html2pdf.js";
import { Divider } from "@mui/material";
import { uploadFile } from "../assets/services/PostApiCall";

const Form21Automate = ({}) => {
  const listOfCorps = [
    {
      id: 1,
      corpId: "872cd841-923232f7a-432d-b8e9-422b780bca10",
      campCycleId: "1",
    },
    {
      id: 2,
      corpId: "872cd841-9f427a-432d-b8e9-422b780bca10",
      campCycleId: "2",
    },
    {
      id: 3,
      corpId: "872cd841-944f7a-432d-b8e9-422b780bca10",
      campCycleId: "3",
    },
  ];

  const [form21Data, setForm21Data] = useState([]);

  const handleGenerateForm21 = async () => {
    for (let i = 0; i < listOfCorps.length; i++) {
      await generateForm21PDF(list[i], i);
    }
  };

  const generateForm21PDF = async (corpData) => {
    const { corpId, campCycleId } = corpData;
    const url = `${BASE_URL}org/form21?corpId=${corpId}&campCycleId=${campCycleId}`;
    const response = await getData(url);
    if (response.error) {
      setForm21Data([]);
    } else {
      setForm21Data(response.data);
    }
  };

  const employees = form21Data?.map((item, index) => ({
    ...item,
    sno: index + 1,
  }));
  const MAX_ROWS_FIRST_PAGE = 45;
  const MAX_ROWS_OTHER_PAGES = 45;

  const paginateEmployees = (data) => {
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
  const paginatedEmployees = paginateEmployees(employees);

  const [noOfRowsForSingleSign, setNoOfRowsForSingleSign] = useState(6);
  const [gapBetweenSign, setGapBetweenSign] = useState(90);
  const [topMarginFromFirstSign, setTopMarginFromFirstSign] = useState(230);

  const [tableWidthColumn, setTableWidthColumn] = useState({
    colSrNo: "5%",
    colEmpId: "8%",
    colName: "13%",
    colGender: "5%",
    colAge: "3%",
    colOccupation: "12%",
    colDOJ: "5%",
    colDOL: "5%",
    colROL: "5%",
    colSection: "4%",
    colMedicalData: "8%",
    colFitness: "18%",
    colDoctorSign: "5.5%",
    colSergeonSign: "5.5%",
  });

  const printRef = useRef();

  const generatePDF = async () => {
    const element = printRef.current;
    const options = {
      margin: 3,
      filename: "form21.pdf",
      image: { type: "jpeg", quality: 2 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdfBlob = await html2pdf().from(element).set(options).output("blob");
    const file = new File([pdfBlob], `Form21.pdf`, {
      type: "application/pdf",
      lastModified: new Date().getTime(),
    });

    await uploadForm21Handler(file);
  };

  const uploadForm21Handler = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("file", file);
    const url =
      BASE_URL +
      `org/corpUpload?corpId=${corpId}&corpUploadType=FORM_21&formCreateDate=${date}`;

    const result = await uploadFile(url, formData);
    if (result.error) {
      console.log(result.error);
    } else {
      console.log("Successfully Uploaded ");
      setUploadedCorpCampCount((prev) => prev + 1);
    }
  };

  return (
    <Fragment>
      <button onClick={generatePDF}>Generate</button>
      <div
        ref={printRef}
        style={{
          position: "relative",
          fontStyle: "Arial",
          fontSize: "10px",
        }}
      >
        {paginatedEmployees.map((page, pageIndex) => (
          <div>
            <div
              id={`page-${pageIndex}`}
              key={pageIndex}
              style={{
                padding: "40px 0",
                position: "relative",

                pageBreakAfter: "always",

                pageBreakInside: "avoid",

                minHeight: "297mm",
                backgroundColor: "red",
              }}
            >
              <Fragment>
                <>
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
                </>

                <div>
                  <table
                    style={{
                      width: `${100 / 1}%`,
                      borderCollapse: "collapse",
                      fontSize: "10px",
                      textAlign: "center",
                      transform: "scale(1)", // Reduce the scale to 80% (adjust the value as needed)
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
                        <tr key={index}>
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
                          <td
                            style={{
                              textAlign: "center",
                              ...cellStyle,
                            }}
                          >
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
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Form21Automate;

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
