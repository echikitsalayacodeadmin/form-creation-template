import React, { Fragment, useRef, useState } from "react";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import { Button } from "@mui/material";
import html2pdf from "html2pdf.js";

const GenerateForm21PDF = ({
  data,
  setFile,
  corpData,
  generatedForms,
  generateForm21PDF,
  setGeneratedForms,
}) => {
  const employees = data?.map((item, index) => ({ ...item, sno: index + 1 }));
  const MAX_ROWS_FIRST_PAGE = 45;
  const MAX_ROWS_OTHER_PAGES = 45;
  const [isLoading, setIsLoading] = useState(false);
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

  const printRef = useRef();

  // const generatePDF = async () => {
  //   setFile(null);
  //   setIsLoading(true);
  //   const element = printRef.current;

  //   const options = {
  //     margin: 5, // Adjust margins to prevent content cutting
  //     filename: "form21.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,
  //       letterRendering: true, // Improves text rendering
  //     },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   // Force a short delay to allow rendering of all elements properly
  //   setTimeout(async () => {
  //     const pdfBlob = await html2pdf()
  //       .from(element)
  //       .set(options)
  //       .output("blob");
  //     const file = new File([pdfBlob], `Form21.pdf`, {
  //       type: "application/pdf",
  //       lastModified: new Date().getTime(),
  //     });

  //     setFile(file);
  //     const pdfUrl = URL.createObjectURL(pdfBlob);
  //     if (!generatedForms.includes(corpData.corpId)) {
  //       generateForm21PDF(corpData.corpId);
  //       setGeneratedForms((prev) => [...prev, corpData.corpId]);
  //     }
  //     setIsLoading(false);
  //     window.open(pdfUrl, "_blank");
  //   }, 100);
  // };

  const generatePDF = async () => {
    setFile(null);
    setIsLoading(true);
    const element = printRef.current;

    const options = {
      margin: 5,
      filename: "form21.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
      setGeneratedForms((prev) => [...prev, corpData.corpId]); // Update generated forms

      console.log("PDF Generated Successfully");
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [tableWidthColumn, setTableWidthColumn] = useState({
    colSrNo: "3%",
    colEmpId: "8%",
    colName: "18%",
    colGender: "5%",
    colAge: "3%",
    colOccupation: "18%",
    colDOJ: "4%",
    colDOL: "4%",
    colROL: "4%",
    colSection: "4%",
    colMedicalData: "8%",
    colFitness: "13%",
    colDoctorSign: "5.5%",
    colSergeonSign: "5.5%",
  });

  const [noOfRowsForSingleSign, setNoOfRowsForSingleSign] = useState(5);
  const [gapBetweenSign, setGapBetweenSign] = useState(90);
  const [topMarginFromFirstSign, setTopMarginFromFirstSign] = useState(230);

  return (
    <Fragment>
      <Button
        disabled={generatedForms.includes(corp.id)}
        onClick={() => handleGenerateForm21(corp.id)}
        variant="contained"
      >
        Generate Form 21 PDF
      </Button>
      <div style={{ display: "none" }}>
        <div
          ref={printRef}
          style={{
            position: "relative",
            fontStyle: "Arial",
            fontSize: "10px",
          }}
        >
          {paginatedEmployees.map((page, pageIndex) => (
            <div
              key={pageIndex}
              id={`page-${pageIndex}`}
              style={{
                paddingBlock: "40px",
                position: "relative",
                minHeight: "297mm",
                pageBreakAfter: "always",
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
                      width: `${100 / 0.8}%`,
                      borderCollapse: "collapse",
                      fontSize: "10px",
                      textAlign: "center",
                      transform: "scale(0.8)", // Reduce the scale to 80% (adjust the value as needed)
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
    </Fragment>
  );
};

export default GenerateForm21PDF;

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
