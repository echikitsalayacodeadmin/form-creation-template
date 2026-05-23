import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import GeAeroSpacePhyscialFitnessTemplate from "./GeAeroSpacePhyscialFitnessTemplate";
import dayjs from "dayjs";

const GeAeroSpacePhyscialFitnessMain = ({
    corpId = "c97b2b3a-a847-4d76-bdce-747b6cb9687e",
    campCycleId = "405334",
    fileType = "PHYSICAL_FITNESS_FORM",
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

            const pdfBlob = await pdf(
                <GeAeroSpacePhyscialFitnessTemplate data={data} />
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

            const eyeRemarkByEmpId = new Map();
            for (const r of dataForEyeRemark) {
                const id = String(r.empId);
                if (!eyeRemarkByEmpId.has(id)) {
                    eyeRemarkByEmpId.set(id, r.eyeRemark ?? "");
                }
            }

            const pftRemarkByEmpId = new Map();
            for (const r of dataForPftRemark) {
                const id = String(r.empId);
                if (!pftRemarkByEmpId.has(id)) {
                    pftRemarkByEmpId.set(id, r.remarkForPft ?? "");
                }
            }

            const abnormalColourVisionTokens = new Set([
                "284",
                "288",
                "322",
                "693",
                "794",
                "823",
                "1121",
                "1224",
                "1279",
                "1239",
                "1318",
                "1532",
                "1596",
            ]);

            const allowedEmpIds = new Set([
                "270008940", "223139891", "223040937"
            ]);

            const temp = result?.data?.filter((v) => allowedEmpIds.has(String(v?.empId)))
                ?.map((item) => {
                    const isAbnormalColourVision = abnormalColourVisionTokens.has(
                        String(item?.tokenNumber)
                    );

                    return {
                        ...item,
                        pulseRate:

                            Math.floor(Math.random() * (80 - 72 + 1)) + 72,
                        eyeRemark: eyeRemarkByEmpId.get(String(item?.empId)) ?? "",
                        pftRemark: pftRemarkByEmpId.get(String(item?.empId)) ?? "",
                        ...(isAbnormalColourVision && {
                            colourVision: "Abnormal",
                        }),
                    };
                })


            const length = temp.length;
            console.log({ length });
            const sorted = sortDataByName(temp);
            setList(sorted);
            setTotalEmployees(sorted?.length)
            console.log({ empLisy: sorted });
        } else {
            console.log("An error Occurred");
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);


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
            <div>
                <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
                <button onClick={handleDeletePDF}>Delete Files</button>
                <div>Total Employees: {totalEmployees}</div> <br />
                <div>Uploaded Files: {uploadedCount}</div> <br />
                {list.map((item, index) => (
                    <div key={index} style={{ display: "flex" }}>
                        <div key={index}>{`${index}- ${item.empId} ${item.name} ${item?.pulseRate} ${item?.tetanusDose1}`}</div>
                        <a href={item.physicalFitnessFormUrl}>
                            <div key={index}>{item.physicalFitnessFormUrl}</div>
                        </a>
                        <br />
                    </div>
                ))}
            </div>

            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <GeAeroSpacePhyscialFitnessTemplate
                    data={list[0]}
                />
            </PDFViewer>
        </Fragment>
    );
};

export default GeAeroSpacePhyscialFitnessMain


