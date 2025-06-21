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
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { pdf } from "@react-pdf/renderer";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";

const SunPharmaBangalore = ({
  corpId = "55480539-461d-4077-a62f-b59b0d98e624",
  campCycleId = "300077",
  fileType = "ANNEXURE",
  companyAddress = "BIOLOGICS (API) PLANT SY. NO. 16, EKRAJAPURA, 8 KM STONE, SIDDLAGHATTA ROAD, HASIGALA POST,, HOSKOTE, BENGALURU-562114, KARNATAKA, INDIA",
  vitalsCreatedDate = "30th May 2025",
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
        <SunPharmaBangalorePDF
          data={data}
          companyAddress={companyAddress}
          vitalsCreatedDate={vitalsCreatedDate}
        />
      ).toBlob();

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_FORM24.pdf`);

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

      const temp = result?.data;

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
    for (let i = 0; i < list.length; i++) {
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
      <BlobProvider document={<SunPharmaBangalorePDF />}>
        {({ url }) => (
          <Button href={url || ""} download={"FMT"}>
            Download PDF
          </Button>
        )}
      </BlobProvider>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <SunPharmaBangalorePDF />
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

export default SunPharmaBangalore;

const SunPharmaBangalorePDF = ({ companyAddress, data, vitalsCreatedDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={[styles.title, { marginTop: 10 }]}>FORM No. 24</Text>
      <Text style={[styles.subtitle, { marginTop: 10 }]}>
        (See Rule 129 [Schedule VII])
      </Text>
      <Text style={[styles.title, { fontSize: 14, marginTop: 10 }]}>
        SPECIAL CERTIFICATE OF FITNESS
      </Text>
      <Text style={[styles.subtitle, { marginTop: 10 }]}>
        (In respect of persons employed in operations involving use of lead
        compounds)
      </Text>

      <View style={[styles.row, { marginTop: 30 }]}>
        <Text style={styles.label}>Serial No:</Text>
        <Text style={{ textDecoration: "underline" }}>{data?.empId}</Text>
      </View>
      <View style={[styles.row, { marginTop: 30 }]}>
        <Text style={styles.label}>Date:</Text>
        <Text style={{ textDecoration: "underline" }}>{vitalsCreatedDate}</Text>
      </View>

      <View style={[styles.section, { marginVertical: 50 }]}>
        <Text style={{ lineHeight: 2 }}>
          I hereby Certify that I have personally examined
          <Text style={styles.underline}> {data?.name || "          "} </Text>
          {data?.gender?.toLowerCase() === "male" ? (
            <Text> son </Text>
          ) : data?.gender?.toLowerCase() === "female" ? (
            <Text> daughter </Text>
          ) : (
            <Text></Text>
          )}
          of{" "}
          <Text style={styles.underline}>
            {data?.fathersName || "          "}{" "}
          </Text>{" "}
          residing at{" "}
          <Text style={[styles.underline, { textTransform: "capitalize" }]}>
            {companyAddress?.toLowerCase() || "          "}
          </Text>{" "}
          who is desirous of being employed as{" "}
          <Text style={styles.underline}>
            {data?.designation || "          "}
          </Text>{" "}
          in the{" "}
          <Text style={styles.underline}>
            {data?.department || "          "}
          </Text>{" "}
          and that his age, as nearly as can be ascertained from my examination
          is, <Text style={styles.underline}>{data?.age || "          "}</Text>{" "}
          years, and that he is in my opinion, fit for employment at work
          involving the use of lead compounds. His descriptive marks are
          <Text style={styles.underline}>{"         "}</Text>.
        </Text>
      </View>

      <View style={[styles.row, { marginBottom: 10 }]}>
        <Text style={styles.bold}>
          Left thumb impression of person examined.
        </Text>
        <Text style={{ flex: 1 }} />
        <Text style={styles.bold}>Certifying Surgeon.</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Image src={dr_kunal_stamp_sign} style={{ height: 60, width: 80 }} />
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableHeader]}>
            I Certify that I have examined the person mentioned above on:
            ..........
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>
            I extend this certificate until
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>
            Signature of Certifying Surgeon
          </Text>
          <Text style={[styles.tableCol, styles.tableHeader]}>
            Note of symptoms of lead poisoning (if any)
          </Text>
        </View>
        <View style={[styles.tableRow]}>
          <View
            style={[
              styles.tableCol,
              {
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text>{vitalsCreatedDate}</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text>1 Year</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Image
              src={dr_kunal_stamp_sign}
              style={{ height: 60, width: 80 }}
            />
          </View>
          <View
            style={[
              styles.tableCol,
              {
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text>None</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: { textAlign: "center", fontSize: 12, marginBottom: 8 },
  section: { marginBottom: 10 },
  bold: { fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { marginRight: 10 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: 20,
  },
  tableRow: { flexDirection: "row" },
  tableCol: { borderStyle: "solid", borderWidth: 1, flex: 1, padding: 4 },
  tableHeader: { fontWeight: "bold", backgroundColor: "#eee" },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    display: "inline",
    paddingHorizontal: 2,
    marginHorizontal: 2,
    textDecoration: "underline",
  },
});
