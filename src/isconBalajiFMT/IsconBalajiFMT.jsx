import React, { Fragment, useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  BlobProvider,
} from "@react-pdf/renderer";
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";
import { Button } from "@mui/material";
import IsconBalajiLogo from "./IsconBalajiLogo.png";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { pdf } from "@react-pdf/renderer";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";

const IsconBalajiFMT = ({
  corpId = "49208ee2-38cd-470b-93c1-b450e26ea7b4",
  campCycleId = "299923",
  fileType = "ANNEXURE",
  YEAR = "2025",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    try {
      console.log({ data });
      // Create a blob from the PDF
      const pdfBlob = await pdf(
        <MedicalCardPDF employeeData={data} YEAR={YEAR} />
      ).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FMT_REPORT.pdf`);

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

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
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
      enqueueSnackbar("Error generating/uploading PDF", {
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
          item.vitalsCreatedDate === "2025-05-28" ||
          item.vitalsCreatedDate === "2025-05-29"
      );

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
      <BlobProvider document={<MedicalCardPDF />}>
        {({ url }) => (
          <Button href={url || ""} download={"FMT"}>
            Download PDF
          </Button>
        )}
      </BlobProvider>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <MedicalCardPDF />
      </PDFViewer>
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
    </Fragment>
  );
};

export default IsconBalajiFMT;

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 20,
  },
  logo: {
    width: "33%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    width: "67%",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    width: 150,
    fontSize: 10,
  },
  line: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    marginLeft: 5,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderRightWidth: 1,
    borderColor: "#000000",
  },
  photoBox: {
    width: 100,
    height: 120,
    borderWidth: 1,
    borderColor: "#000000",
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  table2: {
    width: "100%",
    marginBottom: 20,
  },
  row2: {
    flexDirection: "row",
  },
  // Basic Info Section
  basicInfoRow2: {
    flexDirection: "row",
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: "#000000",
  },
  ageCell2: {
    width: "25%",
    borderRight: 1,
    borderColor: "#000000",
  },
  sexContainer2: {
    width: "25%",
    borderRight: 1,
    borderColor: "#000000",
  },
  sexHeader2: {
    borderBottom: 1,
    borderColor: "#000000",
  },
  sexOptionsRow2: {
    flexDirection: "row",
    height: 30,
  },
  sexOption2: {
    flex: 1,
    borderRight: 1,
    borderColor: "#000000",
    justifyContent: "center",
  },
  sexOptionLast2: {
    flex: 1,
    justifyContent: "center",
  },
  weightCell2: {
    width: "25%",
    borderRight: 1,
    borderColor: "#000000",
  },
  heightCell2: {
    width: "25%",
  },
  // Vitals Section
  vitalsRow2: {
    flexDirection: "row",
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderTop: 1,
    borderColor: "#000000",
  },
  vitalsCell2: {
    flex: 1,
    borderRight: 1,
    borderColor: "#000000",
    height: 60,
  },
  vitalsCellLast2: {
    flex: 1,
    height: 60,
  },
  // Physical Tests Section
  physicalTestRow2: {
    flexDirection: "row",
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderTop: 1,
    borderColor: "#000000",
  },
  testLabelCell2: {
    width: "30%",
    borderRight: 1,
    borderColor: "#000000",
    padding: 8,
  },
  resultCell2: {
    width: "15%",
    borderRight: 1,
    borderColor: "#000000",
    padding: 8,
    textAlign: "center",
  },
  urineCell2: {
    flex: 1,
    borderRight: 1,
    borderColor: "#000000",
    padding: 8,
  },
  urineCellLast2: {
    flex: 1,
    padding: 8,
  },
  headerText2: {
    fontSize: 11,
    fontWeight: "bold",
    padding: 8,
    textAlign: "center",
  },
  valueText2: {
    fontSize: 11,
    padding: 8,
    textAlign: "center",
  },
});

const MedicalCardPDF = ({ employeeData, YEAR }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ borderWidth: 1, borderColor: "black", padding: 5 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottom: 0 }]}>
          <View style={styles.logo}>
            <Image src={IsconBalajiLogo} style={{ height: 60 }} />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRow}>
              <Text
                style={{ flex: 1, fontSize: 10, fontWeight: "bold", margin: 4 }}
              >
                ISCON BALAJI FOODS PVT.LTD.
              </Text>
              <Text
                style={{
                  color: "#dc2626",
                  fontSize: 10,
                  fontWeight: "bold",
                  margin: 4,
                }}
              >
                CONTROL COPY
              </Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                DOCUMENT NAME
              </Text>
              <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                MEDICAL HEALTH CARD
              </Text>
            </View>
            <View style={styles.headerRow}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  DOCUMENT NO.
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  FMT/HR/10
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  PAGE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  1 OF 3
                </Text>
              </View>
            </View>
            <View style={[styles.headerRow, { borderBottom: 0 }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  ISSUE NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00-01.01.2024
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  REV. NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 40 }}>
          <Text style={styles.title}>Medical Health Card</Text>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Name of the Employee
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text style={[styles.label, { marginLeft: 5, marginTop: 5 }]}>
                    {employeeData?.name || ""}
                  </Text>
                </View>
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.label, { marginTop: 5 }]}>Department</Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text style={[styles.label, { marginLeft: 5, marginTop: 5 }]}>
                    {employeeData?.department || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Date of Birth
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text style={[styles.label, { marginLeft: 5, marginTop: 5 }]}>
                    {employeeData?.dateOfBirth || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Date OF Joining
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text
                    style={[styles.label, { marginLeft: 5, marginTop: 5 }]}
                  ></Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Marital Status
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text style={[styles.label, { marginLeft: 5, marginTop: 5 }]}>
                    {employeeData?.maritalStatus || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Date of Examination
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text style={[styles.label, { marginLeft: 5, marginTop: 5 }]}>
                    {employeeData?.vitalsCreatedDate || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { marginTop: 5 }]}>
                  Next Date of Examination
                </Text>
                <Text>:</Text>
                <View style={styles.line}>
                  <Text
                    style={[styles.label, { marginLeft: 5, marginTop: 5 }]}
                  ></Text>
                </View>
              </View>
            </View>
            <View style={styles.photoBox}>
              {/* <Image
                src={employeeData?.imageUrl}
                style={{ width: 100, height: 120 }}
              /> */}
            </View>
          </View>

          {/* Physical Measurements Table */}
          <View style={styles.table2}>
            <View style={styles.basicInfoRow2}>
              <View style={styles.sexContainer2}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Age</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2]}>
                    {employeeData?.age || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.sexContainer2}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Sex</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2]}>
                    {employeeData?.gender || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.sexContainer2}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Height</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2, { textAlign: "center" }]}>
                    {employeeData?.height || ""}
                  </Text>
                </View>
              </View>
              <View style={[styles.sexContainer2, { borderRight: 0 }]}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Weight</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2, { textAlign: "center" }]}>
                    {employeeData?.weight || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Vitals */}
          <View style={styles.table2}>
            <View style={styles.vitalsRow2}>
              <View style={[styles.sexContainer2]}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Blood Pressure</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2, { textAlign: "center" }]}>
                    {employeeData?.bp || ""}
                  </Text>
                </View>
              </View>
              <View style={[styles.sexContainer2]}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Pulse</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2, { textAlign: "center" }]}>
                    {employeeData?.pulseRate || ""}
                  </Text>
                </View>
              </View>
              <View style={[styles.sexContainer2]}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Blood Group</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text style={[styles.headerText2, { textAlign: "center" }]}>
                    {employeeData?.bloodGroup || ""}
                  </Text>
                </View>
              </View>
              <View style={[styles.sexContainer2, { borderRight: 0 }]}>
                <View style={styles.sexHeader2}>
                  <Text style={styles.headerText2}>Identification Mark</Text>
                </View>
                <View style={([styles.sexHeader2], { borderBottom: 0 })}>
                  <Text
                    style={[styles.headerText2, { textAlign: "center" }]}
                  ></Text>
                </View>
              </View>
            </View>
          </View>

          {/* Physical Tests */}
          <View style={styles.table2}>
            <View style={[styles.physicalTestRow2, { borderBottom: 0 }]}>
              <View style={styles.testLabelCell2}>
                <Text
                  style={
                    (styles.headerText2,
                    {
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: "bold",
                      padding: 8,
                    })
                  }
                >
                  Physical Test
                </Text>
              </View>
              <View style={styles.resultCell2}>
                <Text style={styles.headerText2}></Text>
              </View>
              <View style={styles.resultCell2}>
                <Text style={styles.headerText2}></Text>
              </View>
              <View style={styles.urineCell2}>
                <Text style={styles.headerText2}></Text>
              </View>
              <View style={styles.urineCellLast2}>
                <Text style={styles.headerText2}>NAD</Text>
              </View>
            </View>
            {[
              { label: "T.B.", key: "tb" },
              { label: "Jaundice examination:", key: "jaundice" },
              { label: "Typhoid examination:", key: "typhoid" },
            ].map((test, index) => (
              <View
                key={test.label}
                style={[
                  styles.physicalTestRow2,
                  { borderBottom: index === 2 ? 1 : 0 },
                ]}
              >
                <View style={styles.testLabelCell2}>
                  <Text style={[styles.valueText2, { textAlign: "left" }]}>
                    {test.label}
                  </Text>
                </View>
                <View style={[styles.sexContainer2, { width: "15%" }]}>
                  <View style={styles.sexHeader2}>
                    <Text style={styles.headerText2}>Positive</Text>
                  </View>
                  <View style={styles.sexOptionsRow2}>
                    <Text
                      style={[styles.headerText2, { textAlign: "center" }]}
                    ></Text>
                  </View>
                </View>
                <View style={[styles.sexContainer2, { width: "15%" }]}>
                  <View style={styles.sexHeader2}>
                    <Text style={styles.headerText2}>Negative</Text>
                  </View>
                  <View style={styles.sexOptionsRow2}>
                    <Text
                      style={[styles.headerText2, { textAlign: "center" }]}
                    ></Text>
                  </View>
                </View>
                {index === 0 ? (
                  <>
                    <View style={styles.urineCell2}>
                      <Text style={[styles.valueText2, { textAlign: "left" }]}>
                        URINE: NA
                      </Text>
                    </View>
                    <View style={styles.urineCellLast2}>
                      <Text style={styles.valueText2}>NAD</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.urineCell2}>
                      <Text style={styles.valueText2}></Text>
                    </View>
                    <View style={styles.urineCellLast2}>
                      <Text style={styles.valueText2}>NAD</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          padding: 5,
          flex: 1,
          height: "100%",
        }}
      >
        <View style={[styles.header, { borderBottom: 0 }]}>
          <View style={styles.logo}>
            <Image src={IsconBalajiLogo} style={{ height: 60 }} />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRow}>
              <Text
                style={{ flex: 1, fontSize: 10, fontWeight: "bold", margin: 4 }}
              >
                ISCON BALAJI FOODS PVT.LTD.
              </Text>
              <Text
                style={{
                  color: "#dc2626",
                  fontSize: 10,
                  fontWeight: "bold",
                  margin: 4,
                }}
              >
                CONTROL COPY
              </Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                DOCUMENT NAME
              </Text>
              <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                MEDICAL HEALTH CARD
              </Text>
            </View>
            <View style={styles.headerRow}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  DOCUMENT NO.
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  FMT/HR/10
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  PAGE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  2 OF 3
                </Text>
              </View>
            </View>
            <View style={[styles.headerRow, { borderBottom: 0 }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  ISSUE NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00-01.01.2024
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  REV. NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 40 }}>
          {/* Table for Skin diseases, Remark, Eyesight, Specs, Conclusion */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCell,
                  { width: "25%", justifyContent: "center", height: 60 },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Skin diseases:</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}>NAD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCell,
                  { width: "25%", justifyContent: "center", height: 60 },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Remark:</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCell,
                  { width: "25%", justifyContent: "center", height: 60 },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Eyesight:</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}>
                  {employeeData?.visionRemark || ""}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCell,
                  { width: "25%", justifyContent: "center", height: 60 },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Specs:</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}>
                  {employeeData?.specsRequired === true
                    ? "Yes"
                    : employeeData?.specsRequired === false
                    ? "No"
                    : ""}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View
                style={[
                  styles.tableCell,
                  {
                    width: "25%",
                    height: 60,
                    borderBottomWidth: 0,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Conclusion:</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}>
                  {employeeData?.conclusion || ""}
                </Text>
              </View>
            </View>
          </View>

          <Text style={{ marginTop: 20, marginBottom: 5, fontSize: 10 }}>
            Remark:
          </Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#000000",
              height: 20,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 10, marginLeft: 5 }}>FIT</Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#000000",
              height: 20,
              marginBottom: 30,
            }}
          >
            <Text style={{ fontSize: 10, marginLeft: 5 }}></Text>
          </View>

          {/* Table for Doctor's information */}
          <View style={[styles.table, { marginTop: 40 }]}>
            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCell,
                  { flex: 1, justifyContent: "center" },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Name of doctor</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { flex: 1, borderRightWidth: 1, borderColor: "#000000" },
                ]}
              >
                <Text style={{ fontSize: 10, marginLeft: 5 }}>
                  Dr Kunal Sharma
                </Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  { flex: 1, borderRightWidth: 0, justifyContent: "center" },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Seal/Stamp</Text>
              </View>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View
                style={[
                  styles.tableCell,
                  {
                    width: "33.4%",
                    borderBottomWidth: 0,
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 10 }}>Signature of the Doctor</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    flex: 1,
                    borderRightWidth: 0,
                    height: 60,
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Image
                  src={dr_kunal_stamp_sign}
                  style={{ height: 60, width: 80 }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>

    {/* Page 3 */}
    <Page size="A4" style={styles.page}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          padding: 5,
          flex: 1,
          height: "100%",
        }}
      >
        <View style={[styles.header, { borderBottom: 0 }]}>
          <View style={styles.logo}>
            <Image src={IsconBalajiLogo} style={{ height: 60 }} />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRow}>
              <Text
                style={{ flex: 1, fontSize: 10, fontWeight: "bold", margin: 4 }}
              >
                ISCON BALAJI FOODS PVT.LTD.
              </Text>
              <Text
                style={{
                  color: "#dc2626",
                  fontSize: 10,
                  fontWeight: "bold",
                  margin: 4,
                }}
              >
                CONTROL COPY
              </Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                DOCUMENT NAME
              </Text>
              <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                MEDICAL HEALTH CARD
              </Text>
            </View>
            <View style={styles.headerRow}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  DOCUMENT NO.
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  FMT/HR/10
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  PAGE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  3 OF 3
                </Text>
              </View>
            </View>
            <View style={[styles.headerRow, { borderBottom: 0 }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRightWidth: 1,
                  borderColor: "#000000",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  ISSUE NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00-01.01.2024
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", paddingLeft: 5 }}>
                <Text style={{ fontSize: 10, fontWeight: "bold", margin: 4 }}>
                  REV. NO/DATE
                </Text>
                <Text style={{ marginLeft: "auto", fontSize: 10, margin: 4 }}>
                  00
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 40 }}>
          <Text style={[styles.title, { textDecoration: "underline" }]}>
            Medical Fitness for food Handlers
          </Text>

          <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 12 }}>
            For The Year: {YEAR}
          </Text>

          <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 10 }}>
            (See Para No. 10.1.2, Part II, Schedule – 4 OF FSS Regulation, 2011)
          </Text>

          <Text style={{ fontSize: 10, marginBottom: 20, lineHeight: 1.5 }}>
            It is certify that{" "}
            {employeeData?.gender?.toLowerCase() === "male"
              ? "Mr"
              : employeeData?.gender?.toLowerCase() === "female"
              ? "Ms"
              : "Mr / Ms / Mrs"}{" "}
            <Text style={{ textDecoration: "underline" }}>
              {employeeData?.name || ""}
            </Text>{" "}
            employed with Ms Iscon Balaji Foods Private Limited coming in direct
            contact with food items has been carefully examined by me on:{" "}
            <Text style={{ textDecoration: "underline" }}>
              {employeeData?.vitalsCreatedDate || ""}.
            </Text>
          </Text>

          <Text style={{ fontSize: 10, marginBottom: 40, lineHeight: 1.5 }}>
            Based on the medical examination conducted he/she is found free from
            any infectious or communicable diseases and diseases and the person
            is fit to work in the above – mentioned food establishment.
          </Text>

          <Text style={{ fontSize: 10, marginBottom: 5 }}>
            Name & Signature with Seal of
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 10 }}>
            Registered Medical Practitioner / Civil Surgeon.
          </Text>

          <Image
            src={dr_kunal_stamp_sign}
            style={{ height: 60, width: 80, marginBottom: 30 }}
          />

          <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 10 }}>
            # Medical Examination to be conducted
          </Text>
          <View style={{ paddingLeft: 20 }}>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>
              1) Physical Examination
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>2) Eye Test</Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>
              3) Skin Examination
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 5 }}>
              4) Compliance with Schedule of Vaccine to be inoculated against
              enteric group of diseases.
            </Text>
            <Text style={{ fontSize: 10 }}>
              5) Any test required to confirm any communicable or infection
              disease which the person suspected to be suffering from on
              clinical examination.
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