const dataForEyeRemark = [
    {
        "empId": 270010329,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143730,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212686255,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096433,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139423,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008630,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065585,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065585,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065585,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140374,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042665,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 570014608,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009281,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140032,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012806,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009209,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223041299,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005835,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270014565,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212590276,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145890,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011468,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223080518,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223071399,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212637159,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085645,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142777,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007361,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 105064278,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223139787,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146900,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270012775,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009043,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212686446,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089415,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009025,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007637,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003762,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223078993,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139361,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212438792,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006783,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006787,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006899,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008998,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009069,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010243,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010750,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008953,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008953,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416402,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147140,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006696,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007696,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010282,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270000553,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212707663,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084422,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008934,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146892,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223111993,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007399,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142799,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223063470,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714266,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147563,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005737,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212466280,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010312,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089412,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080480,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005612,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015648,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008189,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005530,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005789,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223146887,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270008415,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223040941,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006216,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140532,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223139894,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010399,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089724,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082187,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002620,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212690034,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223126537,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009014,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223018427,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007077,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146906,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049227,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223102704,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212439227,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223016030,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223043659,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119214,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006192,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212800582,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212680555,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140635,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212488237,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212481319,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002210,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223129079,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223127711,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212726062,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223127170,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066420,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212715934,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270007353,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009056,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006385,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608889,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212740634,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270007166,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223016026,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212707635,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608892,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006169,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223090389,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145185,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674956,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010059,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223125761,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212734269,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002649,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223069458,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546578,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005760,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147137,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011990,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045395,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011923,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010026,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714370,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045400,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021902,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223142728,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212744720,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684524,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570001236,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005940,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147135,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008863,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142362,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223143826,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113277,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212340052,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780019,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142744,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212488238,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005592,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212577004,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223146538,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212686449,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223121604,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223094866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684246,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741301,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085699,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005773,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212604153,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116043,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212483390,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007392,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010791,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503378660,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113350,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212708682,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011229,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004532,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006784,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100705,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143824,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005813,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002662,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223144975,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006658,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009057,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009266,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009738,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000222,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223070664,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223148430,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083800,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546568,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754694,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006188,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212673829,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004108,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223133162,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270015024,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147527,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007659,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223104132,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006852,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011994,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212588930,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212724596,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065525,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223024316,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212606113,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212733984,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223128419,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212349348,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212357041,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212390638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212758643,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223131682,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142378,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212366887,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750515,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212630223,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212466277,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116862,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223090394,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223137336,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223071396,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044160,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086931,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005925,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212688559,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005676,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005796,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140759,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270013632,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084575,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012805,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223072533,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212399078,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212731541,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223043664,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010439,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000554,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223150551,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546564,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212670325,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223087492,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212584711,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684232,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123614,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145251,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223047609,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223121677,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096573,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223079653,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139078,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012283,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011249,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212552465,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223045388,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006212,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010790,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139940,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223108653,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045386,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010496,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006618,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006856,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116055,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223069456,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145054,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007164,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012807,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147556,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006509,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005549,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147156,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006506,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009026,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009101,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011277,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011436,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012274,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005901,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013274,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142737,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223148208,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005808,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270014714,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040918,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212731382,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212592357,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008900,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142754,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212678103,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212450091,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006661,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088931,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212336573,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005797,
        "eyeRemark": "Left-C.F.C."
    },
    {
        "empId": 270012298,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714339,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416403,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006650,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000221,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010493,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270011818,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754427,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007113,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086456,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212720746,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212456743,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082105,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546571,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223150577,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006551,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270008940,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014090,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684236,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223135296,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122082,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006760,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212752934,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212715797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212682978,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223073875,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139794,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000187,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270007743,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212685063,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270002615,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006241,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015045,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140877,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144592,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005754,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212699251,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223104486,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223130227,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212732105,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212604154,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270007738,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223079025,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212502895,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270011179,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212478266,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118774,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223109927,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212719193,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212604155,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212488245,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212742814,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212334974,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270007123,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005710,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010193,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223070667,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223118102,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223148228,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006647,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015050,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010416,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140089,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142851,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212483389,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212706744,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212581766,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 503158300,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589938,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212637613,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004118,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127719,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089792,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212675675,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212686205,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212399072,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006816,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006869,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006869,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006869,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011077,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212786001,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132940,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223016029,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741322,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223042671,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212478270,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212705886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007543,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212585915,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013560,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212587853,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212714380,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008558,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 105057356,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003404,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008980,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143106,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144965,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009303,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006823,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006812,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003075,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009294,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223090396,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147698,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085667,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223073874,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086524,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007544,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113435,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212707005,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212669672,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143116,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223145030,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223053086,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270008549,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 105058838,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212457130,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139654,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088897,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750514,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066081,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212481318,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013726,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212778418,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084592,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009074,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212699072,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139400,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006740,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223138826,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122092,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086871,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212420965,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144598,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212488244,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212771444,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741328,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212601103,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123334,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007795,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147011,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212591337,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223130157,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006643,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006666,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011461,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212434653,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223096574,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674939,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223059386,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080914,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270003876,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716798,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011891,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223043638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147127,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122892,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140393,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010928,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006763,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127721,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212436435,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212630193,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212356845,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145882,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684531,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100074,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047943,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010795,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042662,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212637067,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141274,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006841,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212588918,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212585908,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006879,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223133703,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212592842,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008555,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005839,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003975,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741305,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010628,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674202,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009070,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503087570,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145033,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546560,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066087,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014535,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223138408,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014136,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212715937,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212690035,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223044643,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008988,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008067,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007377,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780068,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009677,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001131,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118182,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021879,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047621,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119463,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004530,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147167,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088130,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684860,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212585925,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503428763,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005859,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139647,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010238,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009468,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142875,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223092354,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212601101,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714367,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212471610,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212761404,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212436882,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755370,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212545170,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750506,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083491,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212629829,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212781862,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212362438,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004201,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223129081,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012302,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223078982,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780029,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223085788,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005928,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113318,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003870,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212362335,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212573886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223135231,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140874,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223067090,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011002,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006703,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212770942,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212758660,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116486,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009288,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139973,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006870,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212417208,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212678101,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212702047,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006206,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212581767,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223087470,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212797681,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212797681,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009292,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011830,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096435,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223079063,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223016341,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006830,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212740719,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005776,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223131249,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012303,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223125905,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021900,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113382,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080204,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223047604,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120460,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012261,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139451,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010454,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009634,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212686510,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009498,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143071,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088249,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142723,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142640,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009103,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212777457,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223147799,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143270,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143779,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589959,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143109,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570013742,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005766,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212481314,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006861,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741302,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007866,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 570011407,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007754,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040960,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011809,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005542,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212441296,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005868,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139161,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011856,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001038,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212690033,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116643,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212778432,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223148731,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006885,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114835,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223104125,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047603,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113691,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223145505,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212328482,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270012777,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223101753,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083065,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008972,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007856,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012770,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684216,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007344,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212564582,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119783,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212761399,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008139,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223018443,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212722358,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012836,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001153,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212670404,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212702043,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684521,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007069,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082801,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010516,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049225,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011005,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009672,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270000550,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212592450,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270004317,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223143220,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010061,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006839,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009617,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005521,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120564,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009356,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212760292,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011977,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140354,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005621,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212719186,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008822,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212748582,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115260,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146525,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212478269,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009002,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212360808,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223087243,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212453656,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212785369,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212307313,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212483388,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223052906,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116014,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144609,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 307007520,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009010,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004315,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014563,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007343,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005801,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047605,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049236,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212591349,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116961,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143416,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212719198,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005906,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139619,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005921,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223131111,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212747496,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009604,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012172,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212746989,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139466,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009196,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140346,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009256,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223015845,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212702046,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212706381,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009029,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212765882,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212785368,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007546,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139166,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212396957,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042483,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065581,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212785374,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223125832,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008472,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212349222,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212586484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212586484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212770295,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139159,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223136074,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223145533,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006162,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212542669,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047623,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143734,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117898,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084570,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212688391,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716805,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212728016,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223022374,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212390634,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212436108,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212471431,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139489,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139438,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570012952,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009720,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042164,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001082,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140050,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009669,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011283,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011832,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008880,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146548,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223126436,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009430,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146901,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212758013,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 305019059,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223140867,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002372,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570009215,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223074561,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212357034,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212489228,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140499,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212598043,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212568351,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114121,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005708,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005708,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212734132,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007414,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012804,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212775529,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040938,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416421,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570014115,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015199,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007015,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008147,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009312,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008138,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004258,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042155,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142984,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006687,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223099458,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006818,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005629,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142785,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143108,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010056,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000258,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212668799,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223017810,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127023,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012834,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009311,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080184,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139458,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114815,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270005696,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082460,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270001135,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212425005,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212578091,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223082189,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082791,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014251,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009111,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010194,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009005,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009023,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143921,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223019414,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143113,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013642,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096470,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142821,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005663,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212545169,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086961,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212758462,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008520,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002834,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014087,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270013278,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750435,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212594351,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009583,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223016339,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212437072,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212629833,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007645,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212633162,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212348845,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223085658,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212417202,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140028,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119964,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120504,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714344,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008897,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008566,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212770300,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223142912,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139356,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212468027,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008535,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013725,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013725,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013725,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212688556,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005601,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223099472,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570017091,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142791,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119755,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008476,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100712,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113439,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223060710,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009301,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005687,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212705906,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009136,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223135593,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008907,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223123331,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212680553,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117212,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010265,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007672,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011507,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049251,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007702,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212558125,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223148225,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006049,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223036407,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044619,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223020367,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212775511,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010451,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007149,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147087,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212391576,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212750989,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212608883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044195,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212436109,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212339443,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223069766,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006553,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007023,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010255,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006681,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141318,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008541,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270015040,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014252,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009041,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143753,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212724341,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212684240,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085670,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009659,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006731,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146988,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147165,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008957,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139855,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040917,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049594,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223140381,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223129084,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212694997,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223102494,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223148728,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223022376,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223125866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139891,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116946,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012773,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007422,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212598046,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546561,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212711285,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212481321,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212684529,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009637,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005911,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223018966,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212720745,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754715,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212697645,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212611929,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223086556,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212714275,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132533,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223074366,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011503,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212399071,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212678099,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007780,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009668,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009462,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212585912,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139819,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082916,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714333,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118135,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085877,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223052267,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212774596,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004246,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212712218,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223065531,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212668804,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005864,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139082,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780081,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212773591,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570004600,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716388,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085680,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040937,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223124890,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006745,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212588922,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003594,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082510,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040920,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147020,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009550,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212670414,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212690037,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120090,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212584720,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040991,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223020369,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223078984,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003684,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212670412,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140432,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007550,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004178,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011607,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589957,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212702028,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212778462,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013537,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000196,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212545178,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006240,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119749,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042163,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212629824,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007610,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223122947,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140747,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503412596,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212598045,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040912,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145843,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223131695,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006231,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212754739,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223143286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608890,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007690,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139511,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120546,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212715801,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223023036,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122882,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212710582,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223145259,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013915,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007737,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212688555,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212785371,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009071,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009277,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223082217,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212591347,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006880,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223018448,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080605,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006222,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223097443,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122368,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085879,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047607,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212546567,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082535,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223023030,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212475747,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140581,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123611,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008904,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223052903,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212581759,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141288,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223148210,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142124,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100080,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212785365,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010930,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212393008,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212393008,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212462901,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212357032,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212588916,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006952,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116028,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223023035,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212425006,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684218,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144602,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088846,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223022375,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011784,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006893,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212709940,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006536,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140118,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270011288,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212483398,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113327,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014691,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014691,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212778467,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223140640,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223042174,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223078977,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223133866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684230,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146898,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212673862,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608884,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008945,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004254,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009048,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120590,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212684241,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741291,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223094868,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223106171,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120584,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009317,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116641,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011090,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212327365,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270012207,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013595,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212489230,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002810,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 502747467,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010914,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120925,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223121668,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212682760,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223133381,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147614,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006680,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007094,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009184,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085880,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045407,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084937,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123104,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608887,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416407,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212416407,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212416407,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212416407,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223071282,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223135113,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086558,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212318889,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002211,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223090401,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223138326,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223128411,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008961,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270012776,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011917,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223140595,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212549282,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212594785,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212398989,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010765,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009664,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684525,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080198,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085774,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086897,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147147,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004279,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147054,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006750,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140092,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011275,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142367,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143114,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212586482,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139823,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139381,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212692128,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223080596,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086975,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096654,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212364786,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223088063,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212549285,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212706330,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044165,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212669671,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212396958,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212593400,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212585917,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684528,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503092825,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212694998,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212597154,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015646,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270016672,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011009,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223058507,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223070669,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147150,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008025,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006064,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212550325,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212359370,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045399,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004528,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004531,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223125828,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270009220,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010226,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005793,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001132,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212722355,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212752900,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005919,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223120565,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006782,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223125874,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003819,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223044650,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007512,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008591,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009206,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716673,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139907,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145913,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001312,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143563,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083275,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570002629,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008046,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118170,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008145,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005853,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007139,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140580,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000868,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503305516,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001361,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008418,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780062,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212630355,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084941,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044648,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223072124,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141749,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146873,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270008137,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008148,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005908,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132190,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006148,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008891,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082537,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503403970,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006888,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212726040,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223150636,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503429408,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212700548,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212739992,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212425011,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144670,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006132,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212702031,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118137,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115215,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044156,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140387,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714265,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714265,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212706374,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212678089,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212334966,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223131112,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066421,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212734791,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212390637,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212610383,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 105051848,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 105057009,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212735413,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270011419,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085791,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755906,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684217,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212391577,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212629832,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003285,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212478267,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141302,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212778468,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005691,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021893,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212604150,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212478263,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006155,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212727230,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066076,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212687539,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503328666,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212398256,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212678098,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212629828,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011494,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684050,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780475,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005722,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141312,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223045410,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115628,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004248,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139608,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270000199,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223085441,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212781866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139248,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223142652,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223130948,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089424,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716706,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223079086,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044214,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113368,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010907,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009359,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212585923,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212726043,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212455379,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008978,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212399947,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714357,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212756028,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212747166,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223045384,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118097,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212449520,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223113314,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005785,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127485,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223096658,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047601,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223086559,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270011215,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212634006,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089504,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212630567,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223081498,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096103,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223099484,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009044,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013892,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010753,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684530,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088305,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082102,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416408,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212390636,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009723,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714278,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132752,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212409712,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006299,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741333,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212709900,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589031,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006777,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005890,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212705905,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007669,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212750511,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212720169,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122946,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011139,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010281,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012199,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096442,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223137328,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212366393,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570002466,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212475746,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212360347,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684231,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223072521,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223123350,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143386,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223132482,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015328,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009128,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780025,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007595,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009296,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012234,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088853,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127413,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212425051,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503237834,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503355030,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750512,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212390633,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006223,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009123,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754702,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088351,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212589941,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096619,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270001652,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223118782,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223102442,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223062604,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015200,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140700,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270005912,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008601,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003881,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212483393,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009011,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011126,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212673855,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009728,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212720744,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270011909,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223147154,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008568,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212693636,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007791,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004244,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004250,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270009459,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270016783,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212549286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007661,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015647,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013587,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140519,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212601102,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212637157,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212719180,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212564404,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223124938,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223046619,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080194,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006227,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006066,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114818,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007748,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005603,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127672,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223079058,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212471429,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589026,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140428,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140508,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100395,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 302017797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754706,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011487,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132172,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010342,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223053720,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006684,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006183,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010912,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000322,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223108495,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212709910,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212450106,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212637069,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006228,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013571,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009135,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145918,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010173,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212692683,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212722350,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212325588,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127040,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223043639,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015904,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223100397,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212780009,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008518,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223049229,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080481,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223127036,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223131104,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714372,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755917,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223052263,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010525,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212713543,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212422323,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755899,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223050524,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212759982,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212716793,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223109508,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223121638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212778388,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223073199,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503046281,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212732123,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117475,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212573890,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223114836,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503349233,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141282,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139886,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684527,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009576,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212592762,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223111920,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212604151,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139923,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270007085,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212753050,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119995,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 570007830,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714341,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270010057,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223053723,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212770319,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140603,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012802,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140546,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005903,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223015867,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123121,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007041,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132624,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755881,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145063,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139544,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223116488,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004290,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139548,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223142880,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008982,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002627,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270010808,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212709617,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212691700,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223052266,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223040939,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006392,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223138202,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013512,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006629,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006855,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122054,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212777831,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083493,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012196,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009727,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003799,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212780055,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006037,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223125880,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008992,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003761,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007384,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005781,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117582,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212700498,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140916,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139454,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212598044,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120578,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009474,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212724087,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008985,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008985,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270008966,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212420391,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147050,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139910,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212788398,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223040929,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010460,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589953,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011197,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714537,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139877,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009548,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142814,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003451,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212673137,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 503299743,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003879,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009080,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750531,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009269,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754691,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223086074,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212368605,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223115241,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270016673,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223073863,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009031,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674934,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144968,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119787,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212694552,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212608882,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006825,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212588919,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006949,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145114,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223120607,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674203,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223023034,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212755914,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223075892,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004565,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212568352,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008994,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140547,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212633905,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212687536,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589964,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223145527,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006722,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270002671,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212399592,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684102,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144149,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015014,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006850,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223071398,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089125,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714277,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212684223,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212741316,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716346,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011834,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113274,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212758472,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212466290,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212780471,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014224,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223135237,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007613,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223119544,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223133890,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212747150,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223047942,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223080855,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223063573,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142844,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270014717,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212719191,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212391573,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223142648,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223044585,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084632,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146897,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223017618,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223021894,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012317,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212716683,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223043647,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212588912,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223117223,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223016037,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223136114,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142388,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115200,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089497,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223017060,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139373,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223125884,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142123,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004277,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223142896,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223099847,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044593,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009007,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010530,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212785367,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223149902,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223121835,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714390,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212587855,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212542660,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212586952,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223148823,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212489227,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012287,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270006883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006883,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147158,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147612,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212545162,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114722,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212595077,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223065635,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008191,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223120097,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212729874,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223139472,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212398255,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008596,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270010272,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589955,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140355,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754738,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212596098,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223044614,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013276,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223049234,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223060708,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088901,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270013638,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570014172,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212578866,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212398247,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223082997,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212584709,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223122939,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212719223,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223047606,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223073871,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143546,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 503437847,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223079039,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223042668,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223121583,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223088080,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008146,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014219,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223116480,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212362436,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212592845,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223084392,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223088128,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147595,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139245,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139495,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139965,
        "eyeRemark": ""
    },
    {
        "empId": 223093754,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223080608,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 270005556,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010286,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270014137,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223144135,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223129125,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212711845,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089729,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223147028,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212468026,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212586485,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 223115624,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223114315,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212719196,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212739974,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006488,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223099064,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223099064,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212466288,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212589958,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223089405,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141719,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223145494,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009015,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270010212,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212395858,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212780078,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083784,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223140052,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006752,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006806,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212758463,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223083788,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096100,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115076,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212758464,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011843,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212779429,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006541,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117163,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008037,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212629830,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714321,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212459948,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223146872,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005671,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270015737,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212687534,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045394,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096628,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212674949,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139797,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009117,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212744729,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212577009,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223123393,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007111,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044647,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223113310,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212602948,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005686,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223143788,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 105050235,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223141314,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223024317,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212680159,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212545181,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212364510,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009322,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009652,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212747219,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007327,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212669150,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212669150,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714141,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212404103,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005892,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223065592,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212581754,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270000938,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270004139,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570000476,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005807,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007347,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223045387,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096329,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223044192,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223066077,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223089420,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223132526,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223147143,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223101689,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212569533,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009298,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270008090,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212734130,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223096488,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212395860,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212416434,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270005933,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270002655,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270003679,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270004183,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139413,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 270006209,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223115210,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006055,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270007142,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270006821,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270012803,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139123,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270005861,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223139065,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212727710,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212483392,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212750509,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212584719,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212754720,
        "eyeRemark": "Spec recommended with corrected vision"
    },
    {
        "empId": 212669637,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212714329,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212681959,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 212670420,
        "eyeRemark": "Normal with corrected vision"
    },
    {
        "empId": 223044623,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223098924,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212754699,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 212687538,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270009084,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 270011426,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 223117166,
        "eyeRemark": "Normal Vision"
    },
    {
        "empId": 570005864,
        "eyeRemark": "Normal Vision"
    }
]

