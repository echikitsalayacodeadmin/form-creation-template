import React, { Fragment, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { updateData } from "../assets/services/PatchApi";
import { useSnackbar } from "notistack";

const GenericFormGenerator = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [template, setTemplate] = useState("");
  const [fileType, setFileType] = useState("");
  const [corpId, setCorpId] = useState("");
  const [fileName, setFileName] = useState("");
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [filter, setFilter] = useState({ name: "", dateFrom: "", dateTo: "" });

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("TEMPLATE")) || "";
    const tempCorpId = JSON.parse(localStorage.getItem("CORP_ID")) || "";
    const tempFileType = JSON.parse(localStorage.getItem("FILE_TYPE")) || "";
    const tempFileName = JSON.parse(localStorage.getItem("FILE_NAME")) || "";
    setTemplate(`${temp}`);
    setCorpId(tempCorpId);
    setFileType(tempFileType);
    setFileName(tempFileName);
  }, []);
  console.log({ template });
  const generatePDF = async (data) => {
    const populatedTemplate = template;
    // .replace('${data?.empId || ""}', data.empId || "")
    // .replace('${data?.department || ""}', data.department || "")
    // .replace('${data?.name || ""}', data.name || "")
    // .replace(' ${data?.empId || ""}', data.empId || "")
    // .replace('${data?.gender || ""}', data.gender || "")
    // .replace('${data?.age || ""}', data.age || "")
    // .replace('${data?.dateOfJoining || ""}', data.dateOfJoining || "")
    // .replace('${data?.nearRightEyeSight || ""}', data.nearRightEyeSight || "")
    // .replace('${data?.nearLeftEyeSight || ""}', data.nearLeftEyeSight || "")
    // .replace('${data?.farRightEyeSight || ""}', data.farRightEyeSight || "")
    // .replace('${data?.farLeftEyeSight || ""}', data.farLeftEyeSight || "");
    const pdfBlob = await html2pdf()
      .from(populatedTemplate)
      .output("blob")
      .then((data) => {
        return data;
      });

    const formData = new FormData();
    formData.append("file", pdfBlob, `${data.empId}_${fileName}.pdf`);
    if (fileType && corpId) {
      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=138858`;
      const result = await uploadFile(url, formData);
      if (result && result.data) {
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        console.log(result.error);
      }
    }
  };

  const fetchListOfEmployees = async () => {
    if (corpId) {
      const url = `
      https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=138858`;
      const result = await getData(url);
      if (result && result.data) {
        console.log("Fetched Data successfully");
        const filteredData = result.data.filter((item) => {
          const itemDate = new Date(item.date);
          const dateFrom = filter.dateFrom ? new Date(filter.dateFrom) : null;
          const dateTo = filter.dateTo ? new Date(filter.dateTo) : null;
          return (
            (!filter.name || item.name.includes(filter.name)) &&
            (!dateFrom || itemDate >= dateFrom) &&
            (!dateTo || itemDate <= dateTo)
          );
        });
        setList(sortDataByName(filteredData));
        setTotalEmployees(filteredData.length);
      } else {
        console.log(result.error);
      }
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [filter, corpId]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i]);
    }
  };

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    if (fileType && corpId) {
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
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  return (
    <Fragment>
      <div>
        <textarea
          title="Paste the Template Code"
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value);
            localStorage.setItem("TEMPLATE", JSON.stringify(e.target.value));
          }}
          placeholder="Paste the Template Codex"
          style={{
            height: "400px",
            width: "100%",
            borderRadius: "15px",
            backgroundColor: "#000",
            color: "#FFFFFF",
            padding: "10px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            outline: "none",
            resize: "none",
          }}
        />
      </div>

      <div>
        <textarea
          title="File Type"
          value={fileType}
          onChange={(e) => {
            localStorage.removeItem("FILE_TYPE");
            setFileType(e.target.value);
            localStorage.setItem("FILE_TYPE", JSON.stringify(e.target.value));
          }}
          placeholder="File Type"
          style={{
            height: "60px",
            width: "1200px",
            borderRadius: "15px",
            backgroundColor: "#000",
            color: "#FFFFFF",
            padding: "10px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            outline: "none",
            resize: "none",
          }}
        />
        <textarea
          title="CorpId"
          value={corpId}
          onChange={(e) => {
            localStorage.removeItem("CORP_ID");
            setCorpId(e.target.value);
            localStorage.setItem("CORP_ID", JSON.stringify(e.target.value));
          }}
          placeholder="CorpId"
          style={{
            height: "60px",
            width: "1200px",
            borderRadius: "15px",
            backgroundColor: "#000",
            color: "#FFFFFF",
            padding: "10px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            outline: "none",
            resize: "none",
          }}
        />
      </div>
      <div>
        <textarea
          title="Enter File Name"
          value={fileName}
          onChange={(e) => {
            localStorage.removeItem("FILE_NAME");
            setFileName(e.target.value);
            localStorage.setItem("FILE_NAME", JSON.stringify(e.target.value));
          }}
          placeholder="Enter File Name"
          style={{
            height: "60px",
            width: "250px",
            borderRadius: "15px",
            backgroundColor: "#000",
            color: "#FFFFFF",
            padding: "10px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "1px solid #ccc",
            outline: "none",
            resize: "none",
          }}
        />
      </div>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filter.name}
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            margin: "10px",
            fontSize: "16px",
          }}
        />
        <input
          type="date"
          name="dateFrom"
          placeholder="From Date"
          value={filter.dateFrom}
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            margin: "10px",
            fontSize: "16px",
          }}
        />
        <input
          type="date"
          name="dateTo"
          placeholder="To Date"
          value={filter.dateTo}
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            margin: "10px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ display: "flex", margin: 20, gap: 10 }}>
        <button
          onClick={fetchListOfEmployees}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Fetch Employee List
        </button>
        <button
          onClick={handleGeneratePDFs}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Start Generating
        </button>
        <button
          onClick={handleDeletePDF}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#FF4B4B",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Delete Files
        </button>
        <label
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "lightGreen",
            color: "#000",
            fontSize: "16px",
          }}
        >
          Total Files : {totalEmployees}
        </label>
        <label
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "lightGreen",
            color: "#000",
            fontSize: "16px",
          }}
        >
          Uploaded Files Count : {uploadedCount}
        </label>
      </div>
      <div>
        {list.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              color: "#000",
              fontSize: "16px",
            }}
          >
            <div key={index}>
              {item.empId} {item.name}
            </div>
            <a href={item.form35Url}>
              <div key={index}>{item.form35Url}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default GenericFormGenerator;
