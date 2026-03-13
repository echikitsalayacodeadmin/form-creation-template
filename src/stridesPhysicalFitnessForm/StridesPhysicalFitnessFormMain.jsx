import {
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import StridesPhysicalFitnessForm from "./StridesPhysicalFitnessForm";

const StridesPhysicalFitnessFormMain = ({
  corpId = "b4055483-4ae1-4c35-851c-6922940bfa80",
  campCycleId = "385039",
  fileType = "PHYSICAL_FITNESS_FORM",
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
      console.log({ data });
      // Pass fixed fitText based on fitStatus
      const isFit = fitStatus === "fit" ? true : false;
      const fitText =
        fitStatus === "fit"
          ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
          : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation.";
      const pdfBlob = await pdf(
        <StridesPhysicalFitnessForm
          data={data}
          fitText={fitText}
          signature={signature}
          isFit={isFit}
          company="Strides Pharma Science Limited "
        />
      ).toBlob();

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${data?.empId}_PhysicalFitnessForm.pdf`
      );

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
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const temp = result?.data?.filter((item) => [
        "111239",
        "114509",
        "113414",
        "113413",
        "113412",
        "113653",
        "V809",
        "BSS16811",
        "40003086",
        "113648",
        "111221",
        "DTSS0388258",
        "113650",
        "V823",
        "V822",
        "DTSS0388248",
        "BSS14647",
        "BSS14402",
        "BSS14401",
        "DTSS0388251",
        "BSS14400",
        "SV1075",
        "SV1078",
        "SV1077",
        "V830",
        "112550",
        "V816",
        "113624",
        "111687",
        "SV1073",
        "V819",
        "SV1070",
        "DTSS0388240",
        "SV1068",
        "SV1065",
        "SV1064",
        "20010277",
        "V605",
        "V604",
        "113699",
        "V603",
        "113697",
        "113696",
        "114546",
        "114547",
        "250491",
        "40003044",
        "40003043",
        "40003045",
        "40003040",
        "40003280",
        "V838",
        "V833",
        "BSS14679",
        "BSS14678",
        "250497",
        "113695",
        "113694",
        "V869",
        "V867",
        "V866",
        "113675",
        "114523",
        "BSS17968",
        "DTSS0448600",
        "113442",
        "110175",
        "V871",
        "V858",
        "V615",
        "V614",
        "10030202",
        "40003074",
        "40003070",
        "V889",
        "V1012",
        "V1013",
        "V404",
        "113257",
        "V1010",
        "V1011",
        "V1017",
        "V1014",
        "114108",
        "V1019",
        "V895",
        "V894",
        "40001062",
        "V893",
        "V892",
        "V891",
        "V890",
        "V1020",
        "V1023",
        "V877",
        "V1024",
        "V1028",
        "V1025",
        "V1029",
        "114584",
        "40003494",
        "114585",
        "V401",
        "40003493",
        "112163",
        "V881",
        "V428",
        "V425",
        "114568",
        "40003264",
        "114574",
        "114332",
        "40001088",
        "40003260",
        "113002",
        "113482",
        "113481",
        "40001080",
        "111049",
        "V417",
        "V415",
        "V899",
        "V1002",
        "V898",
        "V414",
        "V1000",
        "V1005",
        "114555",
        "V1006",
        "114556",
        "DTSS0327741",
        "V1003",
        "114557",
        "V1004",
        "114558",
        "114316",
        "V1009",
        "40003029",
        "V1007",
        "V1008",
        "111296",
        "111297",
        "V663",
        "111292",
        "111290",
        "V208",
        "V449",
        "V448",
        "V689",
        "40001265",
        "V690",
        "40002113",
        "40003443",
        "40002114",
        "114395",
        "114396",
        "114397",
        "V213",
        "V212",
        "V453",
        "V211",
        "V210",
        "V693",
        "113062",
        "20010405",
        "V439",
        "114378",
        "114379",
        "40003213",
        "114381",
        "113291",
        "40003215",
        "113299",
        "40002360",
        "114380",
        "40003216",
        "114373",
        "40003225",
        "114374",
        "114375",
        "114376",
        "114377",
        "112195",
        "V231",
        "113269",
        "V216",
        "40003477",
        "111091",
        "40003475",
        "40003232",
        "V224",
        "V221",
        "V220",
        "BSS17223",
        "DFSE121",
        "V492",
        "114076",
        "40001581",
        "180813",
        "DTSS0261617",
        "V257",
        "V011",
        "V238",
        "40001109",
        "40002684",
        "40001114",
        "130573C",
        "40002440",
        "V005",
        "DTSS0261627",
        "V004",
        "V245",
        "DTSS0261626",
        "V002",
        "V001",
        "DTSS0261623",
        "V242",
        "V029",
        "V028",
        "127274C",
        "BSS15067",
        "BSS15069",
        "40002206",
        "114293",
        "40003301",
        "623662U",
        "DTSS0261631",
        "DTSS0610080",
        "DTSS0261630",
        "40003302",
        "DTSS0261638",
        "V037",
        "V279",
        "V035",
        "V276",
        "114290",
        "114291",
        "DTSS0261633",
        "114292",
        "V019",
        "V017",
        "V259",
        "40002216",
        "DTSS0261642",
        "40003556",
        "40001136",
        "DTSS0281473",
        "114046",
        "V269",
        "V026",
        "V025",
        "V267",
        "DTSS0261647",
        "V024",
        "DTSS0261646",
        "V023",
        "V264",
        "V022",
        "40002628",
        "112927",
        "111838",
        "112923",
        "V052",
        "V050",
        "40000696",
        "V059",
        "V058",
        "V057",
        "V056",
        "V298",
        "V055",
        "V054",
        "V295",
        "135928C",
        "BSS17011",
        "BSS18102",
        "40002876",
        "40002877",
        "V041",
        "V281",
        "70053673C",
        "40002880",
        "40002881",
        "V047",
        "V288",
        "V045",
        "V044",
        "V1030",
        "V1031",
        "615549U",
        "V1035",
        "V1032",
        "V1033",
        "V1038",
        "V1039",
        "112906",
        "V1036",
        "V1037",
        "40001563",
        "V073",
        "40002896",
        "40003500",
        "V070",
        "V079",
        "V1041",
        "108896",
        "V1042",
        "V1040",
        "110718",
        "40002418",
        "40002655",
        "40002415",
        "40001326",
        "111801",
        "V062",
        "V061",
        "V067",
        "V066",
        "110546",
        "112723",
        "DTSS0302892",
        "180412",
        "V096",
        "615582U",
        "V095",
        "DTSS0261693",
        "SV1010",
        "V092",
        "DTSS0261691",
        "SV1012",
        "SV1011",
        "PA087",
        "SV1018",
        "DTSS0261698",
        "112713",
        "40002837",
        "40002838",
        "V084",
        "V083",
        "V082",
        "SV1001",
        "SV1007",
        "V088",
        "PA092",
        "SV1006",
        "SV1009",
        "V086",
        "SV1008",
        "109535",
        "112700",
        "40002605",
        "40002842",
        "40002843",
        "BSS14369",
        "40002844",
        "BSS15225",
        "BSS14367",
        "BSS14364",
        "DTSS0368805",
        "110998",
        "112934",
        "BSS14379",
        "BSS14378",
        "BSS14377",
        "113856",
        "40000607",
        "40000849",
        "110588",
        "109355",
        "112520",
        "DTSS0359902",
        "DTSS0518012",
        "109594",
        "SV1063",
        "109595",
        "SV1062",
        "SV1058",
        "DTSS0261652",
        "BSS14388",
        "DTSS0261650",
        "DTSS0388233",
        "SV1054",
        "SV1053",
        "BSS14384",
        "BSS14383",
        "668847U",
        "SV1055",
        "BSS14381",
        "BSS14380",
        "110591",
        "DTSS0261656",
        "DTSS0261655",
        "113603",
        "112993",
        "112992",
        "40001944",
        "DTSS0388215",
        "DTSS0388219",
        "DTSS0261664",
        "DTSS0261663",
        "BSS14399",
        "DTSS0261662",
        "SV1049",
        "BSS14398",
        "DTSS0261660",
        "250530",
        "BSS14392",
        "DTSS0261668",
        "DTSS0261667",
        "DTSS0481560",
        "V903",
        "112502",
        "112501",
        "V900",
        "138514C",
        "108483",
        "V908",
        "V907",
        "V905",
        "DTSS0261674",
        "SV1037",
        "DTSS0261671",
        "DTSS0261670",
        "SV1034",
        "DTSS0261679",
        "DTSS0261678",
        "111402",
        "40000636",
        "113825",
        "SV1025",
        "SV1027",
        "DTSS0623338",
        "DTSS0261681",
        "DTSS0261680",
        "DTSS0401264",
        "SV1022",
        "SV1029",
        "V922",
        "V921",
        "40000920",
        "108914C",
        "114622",
        "114623",
        "109034",
        "114624",
        "114625",
        "V928",
        "250569",
        "250326",
        "V913",
        "113524",
        "40000930",
        "V916",
        "114606",
        "V948",
        "V947",
        "V946",
        "V703",
        "V944",
        "V942",
        "V941",
        "109251",
        "20010393",
        "40000946",
        "20010392",
        "40000945",
        "V709",
        "113999",
        "V951",
        "V937",
        "V936",
        "V934",
        "113743",
        "V932",
        "131073C",
        "V930",
        "DTSS0403879",
        "V939",
        "40000960",
        "DTSS0560032",
        "V940",
        "V726",
        "V968",
        "112006",
        "V967",
        "V966",
        "V723",
        "112487",
        "112486",
        "114426",
        "BSS14544",
        "20010369",
        "640389U",
        "DTSS0359874",
        "114419",
        "DTSS0298798",
        "V957",
        "V714",
        "V956",
        "111389",
        "113567",
        "111388",
        "V954",
        "113566",
        "V712",
        "111387",
        "V711",
        "V710",
        "109089",
        "130889C",
        "114418",
        "V961",
        "113317",
        "V987",
        "V744",
        "V985",
        "40000901",
        "111385",
        "V753",
        "V995",
        "40002094",
        "V994",
        "111383",
        "V993",
        "111382",
        "V992",
        "40003181",
        "40000916",
        "V979",
        "V978",
        "V977",
        "V976",
        "V975",
        "113300",
        "111372",
        "110282",
        "V981",
        "V980",
        "V528",
        "113379",
        "V767",
        "113378",
        "40002031",
        "114473",
        "114474",
        "40003123",
        "V533",
        "V774",
        "V531",
        "V515",
        "V998",
        "V997",
        "113124",
        "40003132",
        "40003134",
        "40001197",
        "40003133",
        "113371",
        "113358",
        "114449",
        "109091",
        "114210",
        "114453",
        "TME1022",
        "V797",
        "113364",
        "TME1021",
        "40002051",
        "TME1020",
        "40002052",
        "113360",
        "TME1025",
        "TME1024",
        "V790",
        "V538",
        "V779",
        "V535",
        "112498",
        "113344",
        "40003158",
        "40003157",
        "40003159",
        "114200",
        "113596",
        "V544",
        "V543",
        "V785",
        "40003152",
        "V300",
        "V782",
        "V780",
        "TME1008",
        "TME1007",
        "TME1006",
        "TME1005",
        "TME1009",
        "114268",
        "40001137",
        "181020",
        "BSS15800",
        "40003566",
        "V574",
        "TME1004",
        "TME1003",
        "636370",
        "TME1002",
        "TME1001",
        "TME1019",
        "TME1018",
        "TME1017",
        "TME1016",
        "114257",
        "40003571",
        "TME1011",
        "V563",
        "TME1014",
        "TME1013",
        "V560",
        "TME1012",
        "V109",
        "V108",
        "V106",
        "40003588",
        "114254",
        "40002252",
        "114255",
        "40003343",
        "114256",
        "V357",
        "V114",
        "V598",
        "V113",
        "BSS19172",
        "113389",
        "40003106",
        "114480",
        "40003114",
        "40003110",
        "40003594",
        "V104",
        "113396",
        "40003592",
        "V102",
        "V101",
        "V100",
        "PA118",
        "V129",
        "V128",
        "V127",
        "40003639",
        "BSS17584",
        "40003642",
        "40002555",
        "V379",
        "V130",
        "PA129",
        "V119",
        "V118",
        "40002556",
        "108654C",
        "114184",
        "V126",
        "V125",
        "V120",
        "PA137",
        "PA133",
        "V149",
        "V391",
        "V390",
        "114176",
        "114177",
        "PA143",
        "PA142",
        "V396",
        "PA149",
        "PA148",
        "PA145",
        "PA147",
        "PA146",
        "114161",
        "V148",
        "PA151",
        "V388",
        "PA153",
        "V386",
        "V385",
        "PA150",
        "BSS16290",
        "615559U",
        "40002989",
        "40002990",
        "109405",
        "40003609",
        "DTSS0261708",
        "BSS16284",
        "40003605",
        "40003608",
        "20030406",
        "DTSS0261705",
        "DTSS0261703",
        "180905",
        "DTSS0261719",
        "DTSS0261718",
        "DTSS0261717",
        "40002769",
        "110606",
        "110604",
        "40003612",
        "40000351",
        "V194",
        "V190",
        "DTSS0261716",
        "108757",
        "DTSS0261711",
        "V197",
        "DTSS0364526",
        "DTSS0261729",
        "40003628",
        "40002538",
        "DTSS0492980",
        "40003625",
        "DTSS0431603",
        "40002785",
        "V182",
        "V181",
        "109619",
        "DTSS0261727",
        "DTSS0261724",
        "DTSS0261723",
        "V188",
        "DTSS0261722",
        "V187",
        "109618",
        "40002705",
        "112609",
        "Dtss021673",
        "40000528",
        "40000526",
        "BSS18838",
        "113924",
        "40002957",
        "40000778",
        "40002961",
        "BSS14475",
        "40000782",
        "180309",
        "111976",
        "40000304",
        "40002968",
        "40000549",
        "40000795",
        "112812",
        "112814",
        "113900",
        "113901",
        "DTSS0569923",
        "PA159",
        "112401",
        "PA156",
        "112400",
        "PA157",
        "BSS16692",
        "40002903",
        "40000724",
        "DTSS0425587",
        "110471",
        "PA162",
        "PA165",
        "PA161",
        "40002916",
        "112873",
        "109482",
        "111306",
        "DTSS0261780",
        "615577U",
        "250621",
        "110676",
        "40002939",
        "109466",
        "109463",
        "113704"
      ].includes(item?.empId)
      );

      const length = temp.length;
      console.log({ length });
      const sorted = sortDataByName(temp);
      setList(sorted);

      console.log({ empLisy: sorted });
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
    // eslint-disable-next-line
  }, [corpId, campCycleId]);

  // Filtering logic with useMemo
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
      <h2>Strides Physical Fitness Form</h2>
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
        {filteredList.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
            <a href={item.physicalFitnessFormUrl}>
              <div key={index}>{item.physicalFitnessFormUrl}</div>
            </a>
            <br />
          </div>
        ))}
      </div>

      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <StridesPhysicalFitnessForm
          data={list[0]}
          fitText={
            fitStatus === "fit"
              ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
              : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation."
          }
          signature={signature}
          company="Strides Pharma Science Limited"
          isFit={fitStatus === "fit" ? true : false}
        />
      </PDFViewer>
    </Fragment>
  );
};

export default StridesPhysicalFitnessFormMain;
