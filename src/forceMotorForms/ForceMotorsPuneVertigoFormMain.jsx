import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import ForceMotorsPuneVertigoFormTemplate from "./ForceMotorsPuneVertigoFormTemplate";

const ForceMotorsPuneVertigoFormMain = ({
  // corpId = "0bcd762b-3523-46eb-90c4-eed8154cd479",
  // campCycleId = "403772",
  corpId = "14dca1f0-fa04-4526-ba01-f5f83e0f2494",
  campCycleId = "410802",
  fileType = "FITNESS_CERTIFICATE_FOOD",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorEmpCount, setErrorEmpCount] = useState(0);
  const [errorEmpIDs, setErrorEmpIDs] = useState([]);

  const generatePDF = async (data) => {
    try {
      const pdfBlob = await pdf(
        <ForceMotorsPuneVertigoFormTemplate data={data} />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${data?.empId}_VERTIGO_FORM.pdf`
      );

      const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully uploaded Vertigo form PDF!", {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
        setErrorEmpCount((prev) => prev + 1);
        setErrorEmpIDs((prev) => [...prev, data?.empId]);
      }

      // const previewUrl = URL.createObjectURL(pdfBlob);
      // window.open(previewUrl, "_blank");
    } catch (error) {
      console.error("Error generating/uploading Vertigo form PDF:", error);
      enqueueSnackbar("Error generating/uploading Vertigo form PDF!", {
        variant: "error",
      });
      setErrorEmpCount((prev) => prev + 1);
      setErrorEmpIDs((prev) => [...prev, data?.empId]);
    }
  };

  const fetchListOfEmployees = async () => {
    if (!corpId || !campCycleId) return;

    const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result && result.data) {
      const temp = result.data.filter((item) => ["800071", "800120", "405492", "407151", "900068", "900074", "405857", "508086", "508177", "406721", "406732", "317751", "317762", "317872", "318226", "318281", "318606", "96681", "100373", "406654", "40216", "98947", "401291", "402881", "100011", "100473", "400389", "404849", "404735", "405870", "405711"

      ].includes(item?.empId))?.map((item) => ({
        ...item,
        visionWithGlasses:
          item?.farRightEyeSightWithGlasses &&
            item?.farLeftEyeSightWithGlasses &&
            item?.farRightEyeSightWithGlasses &&
            item?.nearLeftEyeSightWithGlasses
            ? `FAR (R-${item?.farRightEyeSightWithGlasses} L-${item?.farLeftEyeSightWithGlasses}) NEAR (R-${item?.nearRightEyeSightWithGlasses} L-${item?.nearLeftEyeSightWithGlasses})`
            : "",
      }));
      const sorted = sortDataByName(temp);
      setList(sorted);
      setTotalEmployees(sorted.length);
    } else {
      enqueueSnackbar("Error fetching employee list", { variant: "error" });
      setList([]);
      setTotalEmployees(0);
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully deleted PDF!", { variant: "success" });
    } else {
      enqueueSnackbar("An error occurred!", { variant: "error" });
    }
  };

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  return (
    <Fragment>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        <div>Error Files: {errorEmpCount}</div> <br />
        <div>Error EmpID: {errorEmpIDs.join(", ")}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: 12 }}>
            <div>{`${index}- ${item.empId} ${item.name}`} {item?.medicalFitnessFoodUrl ? <a href={item?.medicalFitnessFoodUrl}>{item?.medicalFitnessFoodUrl}</a> : ""}</div>
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <ForceMotorsPuneVertigoFormTemplate data={list[0]} />
      </PDFViewer>
    </Fragment>
  );
};

export default ForceMotorsPuneVertigoFormMain;
