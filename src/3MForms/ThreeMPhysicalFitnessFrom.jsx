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
import ThreeMTemplatePhyscialFitnessForm from "./ThreeMTemplatePhyscialFitnessForm";

const ThreeMPhysicalFitnessFrom = ({
    corpId = "3e980884-00a6-470a-bb69-f29dfa0b01c2",
    campCycleId = "390725",
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
    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const batchSize = 50;
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [fitStatus, setFitStatus] = useState("fit");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [empIdFilter, setEmpIdFilter] = useState("");

    const generatePDF = async (data, index) => {
        try {
            console.log({ data });
            // Pass fixed fitText based on fitStatus
            const fitText =
                fitStatus === "fit"
                    ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
                    : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation.";
            const pdfBlob = await pdf(
                <ThreeMTemplatePhyscialFitnessForm
                    data={data}
                    fitText={fitText}
                    company="3M INDIA LTD Ranjangaon"
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

            // const h = ["132064"];

            const temp = result?.data?.filter((item) =>
                [
                    "S654",
                    "1333408",
                    "S652",
                    "1391533",
                    "2098991",
                    "GS20",
                    "1249028",
                    "Sh1533",
                    "Sh1415",
                    "2208130",
                    "GS24",
                    "GS27",
                    "1196657",
                    "GS26",
                    "2188565",
                    "1390559",
                    "JTS10",
                    "1308680",
                    "JTS16",
                    "JTS17",
                    "JTS14",
                    "JTS15",
                    "1192170",
                    "1643753",
                    "Fmskon014",
                    "2155646",
                    "Atharva48",
                    "Atharva49",
                    "A0349",
                    "Med3",
                    "Atharva43",
                    "Atharva44",
                    "Atharva45",
                    "Atharva46",
                    "1204470",
                    "1391544",
                    "GS14",
                    "Sh1404",
                    "GS13",
                    "1192167",
                    "B2",
                    "GS16",
                    "1249033",
                    "GS15",
                    "B4",
                    "GS18",
                    "1249031",
                    "GS17",
                    "B5",
                    "4",
                    "B6",
                    "1171366",
                    "6",
                    "1171367",
                    "721505",
                    "S651",
                    "Atharva40",
                    "9",
                    "Atharva41",
                    "Atharva42",
                    "1790347",
                    "1160318",
                    "2179624",
                    "Atharva37",
                    "Atharva2",
                    "Atharva1",
                    "1258087",
                    "Atharva8",
                    "Atharva32",
                    "Atharva7",
                    "Atharva6",
                    "Atharva34",
                    "BK001280",
                    "Atharva5",
                    "GS40",
                    "Atharva9",
                    "29000853",
                    "C1",
                    "C2",
                    "CBRE1",
                    "C3",
                    "C4",
                    "C5",
                    "C6",
                    "C7",
                    "C8",
                    "2121841",
                    "1194571",
                    "Atharva27",
                    "Atharva28",
                    "1221822",
                    "Atharva21",
                    "Atharva23",
                    "GS30",
                    "GS32",
                    "A0363",
                    "GS34",
                    "1220731",
                    "Atharva29",
                    "Sh1505",
                    "CBRE3",
                    "CBRE2",
                    "GS35",
                    "2220032",
                    "GS39",
                    "1305166",
                    "1194561",
                    "Atharva14",
                    "Atharva15",
                    "Atharva16",
                    "Atharva17",
                    "1136423",
                    "Atharva10",
                    "Sh1574",
                    "Sh1572",
                    "Atharva12",
                    "Atharva13",
                    "Nectar9",
                    "Sh1579",
                    "Sh1576",
                    "Sh1577",
                    "BK001066",
                    "Atharva18",
                    "1149749",
                    "1194554",
                    "1194557",
                    "DTS23",
                    "Sh1560",
                    "Tejas10",
                    "DTS25",
                    "DTS20",
                    "Sh1563",
                    "Sh1564",
                    "Sh0351",
                    "Sh1561",
                    "Sh1568",
                    "BH1",
                    "Sh1566",
                    "BH3",
                    "BH2",
                    "Sh1448",
                    "DTS29",
                    "BH4",
                    "Nectar1",
                    "Nectar2",
                    "1305262",
                    "Nectar3",
                    "Nectar4",
                    "1305261",
                    "Nectar5",
                    "Ani0088",
                    "Nectar6",
                    "Nectar7",
                    "Nectar8",
                    "DTS13",
                    "DTS12",
                    "1156057",
                    "DTS14",
                    "GS1",
                    "GS3",
                    "DTS11",
                    "GS2",
                    "Sh1551",
                    "DTS10",
                    "1367483",
                    "GS5",
                    "GS7",
                    "GS6",
                    "GS9",
                    "DTS17",
                    "DTS16",
                    "DTS19",
                    "DTS18",
                    "BK100199",
                    "1773951",
                    "Sh1541",
                    "1196939",
                    "Sh1546",
                    "1196938",
                    "1151955",
                    "Sh1426",
                    "1802326",
                    "1196940",
                    "Rk2",
                    "23200932",
                    "29006450",
                    "A507",
                    "2139307",
                    "1380121",
                    "1687977",
                    "1166963",
                    "1714635",
                    "BHS2",
                    "2218576",
                    "A519",
                    "1147070",
                    "A517",
                    "2209511",
                    "CN2",
                    "2209514",
                    "CN1",
                    "CN4",
                    "JTS3",
                    "CN3",
                    "A514",
                    "CN6",
                    "1139107",
                    "JTS2",
                    "CN5",
                    "CN8",
                    "CN7",
                    "JTS5",
                    "2138567",
                    "CN9",
                    "JTS9",
                    "2187407",
                    "1975110",
                    "29005342",
                    "29003282",
                    "A522",
                    "A520",
                    "SPM-03",
                    "1222402",
                    "1222401",
                    "2120911",
                    "1521372",
                    "1141680",
                    "1171055",
                    "1863432",
                    "1380109",
                    "Ani24246",
                    "1139129",
                    "SPM-02",
                    "SPM-01",
                    "301",
                    "302",
                    "Neipl409",
                    "303",
                    "1140584",
                    "304",
                    "305",
                    "1141679",
                    "1380118",
                    "1714642",
                    "1307980",
                    "2213920",
                    "1307955",
                    "1307956",
                    "1382221",
                    "314",
                    "1171394",
                    "317",
                    "318",
                    "319",
                    "1327445",
                    "2207013",
                    "C15",
                    "1138698",
                    "2175836",
                    "JPPL12",
                    "JPPL11",
                    "320",
                    "321",
                    "JPPL10",
                    "1382234",
                    "200",
                    "2184452",
                    "323",
                    "202",
                    "2175828",
                    "324",
                    "326",
                    "206",
                    "327",
                    "207",
                    "1138696",
                    "328",
                    "329",
                    "2092854",
                    "1195590",
                    "2126146",
                    "2092858",
                    "BK000809",
                    "29003002",
                    "29003003",
                    "2213829",
                    "330",
                    "331",
                    "332",
                    "212",
                    "334",
                    "215",
                    "BK100237",
                    "1665962",
                    "2132808",
                    "219",
                    "2182007",
                    "B10",
                    "B11",
                    "ANI8",
                    "1350415",
                    "303656",
                    "B12",
                    "AP2",
                    "AP3",
                    "1169180",
                    "ANI6",
                    "2171495",
                    "AP4",
                    "B14",
                    "ANI7",
                    "AP5",
                    "ANI5",
                    "B16",
                    "ANI2",
                    "AP7",
                    "B17",
                    "B18",
                    "AP8",
                    "AP9",
                    "ANI1",
                    "1929281",
                    "1361775",
                    "100",
                    "222",
                    "344",
                    "345",
                    "347",
                    "348",
                    "106",
                    "349",
                    "108",
                    "1382338",
                    "109",
                    "Etp290",
                    "1361772",
                    "1382337",
                    "1382336",
                    "29001164",
                    "1154575",
                    "Y0651",
                    "29002137",
                    "BK000851",
                    "A465",
                    "1372337",
                    "1372335",
                    "352",
                    "111",
                    "353",
                    "112",
                    "234",
                    "236",
                    "115",
                    "237",
                    "238",
                    "239",
                    "119",
                    "Y0646",
                    "1182918",
                    "1386868",
                    "10",
                    "11",
                    "12",
                    "14",
                    "15",
                    "19",
                    "240",
                    "120",
                    "AFM273",
                    "241",
                    "121",
                    "242",
                    "122",
                    "243",
                    "Uno1",
                    "BK100222",
                    "245",
                    "124",
                    "246",
                    "Uno2",
                    "125",
                    "Uno3",
                    "248",
                    "127",
                    "249",
                    "21",
                    "23",
                    "24",
                    "25",
                    "29005984",
                    "Shree2",
                    "27",
                    "29005986",
                    "29005629",
                    "251",
                    "252",
                    "132",
                    "253",
                    "254",
                    "BK000519",
                    "134",
                    "255",
                    "135",
                    "CWJPPL2",
                    "256",
                    "CWJPPL1",
                    "257",
                    "258",
                    "259",
                    "138",
                    "Y546",
                    "1382247",
                    "31",
                    "1382248",
                    "33",
                    "36",
                    "37",
                    "1305601",
                    "39",
                    "1305603",
                    "260",
                    "261",
                    "141",
                    "262",
                    "142",
                    "143",
                    "264",
                    "265",
                    "266",
                    "267",
                    "146",
                    "148",
                    "269",
                    "149",
                    "41",
                    "Admin1",
                    "ANI11240",
                    "29002690",
                    "46",
                    "49",
                    "AP18",
                    "AP19",
                    "1155748",
                    "JPPL3",
                    "AP16",
                    "JPPL4",
                    "AP17",
                    "271",
                    "AP14",
                    "JPPL6",
                    "JPPL7",
                    "AP15",
                    "152",
                    "274",
                    "AP11",
                    "156",
                    "1382069",
                    "277",
                    "278",
                    "279",
                    "159",
                    "JPPL1",
                    "1341879",
                    "Y0722",
                    "Y0723",
                    "52",
                    "54",
                    "55",
                    "56",
                    "1303406",
                    "57",
                    "58",
                    "Y0721",
                    "1303401",
                    "59",
                    "23221964",
                    "AP29",
                    "280",
                    "AP27",
                    "2159884",
                    "281",
                    "AP28",
                    "AP25",
                    "162",
                    "283",
                    "AP26",
                    "163",
                    "AP23",
                    "164",
                    "AP24",
                    "285",
                    "165",
                    "Tejas3",
                    "Tejas4",
                    "AP22",
                    "287",
                    "289",
                    "AP20",
                    "Tejas6",
                    "168",
                    "169",
                    "Tejas7",
                    "A391",
                    "Y0719",
                    "Tejas8",
                    "Tejas9",
                    "Y0717",
                    "1146907",
                    "60",
                    "61",
                    "Y0718",
                    "62",
                    "1387649",
                    "TE234",
                    "Tejas1",
                    "Y0714",
                    "68",
                    "69",
                    "1303617",
                    "Y0710",
                    "1377608",
                    "290",
                    "291",
                    "170",
                    "1531021",
                    "AP38",
                    "292",
                    "AP39",
                    "1221077",
                    "1303618",
                    "293",
                    "294",
                    "AP37",
                    "173",
                    "295",
                    "296",
                    "175",
                    "AP35",
                    "177",
                    "298",
                    "178",
                    "23106600",
                    "IN000347",
                    "Y0708",
                    "2116738",
                    "70",
                    "72",
                    "1175330",
                    "74",
                    "75",
                    "Y0702",
                    "76",
                    "Neipl454",
                    "77",
                    "1303625",
                    "79",
                    "Sh964",
                    "1303621",
                    "2182409",
                    "CW001",
                    "1303622",
                    "1303623",
                    "183",
                    "AP45",
                    "185",
                    "DTS2",
                    "AP43",
                    "187",
                    "DTS3",
                    "AP44",
                    "189",
                    "Y576",
                    "DTS5",
                    "AP42",
                    "DTS6",
                    "DTS8",
                    "DTS9",
                    "80",
                    "81",
                    "1197351",
                    "82",
                    "84",
                    "1199530",
                    "89",
                    "1349157",
                    "BHC1",
                    "1830299",
                    "195",
                    "C002",
                    "90",
                    "Y007",
                    "91",
                    "94",
                    "95",
                    "1212269",
                    "1259341",
                    "1259342",
                    "1242802",
                    "29001314",
                    "Dts001",
                    "Kareshwar5",
                    "Kareshwar4",
                    "Kareshwar3",
                    "1194741",
                    "23212585",
                    "Kareshwar9",
                    "Kareshwar8",
                    "2154270",
                    "1146300",
                    "23198752",
                    "Kareshwar7",
                    "Kareshwar6",
                    "Kareshwar1",
                    "Y0359",
                    "1159768",
                    "Ani22975",
                    "Sh1232",
                    "2183807",
                    "BK001323",
                    "Sh1235",
                    "Kareshwar10",
                    "BK001321",
                    "AEG0142",
                    "1437476",
                    "Sh001",
                    "23137227",
                    "1441707",
                    "Sh1460",
                    "MLL2",
                    "Sh1583",
                    "Sh1220",
                    "1352231",
                    "1193627",
                    "Im1",
                    "M33",
                    "Im2",
                    "Hk1",
                    "1352235",
                    "PROE004",
                    "1199280",
                    "IM3",
                    "Sah1",
                    "1206505",
                    "1147960",
                    "1146758",
                    "RPOE005",
                    "Sah2",
                    "1182839",
                    "1180795",
                    "1180793",
                    "IN2",
                    "29002724",
                    "IN1",
                    "777909",
                    "1147954",
                    "1147955",
                    "Tejes3",
                    "S637",
                    "1180766",
                    "MEL78",
                    "1204468",
                    "CN10",
                    "Bh001",
                    "1797646",
                    "1344521",
                    "1180771",
                    "2112418",
                    "1357849",
                    "1208814",
                    "Sai2",
                    "Sai1",
                    "Karshwar8",
                    "1146405",
                    "2107065",
                    "Y0414",
                    "Sai4",
                    "Sai3",
                    "Y0538"
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
        };
        localStorage.setItem("SAVED_FORM32_FILTERS", JSON.stringify(savedFilter));
    }, [startDate, endDate, fitStatus, empIdFilter]);

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
            <h1>ThreeMPhysicalFitnessFrom</h1>
            {/* User Inputs */}

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
                        <div
                            key={index}
                        >{`${index}- ${item.empId} ${item.name} ${item.bloodGroup}`}</div>
                        <a href={item.physicalFitnessFormUrl}>
                            <div key={index}>{item.physicalFitnessFormUrl}</div>
                        </a>
                        <br />
                    </div>
                ))}
            </div>

            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <ThreeMTemplatePhyscialFitnessForm
                    data={filteredList[0]}
                    fitText={
                        fitStatus === "fit"
                            ? "After examining & above result of above stated executive, I hereby confirm that he is FIT to work."
                            : "After examining & above result of above stated executive, I hereby confirm that he is advised medical consultation."
                    }
                    company="3M INDIA LTD Ranjangaon"
                />
            </PDFViewer>
        </Fragment>
    );
};

export default ThreeMPhysicalFitnessFrom;