const dataForPftRemark = [
    {
        "empId": 270010329,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143730,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212686255,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096433,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139423,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008630,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223065585,
        "remarkForPft": "NA"
    },
    {
        "empId": 223065585,
        "remarkForPft": "NA"
    },
    {
        "empId": 223065585,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140374,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223042665,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570014608,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009281,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140032,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012806,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009209,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223041299,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005835,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270014565,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212590276,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145890,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011468,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080518,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223071399,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212637159,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085645,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142777,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007361,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 105064278,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139787,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223146900,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012775,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009043,
        "remarkForPft": "NA"
    },
    {
        "empId": 212686446,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089415,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009025,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007637,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003762,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223078993,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139361,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212438792,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006783,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006787,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006899,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008998,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009069,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010243,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010750,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008953,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145883,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212416402,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147140,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006696,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007696,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010282,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000553,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212707663,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223084422,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008934,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146892,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223111993,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007399,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142799,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223063470,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714266,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147563,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005737,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212466280,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010312,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089412,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080480,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005612,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015648,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008189,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005530,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005789,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146887,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008415,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223040941,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006216,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140532,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139894,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010399,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223089724,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082187,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002620,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212690034,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223126537,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009014,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223018427,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007077,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146906,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223049227,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223102704,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096638,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212439227,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223016030,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223043659,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223119214,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006192,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212800582,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212680555,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140635,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212488237,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212481319,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002210,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223129079,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223127711,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212726062,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223127170,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223066420,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212715934,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007353,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009056,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006385,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212608889,
        "remarkForPft": "NA"
    },
    {
        "empId": 212740634,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007166,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223016026,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212707635,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212608892,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006169,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223090389,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145185,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212674956,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010059,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223125761,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212734269,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270002649,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223069458,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212546578,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005760,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147137,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011990,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045395,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011923,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010026,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212714370,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223045400,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223021902,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142728,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212744720,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684524,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570001236,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005940,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147135,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223021883,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008863,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212608886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142362,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143826,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223113277,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212340052,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780019,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142744,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212488238,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005592,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212577004,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223146538,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212686449,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223121604,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223094866,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684246,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212741301,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223085699,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005773,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212604153,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116043,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212483390,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007392,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010791,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503378660,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113350,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212708682,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011229,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270004532,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006784,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223100705,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143824,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005813,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270002662,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223144975,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006658,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009057,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009266,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009738,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000222,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223070664,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148430,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223083800,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212546568,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754694,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006188,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212673829,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004108,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223133162,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015024,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223147527,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007659,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223104132,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006852,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011994,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212588930,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212724596,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223065525,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223024316,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212606113,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212733984,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223128419,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212349348,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212357041,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212390638,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212758643,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223131682,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142378,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212366887,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212750515,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212630223,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212466277,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116862,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223090394,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223137336,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223071396,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044160,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223086931,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005925,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212688559,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005676,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005796,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140759,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013632,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223084575,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012805,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223072533,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212399078,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212731541,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223043664,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010439,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000554,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223150551,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212546564,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212670325,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223087492,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212584711,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684232,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123614,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145251,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047609,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223121677,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223096573,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223079653,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139078,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012283,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011249,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212552465,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045388,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006212,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010790,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139940,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223108653,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045386,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010496,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006618,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270006856,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116055,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223069456,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145054,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270007164,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012807,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147556,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006509,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005549,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223147156,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006506,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009026,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009101,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011277,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011436,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012274,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005901,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270013274,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142737,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223148208,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005808,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270014714,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040918,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212731382,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212592357,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008900,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142754,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212678103,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212450091,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006661,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223088931,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212336573,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005797,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012298,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212714339,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212416403,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006650,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270000221,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010493,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011818,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754427,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007113,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086456,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212720746,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212456743,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082105,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212546571,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223150577,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006551,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008940,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014090,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684236,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223135296,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223122082,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006760,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212752934,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212715797,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212682978,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223073875,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139794,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000187,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007743,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212685063,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002615,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006241,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015045,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140877,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223144592,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005754,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212699251,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223104486,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223130227,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212732105,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212604154,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007738,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223079025,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212502895,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011179,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212478266,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118774,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223109927,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212719193,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212604155,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212488245,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212742814,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212334974,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007123,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005710,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010193,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223070667,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118102,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148228,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006647,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006866,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009484,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015050,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010416,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140089,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142851,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212483389,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212706744,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212581766,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503158300,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589938,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212637613,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004118,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223127719,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089792,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212675675,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212686205,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212399072,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006816,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006869,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006869,
        "remarkForPft": "NA"
    },
    {
        "empId": 270006869,
        "remarkForPft": "NA"
    },
    {
        "empId": 270011077,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212786001,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223132940,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223016029,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212741322,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223042671,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212478270,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212705886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007543,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212585915,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270013560,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212587853,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714380,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008558,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 105057356,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003404,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008980,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143106,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144965,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009303,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006823,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006812,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146883,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003075,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009294,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223090396,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147698,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223085667,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223073874,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086524,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007544,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223113435,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212707005,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212669672,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143116,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145030,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223053086,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008549,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 105058838,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212457130,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139654,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088897,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212750514,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223066081,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212481318,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013726,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212778418,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223084592,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009074,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212699072,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139400,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006740,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223138826,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122092,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086871,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212420965,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144598,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212488244,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212771444,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212741328,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212601103,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123334,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007795,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147011,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212591337,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223130157,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006643,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006666,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011461,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212434653,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096574,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212674939,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223059386,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080914,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003876,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212716798,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011891,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223043638,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147127,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122892,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140393,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010928,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006763,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223127721,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212436435,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212630193,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212356845,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145882,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684531,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223100074,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047943,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010795,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223042662,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212637067,
        "remarkForPft": "NA"
    },
    {
        "empId": 223141274,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006841,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212588918,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212585908,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006879,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223133703,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212592842,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008555,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005839,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003975,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212741305,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010628,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212674202,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009070,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503087570,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223145033,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212546560,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223066087,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270014535,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223138408,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014136,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212715937,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212690035,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044643,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008988,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008067,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007377,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780068,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009677,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001131,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118182,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223021879,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047621,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223119463,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004530,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147167,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088130,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684860,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212585925,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503428763,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005859,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139647,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010238,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009468,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142875,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223092354,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212601101,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212714367,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212471610,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212761404,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212436882,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212755370,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212545170,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212750506,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083491,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212629829,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212781862,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212362438,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004201,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223129081,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012302,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223078982,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780029,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085788,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005928,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113318,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003870,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212362335,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212573886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223135231,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140874,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223067090,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011002,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006703,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212770942,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212758660,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223116486,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009288,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139973,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006870,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212417208,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212678101,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212702047,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083797,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006206,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212581767,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223087470,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212797681,
        "remarkForPft": "NA"
    },
    {
        "empId": 212797681,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009292,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011830,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096435,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223079063,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223016341,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006830,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212740719,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005776,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142803,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223131249,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012303,
        "remarkForPft": "SEVERE"
    },
    {
        "empId": 223125905,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223021900,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113382,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080204,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047604,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223120460,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270012261,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139451,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010454,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009634,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212686510,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009498,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143071,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223088249,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142723,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223142640,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009103,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212777457,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147799,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143270,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143779,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589959,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143109,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570013742,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005766,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212481314,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006861,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212741302,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007866,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570011407,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007754,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040960,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011809,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005542,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212441296,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005868,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139161,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011856,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270001038,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212690033,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116643,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212778432,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148731,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006885,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114835,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223104125,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223047603,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223113691,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145505,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212328482,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012777,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223101753,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083065,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008972,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007856,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012770,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684216,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007344,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212564582,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223119783,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212761399,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008139,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223018443,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212722358,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012836,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001153,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212670404,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212702043,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684521,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011803,
        "remarkForPft": "NA"
    },
    {
        "empId": 270011803,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007069,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082801,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010516,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223049225,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011005,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009672,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000550,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212592450,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270004317,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143220,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010061,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006839,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009617,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005521,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120564,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009356,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212760292,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011977,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140354,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005621,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212719186,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008822,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212748582,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223115260,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146525,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212478269,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009002,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212360808,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223087243,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212453656,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212785369,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212307313,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212483388,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223052906,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223116014,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144609,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 307007520,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009010,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004315,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014563,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007343,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005801,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047605,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223049236,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212591349,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223116961,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143416,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212719198,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005906,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139619,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005921,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223131111,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212747496,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009604,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012172,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212746989,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139466,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009196,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140346,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009256,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223015845,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212702046,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212706381,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009029,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212765882,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212785368,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007546,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139166,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212396957,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042483,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223065581,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212785374,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223125832,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008472,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212349222,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212586484,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212586484,
        "remarkForPft": "NA"
    },
    {
        "empId": 212770295,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139159,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223136074,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145533,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006162,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212542669,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047623,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143734,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223117898,
        "remarkForPft": "NA"
    },
    {
        "empId": 223084570,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212688391,
        "remarkForPft": "NA"
    },
    {
        "empId": 212716805,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212728016,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223022374,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212390634,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212436108,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212471431,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139489,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139438,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570012952,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009720,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042164,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270001082,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223140050,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009669,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011283,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011832,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008880,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146548,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223126436,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009430,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146901,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212758013,
        "remarkForPft": "MILD"
    },
    {
        "empId": 305019059,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140867,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002372,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570009215,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223074561,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212357034,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212489228,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140499,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212598043,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212568351,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114121,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005708,
        "remarkForPft": "NA"
    },
    {
        "empId": 270005708,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212734132,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007414,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012804,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212775529,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040938,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212416421,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570014115,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015199,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007015,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008147,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009312,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008138,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004258,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042155,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142984,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006687,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223099458,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006818,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005629,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142785,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143108,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010056,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270000258,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212668799,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223017810,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223127023,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012834,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009311,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080184,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139458,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114815,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005696,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082460,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001135,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212425005,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212578091,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082189,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082791,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014251,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009111,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010194,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009005,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009023,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143921,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223019414,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143113,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013642,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096470,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142821,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005663,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212545169,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086961,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212758462,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008520,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002834,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014087,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013278,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212750435,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212594351,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009583,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223016339,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212437072,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212629833,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007645,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212633162,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212348845,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085658,
        "remarkForPft": "NA"
    },
    {
        "empId": 212417202,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140028,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223119964,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120504,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714344,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008897,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008566,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212770300,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142912,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139356,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212468027,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008535,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270013725,
        "remarkForPft": "NA"
    },
    {
        "empId": 270013725,
        "remarkForPft": "NA"
    },
    {
        "empId": 270013725,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212688556,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005601,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223099472,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570017091,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142791,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223119755,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007797,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008476,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223100712,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113439,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223060710,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009301,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005687,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212705906,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009136,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223135593,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008907,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123331,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212680553,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085803,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223117212,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010265,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007672,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011507,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223049251,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007702,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212558125,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148225,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006049,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223036407,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223044619,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223020367,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212775511,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010451,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007149,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147087,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212391576,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212750989,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212608883,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223044195,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009286,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212436109,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212339443,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223069766,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006553,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007023,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010255,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006681,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141318,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008541,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015040,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270014252,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009041,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143753,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212724341,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684240,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085670,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009659,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006731,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146988,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147165,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008957,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139855,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223040917,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223049594,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140381,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223129084,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212694997,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223102494,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083048,
        "remarkForPft": "NA"
    },
    {
        "empId": 223083048,
        "remarkForPft": "NA"
    },
    {
        "empId": 223083048,
        "remarkForPft": "NA"
    },
    {
        "empId": 223083048,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083048,
        "remarkForPft": "NA"
    },
    {
        "empId": 223148728,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223022376,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223125866,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001286,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139891,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116946,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012773,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007422,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212598046,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212546561,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212711285,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212481321,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684529,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009637,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005911,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080484,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223018966,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212720745,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754715,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212697645,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212611929,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223086556,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714275,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223132533,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223074366,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011503,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212399071,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212678099,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007780,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009668,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009462,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212585912,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139819,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082916,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714333,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118135,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085877,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223052267,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212774596,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270004246,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212712218,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223065531,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212668804,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005864,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139082,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212780081,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212773591,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570004600,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212716388,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085680,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040937,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223124890,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006745,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212588922,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003594,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082510,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223040920,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147020,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009550,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212670414,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212690037,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120090,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212584720,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040991,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223020369,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223078984,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003684,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212670412,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140432,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007550,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004178,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011607,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589957,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212702028,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212778462,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013537,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000196,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212545178,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006240,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223119749,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042163,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212629824,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007610,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223122947,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140747,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503412596,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212598045,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040912,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145843,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223131695,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006231,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754739,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143286,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212608890,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007690,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139511,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120546,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212715801,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223023036,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122882,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212710582,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145259,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013915,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007737,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212688555,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212785371,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009071,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009277,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082217,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212591347,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006880,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223018448,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080605,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006222,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223097443,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223122368,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085879,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223047607,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212546567,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082535,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223023030,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212475747,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140581,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223123611,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008904,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223052903,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212581759,
        "remarkForPft": "NA"
    },
    {
        "empId": 223141288,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148210,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142124,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223100080,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212785365,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010930,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212393008,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212393008,
        "remarkForPft": "NA"
    },
    {
        "empId": 212462901,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212357032,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212588916,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006952,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223116028,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223023035,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212425006,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684218,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144602,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088846,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223022375,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011784,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006893,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212709940,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006536,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140118,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011288,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212483398,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113327,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014691,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270014691,
        "remarkForPft": "NA"
    },
    {
        "empId": 212778467,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140640,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042174,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223078977,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223133866,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684230,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223146898,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212673862,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212608884,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008945,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004254,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009048,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223120590,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684241,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212741291,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223094868,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223106171,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223120584,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009317,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116641,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011090,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212327365,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012207,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270013595,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212489230,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270002810,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 502747467,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010914,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223120925,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223121668,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212682760,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223133381,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147614,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006680,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007094,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009184,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223085880,
        "remarkForPft": "SEVERE"
    },
    {
        "empId": 223045407,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223084937,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123104,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212608887,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212416407,
        "remarkForPft": "NA"
    },
    {
        "empId": 212416407,
        "remarkForPft": "NA"
    },
    {
        "empId": 212416407,
        "remarkForPft": "NA"
    },
    {
        "empId": 212416407,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223071282,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223135113,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223086558,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212318889,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270002211,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223090401,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223138326,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223128411,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008961,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012776,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011917,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223140595,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212549282,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212594785,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212398989,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010765,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009664,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684525,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080198,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085774,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086897,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147147,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004279,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147054,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006750,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140092,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011275,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223142367,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143114,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212586482,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139823,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139381,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212692128,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080596,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223086975,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223096654,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212364786,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223088063,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212549285,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212706330,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044165,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212669671,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212396958,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212593400,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212585917,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684528,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503092825,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212694998,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212597154,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015646,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270016672,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011009,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223058507,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223070669,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147150,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008025,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006064,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212550325,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212359370,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045399,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270004528,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004531,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223125828,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009220,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010226,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005793,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270001132,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212722355,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212752900,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005919,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120565,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006782,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223125874,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003819,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044650,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011797,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007512,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008591,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009206,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212716673,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139907,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145913,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001312,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143563,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223083275,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570002629,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008046,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223118170,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008145,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005853,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007139,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140580,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000868,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503305516,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001361,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008418,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780062,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212630355,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223084941,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044648,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223072124,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141749,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223146873,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008137,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270008148,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005908,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223132190,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006148,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008891,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082537,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503403970,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006888,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212726040,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223150636,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503429408,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212700548,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212739992,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212425011,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144670,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006132,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212702031,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118137,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223115215,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044156,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140387,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212714265,
        "remarkForPft": "NA"
    },
    {
        "empId": 212714265,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082484,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212706374,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212678089,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212334966,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223131112,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223066421,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212734791,
        "remarkForPft": "NA"
    },
    {
        "empId": 212390637,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212610383,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 105051848,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 105057009,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212735413,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011419,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085791,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212755906,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212684217,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212391577,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212629832,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003285,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212478267,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141302,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212778468,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005691,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223021893,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212604150,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212478263,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006155,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212727230,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223066076,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212687539,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503328666,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212398256,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212678098,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212629828,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011494,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684050,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780475,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005722,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141312,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045410,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223115628,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004248,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139608,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270000199,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223085441,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212781866,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139248,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142652,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223130948,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089424,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212716706,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223079086,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044214,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113368,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010907,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009359,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212585923,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212726043,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212455379,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008978,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212399947,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212714357,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212756028,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212747166,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045384,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223118097,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212449520,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113314,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005785,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223127485,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096658,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223047601,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223086559,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011215,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212634006,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089504,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212630567,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223081498,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096103,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223099484,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009044,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013892,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010753,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212684530,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088305,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223082102,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212416408,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212390636,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009723,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714278,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223132752,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212409712,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006299,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212741333,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212709900,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212589031,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006777,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012286,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005890,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212705905,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007669,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212750511,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212720169,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122946,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011139,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010281,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012199,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096442,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223137328,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212366393,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570002466,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212475746,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212360347,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684231,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223072521,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123350,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143386,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223132482,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015328,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009128,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212780025,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007595,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009296,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012234,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223088853,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223127413,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212425051,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503237834,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503355030,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212750512,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212390633,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006223,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009123,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212754702,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088351,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589941,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096619,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270001652,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223118782,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223102442,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223062604,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015200,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223140700,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005912,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008601,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003881,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212483393,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009011,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011126,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212673855,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009728,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212720744,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011909,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147154,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008568,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212693636,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270007791,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004244,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004250,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009459,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270016783,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212549286,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007661,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015647,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270013587,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140519,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212601102,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212637157,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212719180,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212564404,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223124938,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223046619,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080194,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006227,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006066,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114818,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007748,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005603,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223127672,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223079058,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212471429,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212589026,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140428,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140508,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223100395,
        "remarkForPft": "MILD"
    },
    {
        "empId": 302017797,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212754706,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011487,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223132172,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010342,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223053720,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006684,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006183,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010912,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270000322,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223108495,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212709910,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212450106,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212637069,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270006228,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013571,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009135,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145918,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010173,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212692683,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007638,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212722350,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212325588,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223127040,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223043639,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270015904,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223100397,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780009,
        "remarkForPft": "NA"
    },
    {
        "empId": 270008518,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223049229,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080481,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223127036,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223131104,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714372,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212755917,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223052263,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010525,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212713543,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212422323,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212755899,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223050524,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212759982,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212716793,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223109508,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223121638,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212778388,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223073199,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503046281,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212732123,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223117475,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212573890,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114836,
        "remarkForPft": "MILD"
    },
    {
        "empId": 503349233,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 223141282,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139886,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684527,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009576,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212592762,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223111920,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212604151,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139923,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007085,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212753050,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223119995,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570007830,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714341,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010057,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223053723,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212770319,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140603,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012802,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140546,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005903,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223015867,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123121,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007041,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223132624,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212755881,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145063,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139544,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223116488,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004290,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139548,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142880,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008982,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270002627,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010808,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212709617,
        "remarkForPft": "NA"
    },
    {
        "empId": 212691700,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223052266,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040939,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006392,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223138202,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013512,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006629,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006855,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223122054,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212777831,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223083493,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012196,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009727,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270003799,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780055,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006037,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223125880,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008992,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003761,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007384,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005781,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223117582,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212700498,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140916,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139454,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212598044,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120578,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009474,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212724087,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008985,
        "remarkForPft": "NA"
    },
    {
        "empId": 270008985,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008966,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212420391,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147050,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139910,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212788398,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223040929,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010460,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589953,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270011197,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714537,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139877,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009548,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142814,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003451,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212673137,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 503299743,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003879,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009080,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212750531,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009269,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754691,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223086074,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212368605,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223115241,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270016673,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223073863,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009031,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212674934,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223144968,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223119787,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212694552,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212608882,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006825,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212588919,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006949,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145114,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223120607,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212674203,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223023034,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212755914,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223075892,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004565,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212568352,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008994,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223140547,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212633905,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212687536,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589964,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223145527,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006722,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002671,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212399592,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684102,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223144149,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015014,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006850,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223071398,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223089125,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714277,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212684223,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212741316,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212716346,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011834,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223113274,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212758472,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212466290,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212780471,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014224,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223135237,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007613,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223119544,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223133890,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212747150,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223047942,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223080855,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223063573,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142844,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014717,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212719191,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212391573,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142648,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044585,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223084632,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223146897,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223017618,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223021894,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012317,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212716683,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223043647,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212588912,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223117223,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223016037,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223136114,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142388,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223115200,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223089497,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223017060,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139373,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223125884,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223142123,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004277,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223142896,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223099847,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223044593,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009007,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010530,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212785367,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223149902,
        "remarkForPft": "NA"
    },
    {
        "empId": 223121835,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212714390,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212587855,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212542660,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212586952,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223148823,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212489227,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270012287,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006883,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006883,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147158,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223147612,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212545162,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223114722,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212595077,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223065635,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008191,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223120097,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212729874,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139472,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212398255,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008596,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270010272,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212589955,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140355,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212754738,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212596098,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044614,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013276,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223049234,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223060708,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223088901,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270013638,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570014172,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212578866,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212398247,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223082997,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212584709,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223122939,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212719223,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223047606,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223073871,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223143546,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 503437847,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223079039,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223042668,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223121583,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088080,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270008146,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270014219,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223116480,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212362436,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212592845,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223084392,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223088128,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147595,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139245,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139495,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139965,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223093754,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223080608,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005556,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010286,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270014137,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223144135,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223129125,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212711845,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223089729,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147028,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212468026,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212586485,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223115624,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223114315,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212719196,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212739974,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006488,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223099064,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223099064,
        "remarkForPft": "NA"
    },
    {
        "empId": 212466288,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212589958,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089405,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141719,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223145494,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270009015,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270010212,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212395858,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212780078,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223083784,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223140052,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006752,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006806,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212758463,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223083788,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096100,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223115076,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212758464,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011843,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212779429,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006541,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223117163,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008037,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212629830,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 212714321,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212459948,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223146872,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005671,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270015737,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212687534,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045394,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223096628,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212674949,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139797,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009117,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212744729,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212577009,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223123393,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007111,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044647,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223113310,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212602948,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005686,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223143788,
        "remarkForPft": "MILD"
    },
    {
        "empId": 105050235,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223141314,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223024317,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212680159,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212545181,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212364510,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009322,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270009652,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212747219,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270007327,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212669150,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212669150,
        "remarkForPft": "NA"
    },
    {
        "empId": 212714141,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212404103,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005892,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223065592,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212581754,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270000938,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270004139,
        "remarkForPft": "MILD"
    },
    {
        "empId": 570000476,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270005807,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007347,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223045387,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096329,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044192,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223066077,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223089420,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223132526,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223147143,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006803,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223101689,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212569533,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270009298,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270008090,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212734130,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223096488,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212395860,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212416434,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005933,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270002655,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270003679,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270004183,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139413,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270006209,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223115210,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006055,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270007142,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270006821,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270012803,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223139123,
        "remarkForPft": "MILD"
    },
    {
        "empId": 270005861,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223139065,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212727710,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212483392,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212750509,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212584719,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212754720,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212669637,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212714329,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 212681959,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212670420,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223044623,
        "remarkForPft": "MILD"
    },
    {
        "empId": 223098924,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212754699,
        "remarkForPft": "MILD"
    },
    {
        "empId": 212687538,
        "remarkForPft": "MODERATE"
    },
    {
        "empId": 270009084,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 270011426,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 223117166,
        "remarkForPft": "NORMAL"
    },
    {
        "empId": 570005864,
        "remarkForPft": "NORMAL"
    }
]