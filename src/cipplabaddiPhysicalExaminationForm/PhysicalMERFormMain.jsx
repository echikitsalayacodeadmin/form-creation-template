import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import MedicalExamFormWithBorders from "./PhysicalMedicalExaminationPDF";
import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const PhysicalMERFormMain = ({
  corpId = "dd16b55c-2de0-4d1e-b6da-d2cbd98f7473",
  campCycleId = "350262",
  fileType = "ANNEXURE",
}) => {
  const _storedData = (() => {
    try {
      return JSON.parse(localStorage.getItem("SAVED_FORM32_FILTERS")) || {};
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {};
    }
  })();

  useEffect(() => {
    setFitStatus(_storedData?.fitStatus || "fit");
    setStartDate(_storedData?.startDate || "");
    setEndDate(_storedData?.endDate || "");
    setEmpIdFilter(_storedData?.empIdFilter || "");
    setSignature(_storedData?.signature || "dr_kunal_stamp_sign");
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // New state for user inputs

  const [fitStatus, setFitStatus] = useState("fit");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [signature, setSignature] = useState("dr_kunal_stamp_sign.png");

  const generatePDF = async (data, index) => {
    try {
      const pdfBlob = await pdf(
        <MedicalExamFormWithBorders data={data} fit={fitStatus} />
      ).toBlob();

      // const previewUrl = URL.createObjectURL(pdfBlob);
      // window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append("file", pdfBlob, `${data?.empId}_MER_FORM.pdf`);

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
    if (corpId && campCycleId) {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);
      if (result && result.data) {
        const emps = [
          "81000831",
          "168409",
          "29275",
          "155525",
          "81000410",
          "81001410",
          "81001182",
          "43858",
          "109951",
          "81000032",
          "103892",
          "81000585",
          "167996",
          "144607",
          "81001268",
          "128365",
          "105496",
          "96570",
          "15615",
          "92965",
          "81000650",
          "166189",
          "81000907",
          "84611",
          "15886",
          "81000078",
          "15382",
          "133216",
          "81000859",
          "81000908",
          "27202",
          "146015",
          "92781",
          "81000949",
          "81000962",
          "37198",
          "81001353",
          "15629",
          "165913",
          "81000097",
          "111999",
          "81001106",
          "169760",
          "128082",
          "81001238",
          "153741",
          "15877",
          "34341",
          "81000118",
          "81000862",
          "81000122",
          "105466",
          "81000987",
          "31223",
          "81001074",
          "81000134",
          "15620",
          "81000711",
          "145534",
          "165340",
          "37311",
          "81000499",
          "36504",
          "15764",
          "15518",
          "81000726",
          "81000169",
          "81001036",
          "43837",
          "139309",
          "A06254621",
          "42673",
          "49173",
          "81001154",
          "81000871",
          "81001152",
          "168199",
          "81000675",
          "157578",
          "81000561",
          "109205",
          "81000906",
          "81000217",
          "15627",
          "15468",
          "164081",
          "81001329",
          "81001053",
          "81001292",
          "81000246",
          "81001148",
          "81000247",
          "26984",
          "81000267",
          "81001095",
          "81000834",
          "103882",
          "81001365",
          "58180",
          "81001258",
          "166041",
          "28659",
          "81000912",
          "33971",
          "81000545",
          "81001431",
          "126561",
          "81001303",
          "81001167",
          "81001252",
          "81001156",
          "15712",
          "169521",
          "158571",
          "81001151",
          "81000348",
          "81001374",
          "105283",
          "81000842",
          "81000915",
          "139570",
          "15471",
          "43711",
          "81001429",
          "81000371",
          "106016",
          "155081",
          "81001164",
          "81000710",
          "15524",
          "58086",
          "155524",
          "131576",
          "93447",
          "58618",
          "154968",
          "170189",
          "81001172",
          "81001125",
          "165910",
          "28123",
          "47167",
          "166753",
          "165907",
          "93669",
          "146017",
          "15542",
          "165904",
          "159041",
          "120770",
          "164877",
          "158222",
          "85013",
          "165545",
          "81001256",
          "D05",
          "106162",
          "81000453",
          "33801",
          "54358",
          "27398",
          "34868",
          "37915",
          "167218",
          "108753",
          "15863",
          "44881",
          "35214",
          "81000098",
          "135943",
          "26313",
          "151213",
          "90975",
          "162760",
          "102106",
          "15667",
          "42674",
          "39317",
          "165544",
          "81001362",
          "32885",
          "15319",
          "36253",
          "81001192",
          "104936",
          "156651",
          "117736",
          "15699",
          "81001185",
          "43095",
          "165690",
          "144459",
          "81001335",
          "81001313",
          "81001350",
          "165110",
          "81001186",
          "47016",
          "38956",
          "38030",
          "15795",
          "157518",
          "45153",
          "167306",
          "129638",
          "123709",
          "159046",
          "15503",
          "39680",
          "15522",
          "169352",
          "36252",
          "15406",
          "169397",
          "104590",
          "81001381",
          "114925",
          "45975",
          "173064",
          "81000878",
          "135948",
          "33273",
          "42304",
          "39499",
          "47662",
          "15564",
          "102249",
          "81000288",
          "31765",
          "166612",
          "15815",
          "41159",
          "D-3",
          "110209",
          "129391",
          "81000694",
          "81000307",
          "84353",
          "25795",
          "36638",
          "35213",
          "121422",
          "81000728",
          "104442",
          "81000838",
          "81000486",
          "15575",
          "15748",
          "81001205",
          "25324",
          "92926",
          "15824",
          "15484",
          "25606",
          "15456",
          "D-1",
          "106766",
          "27264",
          "47240",
          "15720",
          "15102",
          "163532",
          "144353",
          "85348",
          "15755",
        ];
        // const emps = ["26984", "139570"];
        const temp = result?.data
          ?.filter((item) => item.annexureUrl)
          // .filter((item) => emps.includes(item.empId))
          ?.filter((item) => !item?.pulseRate)
          .map((item) => ({
            ...item,
            visionWithGlasses:
              item?.farRightEyeSightWithGlasses &&
              item?.farLeftEyeSightWithGlasses &&
              item?.farRightEyeSightWithGlasses &&
              item?.nearLeftEyeSightWithGlasses
                ? `FAR (R-${item?.farRightEyeSightWithGlasses} L-${item?.farLeftEyeSightWithGlasses}) NEAR (R-${item?.nearRightEyeSightWithGlasses} L-${item?.nearLeftEyeSightWithGlasses})`
                : "",
          }));
        // const temp = result?.data.filter((item) => emps.includes(item?.empId));
        const length = temp.length;
        const sorted = sortDataByName(temp);
        setList(sorted);
        setTotalEmployees(length);
      } else {
        console.log("An error Occurred");
        setList([]);
        setTotalEmployees("");
      }
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const filteredList = useMemo(() => {
    let filtered = [...list];
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const date = item.vitalsCreatedDate;
        return date >= startDate && date <= endDate;
      });
    }
    if (empIdFilter.trim()) {
      const empIds = empIdFilter.split(",").map((id) => id.trim());
      filtered = filtered.filter((item) => empIds.includes(item.empId));
    }
    setTotalEmployees(filtered.length);
    return filtered;
  }, [list, startDate, endDate, empIdFilter]);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < filteredList.length; i++) {
      await generatePDF(filteredList[i], i);
    }
  };
  const handleDeletePDF = async () => {
    for (let i = 0; i < filteredList.length; i++) {
      await deleteFiles(filteredList[i]);
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
  useEffect(() => {
    const savedFilter = {
      startDate,
      endDate,
      fitStatus,
      empIdFilter,
      signature,
    };
    localStorage.setItem("SAVED_FORM32_FILTERS", JSON.stringify(savedFilter));
  }, [startDate, endDate, fitStatus, empIdFilter, signature]);

  const [bloodData, setBloodData] = useState([]);
  const [excludedTestKeys, setExcludedTestKeys] = useState("");
  const getTestDetails = async () => {
    const url = `https://apibackend.uno.care/api/org/testsconfig`;
    const result = await getData(url);
    if (result.error) {
      console.log(result.error);
    } else {
      const temp = result.data.map((item, index) => ({
        id: index,
        ...item,
        editRow: "editRow",
      }));
      setBloodData(temp);
    }
  };

  useEffect(() => {
    getTestDetails();
  }, []);

  const errorEmployeeList = useMemo(() => {
    const tempData = list.filter(
      (emp) =>
        emp.vitalsErrorData && Object.keys(emp.vitalsErrorData)?.length > 0
    );

    return tempData?.map((val) => ({
      ...val,
      vitalsErrorDataList: Object.entries(val?.vitalsErrorData),
    }));
  }, [list]);

  const transformedData = useMemo(() => {
    const stringValuesUrine =
      bloodData.find((test) => test.testKey === "URINE.GLUCOSE")
        ?.stringTestKeyValues || [];
    const stringValuesHbsag =
      bloodData.find((test) => test.testKey === "HbsAg")?.stringTestKeyValues
        ?.UNHEALTHY_VALUES || [];
    const urineGlucoseEmployees = errorEmployeeList
      .filter(
        (item) =>
          stringValuesUrine?.["UNHEALTHY_VALUES"]?.includes[
            item.cholestrolData?.["URINE.GLUCOSE"]
          ]
      )
      .map((item) => ({
        empId: item.empId,
        name: item.name,
        age: item.age,
        gender: item.gender,
        vitalsCreatedDate: item.vitalsCreatedDate,
        token: item.tokenNumber, // Assuming you'll fill this in later
        vitalsDataError: `URINE.GLUCOSE : ${item.cholestrolData?.["URINE.GLUCOSE"]}`, // Displaying each key separately
        acceptableRange: "",
        vitalsDataReading: item.cholestrolData?.["URINE.GLUCOSE"],
        testKey: key,
      }));

    const hbsagEmployees = errorEmployeeList
      .filter((item) =>
        stringValuesHbsag?.["UNHEALTHY_VALUES"]?.includes(
          item.cholestrolData?.["HbsAg"]
        )
      )
      .map((item) => ({
        empId: item.empId,
        name: item.name,
        age: item.age,
        gender: item.gender,
        vitalsCreatedDate: item.vitalsCreatedDate,
        token: item.tokenNumber, // Assuming you'll fill this in later
        vitalsDataError: `HbsAg : ${item.cholestrolData?.["HbsAg"]}`, // Displaying each key separately
        acceptableRange: "",
        vitalsDataReading: employee.vitalsErrorData[key],
        testKey: key,
      }));

    const transformed = errorEmployeeList.flatMap((employee) => {
      const keys = Object.keys(employee.vitalsErrorData);
      return keys.map((key) => {
        const range = bloodData.find((range) => range.testKey === key);
        const acceptableRange = range
          ? `${range.acceptableRangeMin} - ${range.acceptableRangeMax}`
          : "Not available";
        return {
          empId: employee.empId,
          name: employee.name,
          vitalsDataError: `${key} : ${employee.vitalsErrorData[key]}`, // Displaying each key separately
          acceptableRange,
          vitalsDataReading: employee.vitalsErrorData[key],
          testKey: key,
          testKeyType: range?.orgEmployeeFileType,
        };
      });
    });

    let tempData = [...transformed, ...urineGlucoseEmployees, ...hbsagEmployees]
      .filter(
        (item) =>
          ![
            "height",
            "weight",
            // "bp",
            // "lowBp",
            // "highBp",
            "IS_HEIGHT_MATCH_PFT_VITALS",
            "IS_WEIGHT_MATCH_PFT_VITALS",
          ]?.includes(item.testKey)
      )
      .reduce((acc, item) => {
        if (!acc[item.testKey]) {
          acc[item.testKey] = [];
        }
        acc[item.testKey].push(item);
        return acc;
      }, {});

    return Object.entries(tempData).filter(
      ([key, value]) => !excludedTestKeys.split(",").includes(key)
    );
  }, [errorEmployeeList, bloodData, excludedTestKeys]);

  return (
    <Fragment>
      {/* User Inputs */}
      <h2>Cippla Physical Fitness Form</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} md={1.5}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormLabel component="legend">Status</FormLabel>
          <RadioGroup
            row
            value={fitStatus}
            onChange={(e) => setFitStatus(e.target.value)}
            name="fit-status-group"
          >
            <FormControlLabel value="fit" control={<Radio />} label="Fit" />
            <FormControlLabel value="unfit" control={<Radio />} label="Unfit" />
            <FormControlLabel
              value="temporaryUnfit"
              control={<Radio />}
              label="Temporary Unfit"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="EmpIDs (comma separated)"
            value={empIdFilter}
            onChange={(e) => setEmpIdFilter(e.target.value)}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormLabel component="legend">Signature</FormLabel>
          <RadioGroup
            row
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            name="signature-group"
          >
            <FormControlLabel
              value="dr_kunal_stamp_sign.png"
              control={<Radio />}
              label="Dr Kunal"
            />
            <FormControlLabel
              value="Dr_Jaydip_Saxena.png"
              control={<Radio />}
              label="Dr Jaydip"
            />
            <FormControlLabel
              value="prashantDeshmukh.png"
              control={<Radio />}
              label="Prashant Deshmukh"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={12} sx={{ maxWidth: 800, flexWrap: "wrap" }}>
          <Typography>UNFIT EMPIDS -</Typography>
          <TextField
            multiline
            fullWidth
            minRows={8}
            value={transformedData
              .flatMap(([_, records]) => records)
              .map((item, index) => ({ ...item, id: index }))
              .map((item) => item.empId)
              .join(",")}
          />
        </Grid>
      </Grid>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name} ${
              item?.bloodGroup
            }  ${item?.pulseRate || "p_R"} CV-${item?.colourVision || "_"} ${
              item?.visionRemark
            }`}</div>

            <a href={item.annexureUrl}>
              <div key={index}>{item.annexureUrl}</div>
            </a>

            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <MedicalExamFormWithBorders data={list[0]} fit={fitStatus} />
      </PDFViewer>
    </Fragment>
  );
};

export default PhysicalMERFormMain;
