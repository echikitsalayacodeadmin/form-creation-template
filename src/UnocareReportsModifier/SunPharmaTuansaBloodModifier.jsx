import { useSnackbar } from "notistack";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";



const SunPharmaTuansaBloodModifier = ({
    corpId = "287a23b6-be28-4dbe-aae7-bcf3cd8badd8",
    campCycleId = "383208",
    fileType = "BLOODTEST",
}) => {
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const addBloodSugarRandomInReport = async (employee) => {
        if (!employee?.bloodTestUrl || !employee?.rbsValue) return;

        try {
            const existingPdfBytes = await fetch(employee.bloodTestUrl).then((res) =>
                res.arrayBuffer()
            );

            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            // 🔥 STEP 1: REMOVE QR + TEXT FROM ALL PAGES
            const pages = pdfDoc.getPages();

            pages.forEach((page) => {
                page.drawRectangle({
                    x: 37,
                    y: 102,
                    width: 50,
                    height: 43,
                    color: rgb(0.94, 0.99, 1), // white
                });
            });
            pages.forEach((page) => {
                page.drawRectangle({
                    x: 30,
                    y: 87,
                    width: 80,
                    height: 10,
                    color: rgb(0.94, 0.99, 1), // white
                });
            });

            // Fonts
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

            // 👉 STEP 2: ADD BLOOD SUGAR ON PAGE 2
            const page2 = pdfDoc.getPage(1);
            const { height } = page2.getSize();

            const labelX = 33;
            const valueX = 210;
            const valueX1 = 300;
            const valueX2 = 355;

            const y = height - 385;

            // Label
            page2.drawText("Glucose, Random (R)", {
                x: labelX,
                y: y,
                size: 8,
                color: rgb(0, 0, 0),
            });

            // Method
            page2.drawText("Method: GOD-POD", {
                x: labelX,
                y: y - 8,
                size: 7,
                font: italicFont,
                color: rgb(0.2, 0.2, 0.2),
            });

            // Value
            page2.drawText(`${employee?.rbsValue}`, {
                x: valueX,
                y: y,
                size: 8,
                color: rgb(0, 0, 0),
            });

            // Unit
            page2.drawText("mg/dL", {
                x: valueX1,
                y: y,
                size: 8,
                color: rgb(0, 0, 0),
            });

            // Reference range
            page2.drawText("60 - 200", {
                x: valueX2,
                y: y,
                size: 8,
                color: rgb(0, 0, 0),
            });

            // Save
            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

            // const previewUrl = URL.createObjectURL(pdfBlob);
            // window.open(previewUrl, "_blank");

            const formData = new FormData();
            formData.append(
                "file",
                pdfBlob,
                `${employee?.bloodTestUrl?.split("/").pop() || "Report"}.pdf`
            );

            const url = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${"TMT"}&corpId=${corpId}&campCycleId=${campCycleId}`;

            const result = await uploadFile(url, formData);

            if (result?.data) {
                enqueueSnackbar("Uploaded", { variant: "success" });
                setUploadedCount((prev) => prev + 1);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                enqueueSnackbar("Upload failed", { variant: "error" });
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error processing PDF", { variant: "error" });
        }
    };

    // Fetch the list of employees
    const fetchListOfEmployees = async () => {
        try {
            const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await getData(url);
            if (result && result.data) {

                const temp = result?.data
                    ?.filter((val) => ["8362", "8919", "M-715", "612"].includes(val?.empId) && val?.bloodTestUrl)
                    ?.map((item) => {
                        const rbsItem = rbsData?.find(
                            (it) => String(it.empId).trim() === String(item?.empId).trim()
                        );

                        return {
                            ...item,
                            rbsValue: rbsItem?.rbs ?? null,
                        };
                    });

                setList(sortDataByName(temp));
                setTotalEmployees(temp.length);
            } else {
                console.log("An error occurred while fetching data");
            }
        } catch (error) {
            console.error("Error fetching employee list:", error);
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, []);

    const processNextEmployee = async () => {
        const batchSize = list.length;
        const end = Math.min(currentIndex + batchSize, list.length);

        for (let i = currentIndex; i < end; i++) {
            await addBloodSugarRandomInReport(list[i]);
        }
        setCurrentIndex(end);
        if (end >= list.length) {
            enqueueSnackbar("All employees processed!", { variant: "success" });
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i++) {
            await deleteFiles(list[i]);
        }
    };

    const deleteFiles = async (data) => {
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?empId=${data?.empId}&toDeletefiletype=${fileType}&corpId=${corpId}`;
        const result = await updateData(url);
        if (result && result.data) {
            enqueueSnackbar("Successfully Deleted PDF!", {
                variant: "success",
            });
            setUploadedCount((prevCount) => prevCount + 1);
        } else {
            enqueueSnackbar("An error Occurred!", {
                variant: "error",
            });
        }
    };


    console.log({ list })

    return (
        <div>
            <button onClick={processNextEmployee}>Process Employees</button>
            <button onClick={handleDeletePDF}>Delete files</button>
            <div>Total Employees: {totalEmployees}</div> <br />
            <div>Uploaded Files: {uploadedCount}</div> <br />
            {/* {list?.filter((item) => !item?.rbsValue)?.map((item) => item.empId).join(",")} */}
            {list.map((item, index) => (
                <div key={index} style={{ display: "flex", marginBottom: 1, borderBottom: '1px solid #0000' }}>
                    <div>
                        {item.empId} <br /> {item.name}<br />  rbsValue:<br /> <span style={{ color: item?.rbsValue ? 'green' : 'red' }}> {item?.rbsValue || "NA"}</span>
                    </div>
                    <a href={item.tmtUrl}>
                        <div>{item.tmtUrl || "No TMT Report File"}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default SunPharmaTuansaBloodModifier;



const rbsData = [
    {
        "empId": 8496,
        "rbs": 160
    },
    {
        "empId": 399660,
        "rbs": 119.7
    },
    {
        "empId": 939,
        "rbs": 81.7
    },
    {
        "empId": 77053,
        "rbs": 154.3
    },
    {
        "empId": 18771,
        "rbs": 106
    },
    {
        "empId": 759,
        "rbs": 148.7
    },
    {
        "empId": 573,
        "rbs": 88
    },
    {
        "empId": 14145,
        "rbs": 102.1
    },
    {
        "empId": 8878,
        "rbs": 108.5
    },
    {
        "empId": 9036,
        "rbs": 155.8
    },
    {
        "empId": 86477,
        "rbs": 153.4
    },
    {
        "empId": 8988,
        "rbs": 110
    },
    {
        "empId": 91454,
        "rbs": 110.7
    },
    {
        "empId": 12305,
        "rbs": 153.6
    },
    {
        "empId": 12,
        "rbs": 103.9
    },
    {
        "empId": 379776,
        "rbs": 89.2
    },
    {
        "empId": 8260,
        "rbs": 146.3
    },
    {
        "empId": 12366,
        "rbs": 106.4
    },
    {
        "empId": 8015,
        "rbs": 181.4
    },
    {
        "empId": 45867,
        "rbs": 102.7
    },
    {
        "empId": 15732,
        "rbs": 158
    },
    {
        "empId": 392793,
        "rbs": 141.5
    },
    {
        "empId": 8661,
        "rbs": 190.8
    },
    {
        "empId": 9129,
        "rbs": 100.9
    },
    {
        "empId": 27176,
        "rbs": 147.8
    },
    {
        "empId": 393082,
        "rbs": 116.2
    },
    {
        "empId": 866,
        "rbs": 102
    },
    {
        "empId": "SVN-01864",
        "rbs": 96.4
    },
    {
        "empId": 612,
        "rbs": 137.6
    },
    {
        "empId": 63638,
        "rbs": 142.8
    },
    {
        "empId": 362264,
        "rbs": 133.6
    },
    {
        "empId": 378966,
        "rbs": 98.8
    },
    {
        "empId": 370853,
        "rbs": 94.8
    },
    {
        "empId": "SVN-02153",
        "rbs": 86.9
    },
    {
        "empId": 403637,
        "rbs": 80.4
    },
    {
        "empId": 21389,
        "rbs": 101.2
    },
    {
        "empId": "R-444",
        "rbs": 94.7
    },
    {
        "empId": 59,
        "rbs": 156.7
    },
    {
        "empId": 9021,
        "rbs": 96.8
    },
    {
        "empId": 399056,
        "rbs": 128.9
    },
    {
        "empId": 8928,
        "rbs": 125.8
    },
    {
        "empId": 8334,
        "rbs": 193
    },
    {
        "empId": 12364,
        "rbs": 113.2
    },
    {
        "empId": 8863,
        "rbs": 160.7
    },
    {
        "empId": 83985,
        "rbs": 126.2
    },
    {
        "empId": 399661,
        "rbs": 123.9
    },
    {
        "empId": 367752,
        "rbs": 120.5
    },
    {
        "empId": 369296,
        "rbs": 107.3
    },
    {
        "empId": 67192,
        "rbs": 113.5
    },
    {
        "empId": 66177,
        "rbs": 169.9
    },
    {
        "empId": 649,
        "rbs": 117.6
    },
    {
        "empId": 402925,
        "rbs": 147.2
    },
    {
        "empId": 12824,
        "rbs": 213.2
    },
    {
        "empId": 66968,
        "rbs": 148.5
    },
    {
        "empId": 43191,
        "rbs": 102.1
    },
    {
        "empId": 865,
        "rbs": 133.7
    },
    {
        "empId": 45289,
        "rbs": 148.2
    },
    {
        "empId": 12201,
        "rbs": 154.5
    },
    {
        "empId": 8226,
        "rbs": 121.2
    },
    {
        "empId": 8715,
        "rbs": 103.2
    },
    {
        "empId": 8282,
        "rbs": 143.9
    },
    {
        "empId": 8700,
        "rbs": 181.1
    },
    {
        "empId": 9150,
        "rbs": 138.1
    },
    {
        "empId": 8149,
        "rbs": 170.5
    },
    {
        "empId": 79315,
        "rbs": 120.5
    },
    {
        "empId": 27480,
        "rbs": 150.7
    },
    {
        "empId": 14864,
        "rbs": 143
    },
    {
        "empId": 82068,
        "rbs": 156.5
    },
    {
        "empId": 9072,
        "rbs": 146.2
    },
    {
        "empId": 17344,
        "rbs": 131.8
    },
    {
        "empId": 385608,
        "rbs": 104.1
    },
    {
        "empId": 381946,
        "rbs": 143.8
    },
    {
        "empId": 12594,
        "rbs": 150.6
    },
    {
        "empId": 390671,
        "rbs": 176.3
    },
    {
        "empId": 9093,
        "rbs": 128.7
    },
    {
        "empId": 387893,
        "rbs": 126.6
    },
    {
        "empId": 391195,
        "rbs": 100.3
    },
    {
        "empId": 79874,
        "rbs": 148.2
    },
    {
        "empId": 382383,
        "rbs": 122.3
    },
    {
        "empId": 8615,
        "rbs": 162
    },
    {
        "empId": 9078,
        "rbs": 195.4
    },
    {
        "empId": 88740,
        "rbs": 147.8
    },
    {
        "empId": "M-646",
        "rbs": 128
    },
    {
        "empId": 91453,
        "rbs": 123
    },
    {
        "empId": 487,
        "rbs": 134.1
    },
    {
        "empId": 29143,
        "rbs": 121.7
    },
    {
        "empId": 17654,
        "rbs": 161.6
    },
    {
        "empId": 391566,
        "rbs": 106.4
    },
    {
        "empId": 388018,
        "rbs": 104.6
    },
    {
        "empId": 65404,
        "rbs": 137.9
    },
    {
        "empId": 387611,
        "rbs": 149.5
    },
    {
        "empId": 27549,
        "rbs": 104.4
    },
    {
        "empId": 45812,
        "rbs": 101
    },
    {
        "empId": 399830,
        "rbs": 138.7
    },
    {
        "empId": 193,
        "rbs": 98.2
    },
    {
        "empId": "C3",
        "rbs": 129.6
    },
    {
        "empId": 57,
        "rbs": 177.6
    },
    {
        "empId": 64989,
        "rbs": 142
    },
    {
        "empId": 8009,
        "rbs": 129.6
    },
    {
        "empId": 8360,
        "rbs": 121.8
    },
    {
        "empId": 8099,
        "rbs": 181.8
    },
    {
        "empId": 20617,
        "rbs": 139.5
    },
    {
        "empId": 912,
        "rbs": 139.6
    },
    {
        "empId": "C4",
        "rbs": 94.7
    },
    {
        "empId": 19578,
        "rbs": 119.1
    },
    {
        "empId": 450,
        "rbs": 165.8
    },
    {
        "empId": 402881,
        "rbs": 120.1
    },
    {
        "empId": 813,
        "rbs": 108.1
    },
    {
        "empId": 8087,
        "rbs": 153.3
    },
    {
        "empId": 8191,
        "rbs": 158.1
    },
    {
        "empId": 12605,
        "rbs": 219.7
    },
    {
        "empId": 92518,
        "rbs": 142.3
    },
    {
        "empId": 93243,
        "rbs": 129.2
    },
    {
        "empId": 91014,
        "rbs": 130.8
    },
    {
        "empId": 677,
        "rbs": 93.1
    },
    {
        "empId": 81472,
        "rbs": 137.7
    },
    {
        "empId": "C5",
        "rbs": 147.6
    },
    {
        "empId": 49,
        "rbs": 115.6
    },
    {
        "empId": 91837,
        "rbs": 109.7
    },
    {
        "empId": 8145,
        "rbs": 159.1
    },
    {
        "empId": 9083,
        "rbs": 186.9
    },
    {
        "empId": 64840,
        "rbs": 173
    },
    {
        "empId": 7874,
        "rbs": 132.9
    },
    {
        "empId": 372453,
        "rbs": 148.9
    },
    {
        "empId": 89512,
        "rbs": 160.3
    },
    {
        "empId": 12223,
        "rbs": 154.8
    },
    {
        "empId": 8041,
        "rbs": 106.5
    },
    {
        "empId": 8232,
        "rbs": 105.8
    },
    {
        "empId": 202,
        "rbs": 196.2
    },
    {
        "empId": 268,
        "rbs": 134.9
    },
    {
        "empId": 8182,
        "rbs": 129.1
    },
    {
        "empId": 9015,
        "rbs": 138
    },
    {
        "empId": 8949,
        "rbs": 150.9
    },
    {
        "empId": 8065,
        "rbs": 111.9
    },
    {
        "empId": 386395,
        "rbs": 180.7
    },
    {
        "empId": 17137,
        "rbs": 147
    },
    {
        "empId": 8056,
        "rbs": 103.9
    },
    {
        "empId": 7806,
        "rbs": 116.5
    },
    {
        "empId": 9010,
        "rbs": 160.8
    },
    {
        "empId": 8974,
        "rbs": 159.4
    },
    {
        "empId": 308,
        "rbs": 134.2
    },
    {
        "empId": 932,
        "rbs": 131.6
    },
    {
        "empId": 370,
        "rbs": 116.2
    },
    {
        "empId": 78005,
        "rbs": 94.1
    },
    {
        "empId": 8918,
        "rbs": 147.4
    },
    {
        "empId": 388,
        "rbs": 101.8
    },
    {
        "empId": 8238,
        "rbs": 172.6
    },
    {
        "empId": 3,
        "rbs": 152.4
    },
    {
        "empId": "R-750",
        "rbs": 176.1
    },
    {
        "empId": 346,
        "rbs": 161.6
    },
    {
        "empId": 40,
        "rbs": 121.5
    },
    {
        "empId": 133,
        "rbs": 140.6
    },
    {
        "empId": 47,
        "rbs": 115.3
    },
    {
        "empId": 130,
        "rbs": 212.2
    },
    {
        "empId": 76822,
        "rbs": 148.4
    },
    {
        "empId": 380933,
        "rbs": 144.7
    },
    {
        "empId": 403710,
        "rbs": 153.5
    },
    {
        "empId": 9048,
        "rbs": 153.9
    },
    {
        "empId": 412,
        "rbs": 106.7
    },
    {
        "empId": 64728,
        "rbs": 102.5
    },
    {
        "empId": 9009,
        "rbs": 135.1
    },
    {
        "empId": "N-16",
        "rbs": 156.6
    },
    {
        "empId": 16896,
        "rbs": 111.1
    },
    {
        "empId": "M-935",
        "rbs": 150
    },
    {
        "empId": 8312,
        "rbs": 114.2
    },
    {
        "empId": 8444,
        "rbs": 188.7
    },
    {
        "empId": 271,
        "rbs": 108.4
    },
    {
        "empId": 45850,
        "rbs": 124.9
    },
    {
        "empId": 8090,
        "rbs": 200.4
    },
    {
        "empId": "C2",
        "rbs": 177.6
    },
    {
        "empId": 668,
        "rbs": 130.9
    },
    {
        "empId": 518,
        "rbs": 95.7
    },
    {
        "empId": 598,
        "rbs": 123.8
    },
    {
        "empId": 12344,
        "rbs": 119.7
    },
    {
        "empId": 395,
        "rbs": 177.8
    },
    {
        "empId": 8054,
        "rbs": 110.1
    },
    {
        "empId": "C6",
        "rbs": 119
    },
    {
        "empId": 8205,
        "rbs": 165.2
    },
    {
        "empId": 8733,
        "rbs": 125
    },
    {
        "empId": 8970,
        "rbs": 152
    },
    {
        "empId": 8354,
        "rbs": 142.7
    },
    {
        "empId": 8772,
        "rbs": 137.3
    },
    {
        "empId": 8290,
        "rbs": 142.8
    },
    {
        "empId": 77215,
        "rbs": 97.2
    },
    {
        "empId": 400,
        "rbs": 93.2
    },
    {
        "empId": "Ss-673",
        "rbs": 118.1
    },
    {
        "empId": "C7",
        "rbs": 141.1
    },
    {
        "empId": 47245,
        "rbs": 108.2
    },
    {
        "empId": 9037,
        "rbs": 102
    },
    {
        "empId": 11938,
        "rbs": 103.3
    },
    {
        "empId": 85131,
        "rbs": 150
    },
    {
        "empId": 64838,
        "rbs": 102.3
    },
    {
        "empId": 460,
        "rbs": 141.1
    },
    {
        "empId": 431,
        "rbs": 132
    },
    {
        "empId": 8023,
        "rbs": 112.9
    },
    {
        "empId": 91545,
        "rbs": 169.2
    },
    {
        "empId": 102,
        "rbs": 97
    },
    {
        "empId": 18526,
        "rbs": 185.3
    },
    {
        "empId": 29825,
        "rbs": 139.2
    },
    {
        "empId": 91838,
        "rbs": 136.7
    },
    {
        "empId": 371501,
        "rbs": 162.2
    },
    {
        "empId": 7995,
        "rbs": 114.9
    },
    {
        "empId": 915,
        "rbs": 146
    },
    {
        "empId": "R-631",
        "rbs": 100.1
    },
    {
        "empId": 596,
        "rbs": 121.8
    },
    {
        "empId": 12934,
        "rbs": 145.7
    },
    {
        "empId": 535,
        "rbs": 104.8
    },
    {
        "empId": 12082,
        "rbs": 118.6
    },
    {
        "empId": 71039,
        "rbs": 105.4
    },
    {
        "empId": 9117,
        "rbs": 152.8
    },
    {
        "empId": 8914,
        "rbs": 137.8
    },
    {
        "empId": 76785,
        "rbs": 115.2
    },
    {
        "empId": 77313,
        "rbs": 168.2
    },
    {
        "empId": 8079,
        "rbs": 137.7
    },
    {
        "empId": 81493,
        "rbs": 90.5
    },
    {
        "empId": 393081,
        "rbs": 95.1
    },
    {
        "empId": 16907,
        "rbs": 116.1
    },
    {
        "empId": 47781,
        "rbs": 138
    },
    {
        "empId": 555,
        "rbs": 159.7
    },
    {
        "empId": 498,
        "rbs": 142.9
    },
    {
        "empId": 8665,
        "rbs": 130.2
    },
    {
        "empId": 369295,
        "rbs": 103.3
    },
    {
        "empId": 35834,
        "rbs": 118.6
    },
    {
        "empId": 9002,
        "rbs": 99.8
    },
    {
        "empId": 406890,
        "rbs": 146.3
    },
    {
        "empId": 12229,
        "rbs": 95.7
    },
    {
        "empId": 8906,
        "rbs": 127.9
    },
    {
        "empId": 15355,
        "rbs": 104.9
    },
    {
        "empId": 8963,
        "rbs": 188
    },
    {
        "empId": 8346,
        "rbs": 98.2
    },
    {
        "empId": 8248,
        "rbs": 178.2
    },
    {
        "empId": "C8",
        "rbs": 174.3
    },
    {
        "empId": 511,
        "rbs": 164.2
    },
    {
        "empId": 81,
        "rbs": 108.4
    },
    {
        "empId": 8036,
        "rbs": 150.9
    },
    {
        "empId": 8718,
        "rbs": 123.8
    },
    {
        "empId": 8306,
        "rbs": 147.6
    },
    {
        "empId": 36395,
        "rbs": 112.5
    },
    {
        "empId": 9029,
        "rbs": 107.9
    },
    {
        "empId": 8344,
        "rbs": 111.1
    },
    {
        "empId": 8492,
        "rbs": 206.4
    },
    {
        "empId": 367652,
        "rbs": 116.8
    },
    {
        "empId": 8888,
        "rbs": 351.7
    },
    {
        "empId": 15158,
        "rbs": 126.6
    },
    {
        "empId": 188,
        "rbs": 123.4
    },
    {
        "empId": 21472,
        "rbs": 105.1
    },
    {
        "empId": "Spchs004",
        "rbs": 181.8
    },
    {
        "empId": 404900,
        "rbs": 159.2
    },
    {
        "empId": 9135,
        "rbs": 129.6
    },
    {
        "empId": 430,
        "rbs": 96.2
    },
    {
        "empId": 66577,
        "rbs": 142.8
    },
    {
        "empId": 380826,
        "rbs": 114.1
    },
    {
        "empId": 7933,
        "rbs": 103
    },
    {
        "empId": 404601,
        "rbs": 147
    },
    {
        "empId": 8855,
        "rbs": 153.3
    },
    {
        "empId": 8259,
        "rbs": 94.9
    },
    {
        "empId": 84912,
        "rbs": 96.3
    },
    {
        "empId": "R-175",
        "rbs": 104.9
    },
    {
        "empId": "C1",
        "rbs": 126.3
    },
    {
        "empId": 386394,
        "rbs": 116.3
    },
    {
        "empId": 930,
        "rbs": 176.5
    },
    {
        "empId": "R-666",
        "rbs": 146.9
    },
    {
        "empId": 8362,
        "rbs": 126.6
    },
    {
        "empId": 9053,
        "rbs": 132.3
    },
    {
        "empId": 370260,
        "rbs": 149
    },
    {
        "empId": 8936,
        "rbs": 130.3
    },
    {
        "empId": 372466,
        "rbs": 94.4
    },
    {
        "empId": 75769,
        "rbs": 125.9
    },
    {
        "empId": 76775,
        "rbs": 131.5
    },
    {
        "empId": 557,
        "rbs": 137
    },
    {
        "empId": 9049,
        "rbs": 214.7
    },
    {
        "empId": 9154,
        "rbs": 109.4
    },
    {
        "empId": 12313,
        "rbs": 161.1
    },
    {
        "empId": 8356,
        "rbs": 110.3
    },
    {
        "empId": 12395,
        "rbs": 97.5
    },
    {
        "empId": 8345,
        "rbs": 153
    },
    {
        "empId": 8951,
        "rbs": 96.1
    },
    {
        "empId": 8768,
        "rbs": 111.5
    },
    {
        "empId": 371877,
        "rbs": 130.5
    },
    {
        "empId": 58,
        "rbs": 135.1
    },
    {
        "empId": 252,
        "rbs": 164.3
    },
    {
        "empId": 8263,
        "rbs": 198.2
    },
    {
        "empId": 683,
        "rbs": 98.7
    },
    {
        "empId": 79597,
        "rbs": 160
    },
    {
        "empId": 372478,
        "rbs": 147.5
    },
    {
        "empId": "C9",
        "rbs": 114.6
    },
    {
        "empId": 78198,
        "rbs": 101.7
    },
    {
        "empId": 85698,
        "rbs": 117.5
    },
    {
        "empId": 623,
        "rbs": 119.9
    },
    {
        "empId": 380,
        "rbs": 150.6
    },
    {
        "empId": 627,
        "rbs": 118.6
    },
    {
        "empId": 688,
        "rbs": 135.4
    },
    {
        "empId": 895,
        "rbs": 157.2
    },
    {
        "empId": 791,
        "rbs": 129.5
    },
    {
        "empId": 937,
        "rbs": 146.1
    },
    {
        "empId": 925,
        "rbs": 115.4
    },
    {
        "empId": 414,
        "rbs": 170.6
    },
    {
        "empId": 131,
        "rbs": 132.9
    },
    {
        "empId": 392809,
        "rbs": 92.9
    },
    {
        "empId": 369906,
        "rbs": 86.2
    },
    {
        "empId": 8262,
        "rbs": 150.9
    },
    {
        "empId": 26537,
        "rbs": 139.1
    },
    {
        "empId": 7990,
        "rbs": 112.1
    },
    {
        "empId": 371365,
        "rbs": 134.2
    },
    {
        "empId": 73751,
        "rbs": 101.9
    },
    {
        "empId": 408,
        "rbs": 135.6
    },
    {
        "empId": 378705,
        "rbs": 100.4
    },
    {
        "empId": 383,
        "rbs": 92.8
    },
    {
        "empId": 388019,
        "rbs": 153
    },
    {
        "empId": 363169,
        "rbs": 131.6
    },
    {
        "empId": 381748,
        "rbs": 119.6
    },
    {
        "empId": 752,
        "rbs": 104.1
    },
    {
        "empId": 372536,
        "rbs": 94.8
    },
    {
        "empId": 63289,
        "rbs": 151.8
    },
    {
        "empId": 8953,
        "rbs": 140.2
    },
    {
        "empId": 8347,
        "rbs": 133.2
    },
    {
        "empId": 853,
        "rbs": 99
    },
    {
        "empId": 9056,
        "rbs": 195.1
    },
    {
        "empId": 391568,
        "rbs": 105.6
    },
    {
        "empId": 269,
        "rbs": 120.9
    },
    {
        "empId": 12342,
        "rbs": 114.8
    },
    {
        "empId": 145,
        "rbs": 124.3
    },
    {
        "empId": "C10",
        "rbs": 120.3
    },
    {
        "empId": 476,
        "rbs": 124.2
    },
    {
        "empId": 8535,
        "rbs": 103.1
    },
    {
        "empId": 382303,
        "rbs": 140.7
    },
    {
        "empId": 253,
        "rbs": 91
    },
    {
        "empId": 8905,
        "rbs": 112.9
    },
    {
        "empId": 215,
        "rbs": 133.3
    },
    {
        "empId": 91456,
        "rbs": 100.4
    },
    {
        "empId": 77939,
        "rbs": 133.5
    },
    {
        "empId": 64745,
        "rbs": 159.8
    },
    {
        "empId": 367617,
        "rbs": 140
    },
    {
        "empId": 742,
        "rbs": 130
    },
    {
        "empId": 493,
        "rbs": 207.3
    },
    {
        "empId": 370741,
        "rbs": 200.1
    },
    {
        "empId": 44180,
        "rbs": 145.7
    },
    {
        "empId": 364168,
        "rbs": 148.8
    },
    {
        "empId": 71,
        "rbs": 118.9
    },
    {
        "empId": "SS-502",
        "rbs": 94
    },
    {
        "empId": 8028,
        "rbs": 102.4
    },
    {
        "empId": 370811,
        "rbs": 129.8
    },
    {
        "empId": 899,
        "rbs": 98.9
    },
    {
        "empId": 405067,
        "rbs": 169.7
    },
    {
        "empId": 65405,
        "rbs": 106.9
    },
    {
        "empId": "C11",
        "rbs": 138.5
    },
    {
        "empId": 7818,
        "rbs": 135
    },
    {
        "empId": 622,
        "rbs": 97.8
    },
    {
        "empId": 8448,
        "rbs": 152.6
    },
    {
        "empId": 370261,
        "rbs": 137.5
    },
    {
        "empId": 369905,
        "rbs": 141.2
    },
    {
        "empId": 389042,
        "rbs": 146.5
    },
    {
        "empId": 76618,
        "rbs": 93.7
    },
    {
        "empId": 64824,
        "rbs": 117.4
    },
    {
        "empId": 7823,
        "rbs": 210.8
    },
    {
        "empId": 8969,
        "rbs": 185.8
    },
    {
        "empId": 8883,
        "rbs": 143.8
    },
    {
        "empId": "C12",
        "rbs": 149.8
    },
    {
        "empId": 8156,
        "rbs": 131.2
    },
    {
        "empId": "SS-661",
        "rbs": 95.1
    },
    {
        "empId": "C13",
        "rbs": 94.8
    },
    {
        "empId": 8978,
        "rbs": 121.5
    },
    {
        "empId": 181,
        "rbs": 78.9
    },
    {
        "empId": 45712,
        "rbs": 102.6
    },
    {
        "empId": 8094,
        "rbs": 97.6
    },
    {
        "empId": 8552,
        "rbs": 164.2
    },
    {
        "empId": "C15",
        "rbs": 138.5
    },
    {
        "empId": "C14",
        "rbs": 128.2
    },
    {
        "empId": 8530,
        "rbs": 151.3
    },
    {
        "empId": 7850,
        "rbs": 123.7
    },
    {
        "empId": 9096,
        "rbs": 102.2
    },
    {
        "empId": 394736,
        "rbs": 146.1
    },
    {
        "empId": 14646,
        "rbs": 122.5
    },
    {
        "empId": "R-589",
        "rbs": 175.3
    },
    {
        "empId": 365853,
        "rbs": 103
    },
    {
        "empId": 367308,
        "rbs": 131
    },
    {
        "empId": 7829,
        "rbs": 129.7
    },
    {
        "empId": "C16",
        "rbs": 120.5
    },
    {
        "empId": 362151,
        "rbs": 146.8
    },
    {
        "empId": 8415,
        "rbs": 124.7
    },
    {
        "empId": 100,
        "rbs": 137.7
    },
    {
        "empId": 14148,
        "rbs": 136.6
    },
    {
        "empId": 16,
        "rbs": 112.3
    },
    {
        "empId": 365767,
        "rbs": 146.3
    },
    {
        "empId": 8989,
        "rbs": 143
    },
    {
        "empId": 8921,
        "rbs": 118
    },
    {
        "empId": 8370,
        "rbs": 125.9
    },
    {
        "empId": 25709,
        "rbs": 157.7
    },
    {
        "empId": 9023,
        "rbs": 140.7
    },
    {
        "empId": 783,
        "rbs": 93.7
    },
    {
        "empId": 560,
        "rbs": 97.5
    },
    {
        "empId": 364632,
        "rbs": 111.7
    },
    {
        "empId": 8955,
        "rbs": 127.7
    },
    {
        "empId": 64818,
        "rbs": 121.5
    },
    {
        "empId": 503,
        "rbs": 204.9
    },
    {
        "empId": 9114,
        "rbs": 146.4
    },
    {
        "empId": 69016,
        "rbs": 134.3
    },
    {
        "empId": 687,
        "rbs": 115.9
    },
    {
        "empId": 316,
        "rbs": 169.1
    },
    {
        "empId": 20628,
        "rbs": 147.7
    },
    {
        "empId": 382831,
        "rbs": 83.9
    },
    {
        "empId": "C17",
        "rbs": 158.1
    },
    {
        "empId": 318,
        "rbs": 91.7
    },
    {
        "empId": 368042,
        "rbs": 204.4
    },
    {
        "empId": 8954,
        "rbs": 81.7
    },
    {
        "empId": 8020,
        "rbs": 93.4
    },
    {
        "empId": 382386,
        "rbs": 102.8
    },
    {
        "empId": 931,
        "rbs": 102.6
    },
    {
        "empId": 9084,
        "rbs": 147.6
    },
    {
        "empId": 8801,
        "rbs": 149.8
    },
    {
        "empId": 43173,
        "rbs": 161.2
    },
    {
        "empId": 738,
        "rbs": 98.2
    },
    {
        "empId": 8926,
        "rbs": 140.5
    },
    {
        "empId": 64817,
        "rbs": 147.6
    },
    {
        "empId": 324,
        "rbs": 154.8
    },
    {
        "empId": 44187,
        "rbs": 116.6
    },
    {
        "empId": 93533,
        "rbs": 109.1
    },
    {
        "empId": 1090,
        "rbs": 105
    },
    {
        "empId": 8288,
        "rbs": 140.1
    },
    {
        "empId": 9058,
        "rbs": 143.5
    },
    {
        "empId": 8494,
        "rbs": 110.2
    },
    {
        "empId": 12796,
        "rbs": 111.3
    },
    {
        "empId": 91508,
        "rbs": 137.3
    },
    {
        "empId": 77454,
        "rbs": 108.2
    },
    {
        "empId": "SA94T",
        "rbs": 150.7
    },
    {
        "empId": 8743,
        "rbs": 123.8
    },
    {
        "empId": 64850,
        "rbs": 82.5
    },
    {
        "empId": 14649,
        "rbs": 141
    },
    {
        "empId": 8958,
        "rbs": 134.3
    },
    {
        "empId": 9001,
        "rbs": 174.1
    },
    {
        "empId": 590,
        "rbs": 130.1
    },
    {
        "empId": 8189,
        "rbs": 206.3
    },
    {
        "empId": "C18",
        "rbs": 136.2
    },
    {
        "empId": 8728,
        "rbs": 98.6
    },
    {
        "empId": 390669,
        "rbs": 209.2
    },
    {
        "empId": 8912,
        "rbs": 155.1
    },
    {
        "empId": 377685,
        "rbs": 141.2
    },
    {
        "empId": 8460,
        "rbs": 207.7
    },
    {
        "empId": 8933,
        "rbs": 111.8
    },
    {
        "empId": 572,
        "rbs": 135.7
    },
    {
        "empId": 12349,
        "rbs": 120.3
    },
    {
        "empId": 8999,
        "rbs": 94.2
    },
    {
        "empId": 38287,
        "rbs": 129.2
    },
    {
        "empId": 402209,
        "rbs": 149.3
    },
    {
        "empId": 12310,
        "rbs": 115.1
    },
    {
        "empId": 8956,
        "rbs": 134.4
    },
    {
        "empId": 370720,
        "rbs": 151
    },
    {
        "empId": 64832,
        "rbs": 120.6
    },
    {
        "empId": 778,
        "rbs": 93.6
    },
    {
        "empId": 8215,
        "rbs": 126.3
    },
    {
        "empId": 8786,
        "rbs": 160.6
    },
    {
        "empId": 15380,
        "rbs": 141.1
    },
    {
        "empId": 8934,
        "rbs": 175.9
    },
    {
        "empId": 940,
        "rbs": 113.5
    },
    {
        "empId": 396781,
        "rbs": 123.6
    },
    {
        "empId": 621,
        "rbs": 112.2
    },
    {
        "empId": 975,
        "rbs": 137.7
    },
    {
        "empId": "E5246",
        "rbs": 148.8
    },
    {
        "empId": 8859,
        "rbs": 175.6
    },
    {
        "empId": 8250,
        "rbs": 109.3
    },
    {
        "empId": 390668,
        "rbs": 143.1
    },
    {
        "empId": 547,
        "rbs": 142.8
    },
    {
        "empId": 8100,
        "rbs": 128.1
    },
    {
        "empId": 363398,
        "rbs": 137.8
    },
    {
        "empId": 8217,
        "rbs": 275.2
    },
    {
        "empId": 390705,
        "rbs": 131.6
    },
    {
        "empId": 8342,
        "rbs": 106.5
    },
    {
        "empId": "N-46",
        "rbs": 96.7
    },
    {
        "empId": 8274,
        "rbs": 115
    },
    {
        "empId": 9068,
        "rbs": 132.9
    },
    {
        "empId": 8769,
        "rbs": 121.1
    },
    {
        "empId": 360672,
        "rbs": 91.7
    },
    {
        "empId": "M-494",
        "rbs": 119.8
    },
    {
        "empId": 8426,
        "rbs": 172.7
    },
    {
        "empId": 144,
        "rbs": 143.9
    },
    {
        "empId": 8929,
        "rbs": 148.7
    },
    {
        "empId": "N-484",
        "rbs": 113.2
    },
    {
        "empId": 12598,
        "rbs": 143.3
    },
    {
        "empId": 656,
        "rbs": 151.3
    },
    {
        "empId": 71364,
        "rbs": 139.2
    },
    {
        "empId": 9031,
        "rbs": 132.6
    },
    {
        "empId": 8307,
        "rbs": 200
    },
    {
        "empId": 20316,
        "rbs": 129.6
    },
    {
        "empId": "R-84",
        "rbs": 104.8
    },
    {
        "empId": 644,
        "rbs": 129.5
    },
    {
        "empId": "N-326",
        "rbs": 97.3
    },
    {
        "empId": 625,
        "rbs": 184.9
    },
    {
        "empId": 710,
        "rbs": 138.4
    },
    {
        "empId": "M-750",
        "rbs": 92.7
    },
    {
        "empId": 64835,
        "rbs": 190.1
    },
    {
        "empId": 8830,
        "rbs": 145.6
    },
    {
        "empId": 64831,
        "rbs": 147.4
    },
    {
        "empId": 592,
        "rbs": 104.5
    },
    {
        "empId": 27050,
        "rbs": 216.7
    },
    {
        "empId": 94408,
        "rbs": 123.2
    },
    {
        "empId": 44057,
        "rbs": 136.2
    },
    {
        "empId": 674,
        "rbs": 213.5
    },
    {
        "empId": 415,
        "rbs": 152.3
    },
    {
        "empId": 78196,
        "rbs": 126
    },
    {
        "empId": "D200856",
        "rbs": 126.7
    },
    {
        "empId": 624,
        "rbs": 133.1
    },
    {
        "empId": 366158,
        "rbs": 110.5
    },
    {
        "empId": 12216,
        "rbs": 144.5
    },
    {
        "empId": 8771,
        "rbs": 110.6
    },
    {
        "empId": 293,
        "rbs": 126.7
    },
    {
        "empId": "M-661",
        "rbs": 90.5
    },
    {
        "empId": 8200,
        "rbs": 117.4
    },
    {
        "empId": "C19",
        "rbs": 123.5
    },
    {
        "empId": 8419,
        "rbs": 100.2
    },
    {
        "empId": 7896,
        "rbs": 192.1
    },
    {
        "empId": 81480,
        "rbs": 153.2
    },
    {
        "empId": 64584,
        "rbs": 168.5
    },
    {
        "empId": 856,
        "rbs": 131.2
    },
    {
        "empId": "M-660",
        "rbs": 133
    },
    {
        "empId": 339,
        "rbs": 128.4
    },
    {
        "empId": 580,
        "rbs": 115.2
    },
    {
        "empId": 633,
        "rbs": 147.2
    },
    {
        "empId": 452,
        "rbs": 210.2
    },
    {
        "empId": 7993,
        "rbs": 105
    },
    {
        "empId": 8199,
        "rbs": 122.9
    },
    {
        "empId": "C20",
        "rbs": 111.8
    },
    {
        "empId": 13228,
        "rbs": 192.2
    },
    {
        "empId": 11391,
        "rbs": 108.5
    },
    {
        "empId": 9055,
        "rbs": 137.1
    },
    {
        "empId": 477,
        "rbs": 121.4
    },
    {
        "empId": 153,
        "rbs": 125.3
    },
    {
        "empId": 1,
        "rbs": 155
    },
    {
        "empId": 9005,
        "rbs": 218.6
    },
    {
        "empId": 171,
        "rbs": 150.9
    },
    {
        "empId": 464,
        "rbs": 140.2
    },
    {
        "empId": 12311,
        "rbs": 111.4
    },
    {
        "empId": 370259,
        "rbs": 146.5
    },
    {
        "empId": "SS-631",
        "rbs": 124.2
    },
    {
        "empId": 391567,
        "rbs": 110.3
    },
    {
        "empId": 497,
        "rbs": 115.2
    },
    {
        "empId": 44819,
        "rbs": 158.8
    },
    {
        "empId": 295,
        "rbs": 127.6
    },
    {
        "empId": 7908,
        "rbs": 155.9
    },
    {
        "empId": 391837,
        "rbs": 161.9
    },
    {
        "empId": 402210,
        "rbs": 90.9
    },
    {
        "empId": 482,
        "rbs": 91.3
    },
    {
        "empId": 664,
        "rbs": 157.3
    },
    {
        "empId": 961,
        "rbs": 146.8
    },
    {
        "empId": 300,
        "rbs": 101.8
    },
    {
        "empId": "SPCHS006",
        "rbs": 131.8
    },
    {
        "empId": 8064,
        "rbs": 150.7
    },
    {
        "empId": 104,
        "rbs": 190.5
    },
    {
        "empId": 84088,
        "rbs": 138.2
    },
    {
        "empId": 8997,
        "rbs": 173.3
    },
    {
        "empId": 9128,
        "rbs": 134.7
    },
    {
        "empId": 349,
        "rbs": 169.2
    },
    {
        "empId": 7873,
        "rbs": 126.2
    },
    {
        "empId": 11826,
        "rbs": 121.8
    },
    {
        "empId": 8804,
        "rbs": 137.6
    },
    {
        "empId": 95854,
        "rbs": 135.5
    },
    {
        "empId": 17359,
        "rbs": 97.1
    },
    {
        "empId": "M-635",
        "rbs": 138.8
    },
    {
        "empId": 496,
        "rbs": 117.7
    },
    {
        "empId": 952,
        "rbs": 124.7
    },
    {
        "empId": 386390,
        "rbs": 105.4
    },
    {
        "empId": 387222,
        "rbs": 97.4
    },
    {
        "empId": 8532,
        "rbs": 148.6
    },
    {
        "empId": 8224,
        "rbs": 142.4
    },
    {
        "empId": 8183,
        "rbs": 129.7
    },
    {
        "empId": 48039,
        "rbs": 147.3
    },
    {
        "empId": 8434,
        "rbs": 131.7
    },
    {
        "empId": 9081,
        "rbs": 185.8
    },
    {
        "empId": 8891,
        "rbs": 110.1
    },
    {
        "empId": 8745,
        "rbs": 196.7
    },
    {
        "empId": 16895,
        "rbs": 135.3
    },
    {
        "empId": 391196,
        "rbs": 135.6
    },
    {
        "empId": 45828,
        "rbs": 120
    },
    {
        "empId": 14647,
        "rbs": 106
    },
    {
        "empId": 399773,
        "rbs": 88.4
    },
    {
        "empId": 387609,
        "rbs": 91.1
    },
    {
        "empId": 360342,
        "rbs": 91.2
    },
    {
        "empId": 27297,
        "rbs": 108.4
    },
    {
        "empId": 892,
        "rbs": 104.3
    },
    {
        "empId": 8834,
        "rbs": 122.3
    },
    {
        "empId": 168,
        "rbs": 139.8
    },
    {
        "empId": 8234,
        "rbs": 161.5
    },
    {
        "empId": 70809,
        "rbs": 105.5
    },
    {
        "empId": 12171,
        "rbs": 123
    },
    {
        "empId": "C21",
        "rbs": 108.4
    },
    {
        "empId": "SS-571",
        "rbs": 101.2
    },
    {
        "empId": 393494,
        "rbs": 195.2
    },
    {
        "empId": 45664,
        "rbs": 132.5
    },
    {
        "empId": 8176,
        "rbs": 192.4
    },
    {
        "empId": 7907,
        "rbs": 121.7
    },
    {
        "empId": 399181,
        "rbs": 166.4
    },
    {
        "empId": "C22",
        "rbs": 146
    },
    {
        "empId": 11944,
        "rbs": 93.8
    },
    {
        "empId": 8338,
        "rbs": 131.4
    },
    {
        "empId": 91097,
        "rbs": 155
    },
    {
        "empId": 36324,
        "rbs": 89.5
    },
    {
        "empId": 831,
        "rbs": 144.9
    },
    {
        "empId": 64839,
        "rbs": 155.8
    },
    {
        "empId": 8367,
        "rbs": 149.9
    },
    {
        "empId": 463,
        "rbs": 93.4
    },
    {
        "empId": 20,
        "rbs": 101.9
    },
    {
        "empId": 343,
        "rbs": 124.2
    },
    {
        "empId": 8919,
        "rbs": 116.9
    },
    {
        "empId": 9018,
        "rbs": 183.5
    },
    {
        "empId": 8968,
        "rbs": 112.9
    },
    {
        "empId": 628,
        "rbs": 97.8
    },
    {
        "empId": 559,
        "rbs": 178.2
    },
    {
        "empId": 8961,
        "rbs": 136.1
    },
    {
        "empId": 75473,
        "rbs": 120.7
    },
    {
        "empId": 7860,
        "rbs": 159.9
    },
    {
        "empId": 80117,
        "rbs": 176
    },
    {
        "empId": 639,
        "rbs": 127.5
    },
    {
        "empId": "SS-460",
        "rbs": 117.9
    },
    {
        "empId": 405678,
        "rbs": 97.6
    },
    {
        "empId": 94409,
        "rbs": 116.2
    },
    {
        "empId": 8775,
        "rbs": 143.8
    },
    {
        "empId": 12263,
        "rbs": 119.3
    },
    {
        "empId": 8549,
        "rbs": 108.1
    },
    {
        "empId": 383881,
        "rbs": 166.7
    },
    {
        "empId": "VC45330429",
        "rbs": 98.7
    },
    {
        "empId": 9020,
        "rbs": 99.2
    },
    {
        "empId": 43174,
        "rbs": 149.6
    },
    {
        "empId": 8930,
        "rbs": 113.9
    },
    {
        "empId": 8810,
        "rbs": 138.1
    },
    {
        "empId": 7784,
        "rbs": 112
    },
    {
        "empId": 396557,
        "rbs": 104.4
    },
    {
        "empId": 83981,
        "rbs": 145.4
    },
    {
        "empId": 565,
        "rbs": 115
    },
    {
        "empId": 8002,
        "rbs": 98.1
    },
    {
        "empId": 360103,
        "rbs": 137.2
    },
    {
        "empId": 382,
        "rbs": 123.2
    },
    {
        "empId": "Svn 02341",
        "rbs": 103.2
    },
    {
        "empId": 8838,
        "rbs": 130.4
    },
    {
        "empId": 920,
        "rbs": 138.1
    },
    {
        "empId": 401118,
        "rbs": 160.4
    },
    {
        "empId": 19566,
        "rbs": 134
    },
    {
        "empId": 399847,
        "rbs": 106.2
    },
    {
        "empId": 19573,
        "rbs": 158.5
    },
    {
        "empId": 632,
        "rbs": 132.1
    },
    {
        "empId": 8305,
        "rbs": 156.8
    },
    {
        "empId": 420,
        "rbs": 150.9
    },
    {
        "empId": 12260,
        "rbs": 123.3
    },
    {
        "empId": 421,
        "rbs": 121.1
    },
    {
        "empId": 12820,
        "rbs": 135.4
    },
    {
        "empId": "C23",
        "rbs": 138.1
    },
    {
        "empId": 63,
        "rbs": 120.4
    },
    {
        "empId": 8243,
        "rbs": 160.1
    },
    {
        "empId": 380129,
        "rbs": 159.3
    },
    {
        "empId": 79312,
        "rbs": 148.1
    },
    {
        "empId": 360344,
        "rbs": 88
    },
    {
        "empId": 8372,
        "rbs": 123.1
    },
    {
        "empId": 365680,
        "rbs": 138.8
    },
    {
        "empId": 8751,
        "rbs": 149.7
    },
    {
        "empId": 17356,
        "rbs": 139.6
    },
    {
        "empId": 536,
        "rbs": 121.8
    },
    {
        "empId": 8427,
        "rbs": 97.4
    },
    {
        "empId": 348,
        "rbs": 150.8
    },
    {
        "empId": "TZ0001",
        "rbs": 133.2
    },
    {
        "empId": 876,
        "rbs": 177.1
    },
    {
        "empId": 360108,
        "rbs": 139.5
    },
    {
        "empId": 62006,
        "rbs": 151.9
    },
    {
        "empId": "N-502",
        "rbs": 158.4
    },
    {
        "empId": 8548,
        "rbs": 101.8
    },
    {
        "empId": 8533,
        "rbs": 240.4
    },
    {
        "empId": 382460,
        "rbs": 106.3
    },
    {
        "empId": 14706,
        "rbs": 140.8
    },
    {
        "empId": 91493,
        "rbs": 120.1
    },
    {
        "empId": 399648,
        "rbs": 96
    },
    {
        "empId": 7932,
        "rbs": 114.9
    },
    {
        "empId": 8538,
        "rbs": 153.8
    },
    {
        "empId": 8966,
        "rbs": 160.1
    },
    {
        "empId": 8402,
        "rbs": 158.9
    },
    {
        "empId": 334,
        "rbs": 92.4
    },
    {
        "empId": 378,
        "rbs": 125.6
    },
    {
        "empId": 8663,
        "rbs": 150.4
    },
    {
        "empId": 21387,
        "rbs": 101.5
    },
    {
        "empId": 74,
        "rbs": 139.4
    },
    {
        "empId": 9024,
        "rbs": 132.3
    },
    {
        "empId": 8677,
        "rbs": 154.5
    },
    {
        "empId": 123116,
        "rbs": 121
    },
    {
        "empId": 731,
        "rbs": 150.1
    },
    {
        "empId": 382293,
        "rbs": 99.7
    },
    {
        "empId": 761,
        "rbs": 147.8
    },
    {
        "empId": 8722,
        "rbs": 153.7
    },
    {
        "empId": 360951,
        "rbs": 130.1
    },
    {
        "empId": "ST-175",
        "rbs": 144.1
    },
    {
        "empId": 12279,
        "rbs": 102
    },
    {
        "empId": 371099,
        "rbs": 153.6
    },
    {
        "empId": 94458,
        "rbs": 147.5
    },
    {
        "empId": 7994,
        "rbs": 125.9
    },
    {
        "empId": "C24",
        "rbs": 114.7
    },
    {
        "empId": 9137,
        "rbs": 126.3
    },
    {
        "empId": 8416,
        "rbs": 112.3
    },
    {
        "empId": 75463,
        "rbs": 127.9
    },
    {
        "empId": 44476,
        "rbs": 113.5
    },
    {
        "empId": 8439,
        "rbs": 199.2
    },
    {
        "empId": 360507,
        "rbs": 88.6
    },
    {
        "empId": 45639,
        "rbs": 201.1
    },
    {
        "empId": 8885,
        "rbs": 110.1
    },
    {
        "empId": 500,
        "rbs": 117.8
    },
    {
        "empId": 363963,
        "rbs": 119.9
    },
    {
        "empId": "SVN-02028",
        "rbs": 78.7
    },
    {
        "empId": 828,
        "rbs": 95
    },
    {
        "empId": 760,
        "rbs": 110.3
    },
    {
        "empId": 499,
        "rbs": 118.3
    },
    {
        "empId": 515,
        "rbs": 104.5
    },
    {
        "empId": 381471,
        "rbs": 143.1
    },
    {
        "empId": 387223,
        "rbs": 133.4
    },
    {
        "empId": 401772,
        "rbs": 143
    },
    {
        "empId": 676,
        "rbs": 87.4
    },
    {
        "empId": 8506,
        "rbs": 181.7
    },
    {
        "empId": 8762,
        "rbs": 97.4
    },
    {
        "empId": 12799,
        "rbs": 154.6
    },
    {
        "empId": 404743,
        "rbs": 132
    },
    {
        "empId": 95318,
        "rbs": 96.5
    },
    {
        "empId": 8789,
        "rbs": 145.5
    },
    {
        "empId": 35926,
        "rbs": 90
    },
    {
        "empId": 7800,
        "rbs": 148
    },
    {
        "empId": 26774,
        "rbs": 104.4
    },
    {
        "empId": 7801,
        "rbs": 145.3
    },
    {
        "empId": 9059,
        "rbs": 114.2
    },
    {
        "empId": 12795,
        "rbs": 198.2
    },
    {
        "empId": 8144,
        "rbs": 87.9
    },
    {
        "empId": 66587,
        "rbs": 145.7
    },
    {
        "empId": 9025,
        "rbs": 108.4
    },
    {
        "empId": 44818,
        "rbs": 145
    },
    {
        "empId": 16058,
        "rbs": 147.6
    },
    {
        "empId": 36327,
        "rbs": 137.9
    },
    {
        "empId": 8770,
        "rbs": 107.4
    },
    {
        "empId": 25708,
        "rbs": 114.4
    },
    {
        "empId": 8723,
        "rbs": 157.5
    },
    {
        "empId": 7867,
        "rbs": 133.4
    },
    {
        "empId": 93242,
        "rbs": 209.7
    },
    {
        "empId": 21393,
        "rbs": 95.2
    },
    {
        "empId": 8445,
        "rbs": 178.7
    },
    {
        "empId": "C25",
        "rbs": 112.1
    },
    {
        "empId": "C26",
        "rbs": 192.8
    },
    {
        "empId": 7813,
        "rbs": 177
    },
    {
        "empId": 8981,
        "rbs": 133.4
    },
    {
        "empId": 396453,
        "rbs": 158.8
    },
    {
        "empId": 924,
        "rbs": 136.1
    },
    {
        "empId": 325,
        "rbs": 145.1
    },
    {
        "empId": 66961,
        "rbs": 166.5
    },
    {
        "empId": 94270,
        "rbs": 207.6
    },
    {
        "empId": 8827,
        "rbs": 124.1
    },
    {
        "empId": 8151,
        "rbs": 218.1
    },
    {
        "empId": 8972,
        "rbs": 125.9
    },
    {
        "empId": 387266,
        "rbs": 114.1
    },
    {
        "empId": 366164,
        "rbs": 139.7
    },
    {
        "empId": 7861,
        "rbs": 149
    },
    {
        "empId": 9070,
        "rbs": 128
    },
    {
        "empId": 8886,
        "rbs": 156.3
    },
    {
        "empId": 67,
        "rbs": 110.4
    },
    {
        "empId": 20626,
        "rbs": 151
    },
    {
        "empId": 370790,
        "rbs": 136.9
    },
    {
        "empId": 8118,
        "rbs": 85.9
    },
    {
        "empId": 8668,
        "rbs": 139.9
    },
    {
        "empId": 404898,
        "rbs": 160.9
    },
    {
        "empId": 92127,
        "rbs": 140
    },
    {
        "empId": 459,
        "rbs": 89.2
    },
    {
        "empId": 89514,
        "rbs": 97.8
    },
    {
        "empId": 378906,
        "rbs": 160.4
    },
    {
        "empId": 368097,
        "rbs": 144.5
    },
    {
        "empId": 8174,
        "rbs": 172.3
    },
    {
        "empId": 432,
        "rbs": 143.5
    },
    {
        "empId": 8257,
        "rbs": 95
    },
    {
        "empId": 8696,
        "rbs": 146.3
    },
    {
        "empId": 369294,
        "rbs": 135.4
    },
    {
        "empId": 12793,
        "rbs": 115.6
    },
    {
        "empId": 8245,
        "rbs": 126.7
    },
    {
        "empId": 404666,
        "rbs": 100.5
    },
    {
        "empId": 363849,
        "rbs": 99.6
    },
    {
        "empId": 382833,
        "rbs": 202.2
    },
    {
        "empId": 314,
        "rbs": 135.9
    },
    {
        "empId": 366388,
        "rbs": 131
    },
    {
        "empId": 835,
        "rbs": 120.9
    },
    {
        "empId": 8950,
        "rbs": 192.1
    },
    {
        "empId": 8924,
        "rbs": 114.9
    },
    {
        "empId": 8277,
        "rbs": 125.2
    },
    {
        "empId": 8539,
        "rbs": 114.3
    },
    {
        "empId": 9016,
        "rbs": 158.8
    },
    {
        "empId": 8231,
        "rbs": 140.5
    },
    {
        "empId": 8407,
        "rbs": 183.8
    },
    {
        "empId": 8898,
        "rbs": 138.3
    },
    {
        "empId": "N-444",
        "rbs": 175.3
    },
    {
        "empId": 9045,
        "rbs": 93.2
    },
    {
        "empId": 960,
        "rbs": 118.4
    },
    {
        "empId": 8308,
        "rbs": 130.4
    },
    {
        "empId": 22,
        "rbs": 193.4
    },
    {
        "empId": 8278,
        "rbs": 99.6
    },
    {
        "empId": 8944,
        "rbs": 298.5
    },
    {
        "empId": 9158,
        "rbs": 130.4
    },
    {
        "empId": 8310,
        "rbs": 104.6
    },
    {
        "empId": 8882,
        "rbs": 138.8
    },
    {
        "empId": 8052,
        "rbs": 121
    },
    {
        "empId": 21,
        "rbs": 140
    },
    {
        "empId": 12225,
        "rbs": 160.4
    },
    {
        "empId": "Ms 935",
        "rbs": 140.7
    },
    {
        "empId": 44183,
        "rbs": 156.2
    },
    {
        "empId": 8570,
        "rbs": 104.3
    },
    {
        "empId": 379775,
        "rbs": 176.9
    },
    {
        "empId": 8153,
        "rbs": 121.6
    },
    {
        "empId": 8927,
        "rbs": 206.7
    },
    {
        "empId": 71507,
        "rbs": 137.3
    },
    {
        "empId": "N-393",
        "rbs": 106.5
    },
    {
        "empId": 7827,
        "rbs": 136
    },
    {
        "empId": 27547,
        "rbs": 112.9
    },
    {
        "empId": 32728,
        "rbs": 110.8
    },
    {
        "empId": "N-289",
        "rbs": 102
    },
    {
        "empId": "M-630",
        "rbs": 108.3
    },
    {
        "empId": 882,
        "rbs": 122.4
    },
    {
        "empId": 439,
        "rbs": 129.5
    },
    {
        "empId": 12210,
        "rbs": 81.9
    },
    {
        "empId": 78347,
        "rbs": 167.1
    },
    {
        "empId": 8537,
        "rbs": 95.6
    },
    {
        "empId": 64819,
        "rbs": 137.3
    },
    {
        "empId": 91204,
        "rbs": 110.4
    },
    {
        "empId": 7828,
        "rbs": 93.3
    },
    {
        "empId": 8329,
        "rbs": 174.1
    },
    {
        "empId": 9124,
        "rbs": 113
    },
    {
        "empId": 577,
        "rbs": 97.9
    },
    {
        "empId": 17,
        "rbs": 141.6
    },
    {
        "empId": 428,
        "rbs": 98.9
    },
    {
        "empId": 371757,
        "rbs": 123.5
    },
    {
        "empId": "A-1",
        "rbs": 127.3
    },
    {
        "empId": 8879,
        "rbs": 162.2
    },
    {
        "empId": "C27",
        "rbs": 157.6
    },
    {
        "empId": 395195,
        "rbs": 118.3
    },
    {
        "empId": "N-494",
        "rbs": 142.2
    },
    {
        "empId": 381749,
        "rbs": 143.1
    },
    {
        "empId": 8694,
        "rbs": 134.2
    },
    {
        "empId": 340,
        "rbs": 152
    },
    {
        "empId": 371364,
        "rbs": 109.7
    },
    {
        "empId": 365679,
        "rbs": 98.3
    },
    {
        "empId": 681,
        "rbs": 117.3
    },
    {
        "empId": 7783,
        "rbs": 159.1
    },
    {
        "empId": 367841,
        "rbs": 115.5
    },
    {
        "empId": 8948,
        "rbs": 105
    },
    {
        "empId": 8884,
        "rbs": 156.4
    },
    {
        "empId": 8975,
        "rbs": 110.3
    },
    {
        "empId": 366161,
        "rbs": 165.7
    },
    {
        "empId": 1091,
        "rbs": 130.8
    },
    {
        "empId": 815,
        "rbs": 89.5
    },
    {
        "empId": 372479,
        "rbs": 156.2
    },
    {
        "empId": 43192,
        "rbs": 145.9
    },
    {
        "empId": 392265,
        "rbs": 113.8
    },
    {
        "empId": 8702,
        "rbs": 98.8
    },
    {
        "empId": 8301,
        "rbs": 101.2
    },
    {
        "empId": "M-664",
        "rbs": 92.7
    },
    {
        "empId": "C28",
        "rbs": 93.5
    },
    {
        "empId": 43337,
        "rbs": 134
    },
    {
        "empId": 365768,
        "rbs": 142.3
    },
    {
        "empId": 8805,
        "rbs": 148
    },
    {
        "empId": 39516,
        "rbs": 144
    },
    {
        "empId": 8244,
        "rbs": 93.7
    },
    {
        "empId": 70437,
        "rbs": 89.9
    },
    {
        "empId": 8469,
        "rbs": 112.3
    },
    {
        "empId": 17355,
        "rbs": 89.9
    },
    {
        "empId": 17966,
        "rbs": 140
    },
    {
        "empId": 8450,
        "rbs": 121.5
    },
    {
        "empId": 11189,
        "rbs": 181.2
    },
    {
        "empId": 26946,
        "rbs": 102
    },
    {
        "empId": 378698,
        "rbs": 132.3
    },
    {
        "empId": 8741,
        "rbs": 103.8
    },
    {
        "empId": 949,
        "rbs": 85.5
    },
    {
        "empId": 360212,
        "rbs": 103.8
    },
    {
        "empId": 8371,
        "rbs": 109
    },
    {
        "empId": 8073,
        "rbs": 117.2
    },
    {
        "empId": 8013,
        "rbs": 139
    },
    {
        "empId": 368098,
        "rbs": 124
    },
    {
        "empId": 9119,
        "rbs": 132.5
    },
    {
        "empId": 461,
        "rbs": 107.1
    },
    {
        "empId": 8913,
        "rbs": 95.8
    },
    {
        "empId": 667,
        "rbs": 110.2
    },
    {
        "empId": 9089,
        "rbs": 179.6
    },
    {
        "empId": 26287,
        "rbs": 124.3
    },
    {
        "empId": 9085,
        "rbs": 156.7
    },
    {
        "empId": 8839,
        "rbs": 107.4
    },
    {
        "empId": 8917,
        "rbs": 107.3
    },
    {
        "empId": 94963,
        "rbs": 133.1
    },
    {
        "empId": 70779,
        "rbs": 158.6
    },
    {
        "empId": "ITC-4",
        "rbs": 131.6
    },
    {
        "empId": 8223,
        "rbs": 127.5
    },
    {
        "empId": 370646,
        "rbs": 94.3
    },
    {
        "empId": 401743,
        "rbs": 153.9
    },
    {
        "empId": 8977,
        "rbs": 134.5
    },
    {
        "empId": 12357,
        "rbs": 149
    },
    {
        "empId": 372435,
        "rbs": 122.6
    },
    {
        "empId": 8803,
        "rbs": 118.4
    },
    {
        "empId": 29827,
        "rbs": 155.1
    },
    {
        "empId": 8727,
        "rbs": 139.5
    },
    {
        "empId": 369297,
        "rbs": 123.6
    },
    {
        "empId": 8967,
        "rbs": 149.2
    },
    {
        "empId": "C29",
        "rbs": 195.4
    },
    {
        "empId": 413,
        "rbs": 101.3
    },
    {
        "empId": 946,
        "rbs": 89.1
    },
    {
        "empId": 8072,
        "rbs": 136.6
    },
    {
        "empId": 11088,
        "rbs": 155.6
    },
    {
        "empId": 402880,
        "rbs": 148.8
    },
    {
        "empId": "SS-289",
        "rbs": 98.2
    },
    {
        "empId": 606,
        "rbs": 155.2
    },
    {
        "empId": 7788,
        "rbs": 155.2
    },
    {
        "empId": 8378,
        "rbs": 136.3
    },
    {
        "empId": 47837,
        "rbs": 160.2
    },
    {
        "empId": "SS-643",
        "rbs": 95.3
    },
    {
        "empId": 380835,
        "rbs": 149.5
    },
    {
        "empId": "C30",
        "rbs": 125.4
    },
    {
        "empId": 26288,
        "rbs": 154.1
    },
    {
        "empId": "SA87T",
        "rbs": 107.1
    },
    {
        "empId": 957,
        "rbs": 115.4
    },
    {
        "empId": 8938,
        "rbs": 120.2
    },
    {
        "empId": 66670,
        "rbs": 120.5
    },
    {
        "empId": 389877,
        "rbs": 149
    },
    {
        "empId": 7976,
        "rbs": 108.9
    },
    {
        "empId": 9054,
        "rbs": 120.3
    },
    {
        "empId": 8946,
        "rbs": 191.1
    },
    {
        "empId": 795,
        "rbs": 88.6
    },
    {
        "empId": "SA85T",
        "rbs": 82.1
    },
    {
        "empId": 9149,
        "rbs": 96.4
    },
    {
        "empId": 8509,
        "rbs": 143.9
    },
    {
        "empId": 8872,
        "rbs": 157.8
    },
    {
        "empId": 8889,
        "rbs": 140.1
    },
    {
        "empId": 9034,
        "rbs": 305.2
    },
    {
        "empId": 729,
        "rbs": 104.2
    },
    {
        "empId": 404309,
        "rbs": 144.4
    },
    {
        "empId": 8998,
        "rbs": 196.7
    },
    {
        "empId": 89546,
        "rbs": 114.4
    },
    {
        "empId": 8128,
        "rbs": 132.4
    },
    {
        "empId": 398783,
        "rbs": 139.3
    },
    {
        "empId": 20909,
        "rbs": 146.7
    },
    {
        "empId": 43194,
        "rbs": 112.1
    },
    {
        "empId": 8925,
        "rbs": 141.5
    },
    {
        "empId": 8101,
        "rbs": 127.2
    },
    {
        "empId": 391534,
        "rbs": 116.1
    },
    {
        "empId": 380211,
        "rbs": 140.5
    },
    {
        "empId": 241,
        "rbs": 94.6
    },
    {
        "empId": 389818,
        "rbs": 151.5
    },
    {
        "empId": 78335,
        "rbs": 147.6
    },
    {
        "empId": 922,
        "rbs": 134.9
    },
    {
        "empId": 123,
        "rbs": 116.3
    },
    {
        "empId": 11934,
        "rbs": 96.5
    },
    {
        "empId": 8816,
        "rbs": 117.4
    },
    {
        "empId": "C31",
        "rbs": 119
    },
    {
        "empId": 64826,
        "rbs": 148.8
    },
    {
        "empId": 670,
        "rbs": 154.9
    },
    {
        "empId": 12346,
        "rbs": 113.4
    },
    {
        "empId": "M-84",
        "rbs": 142.4
    },
    {
        "empId": "C32",
        "rbs": 150.5
    },
    {
        "empId": 81048,
        "rbs": 125.4
    },
    {
        "empId": 10998,
        "rbs": 136.6
    },
    {
        "empId": 391910,
        "rbs": 105.8
    },
    {
        "empId": 354,
        "rbs": 156.3
    },
    {
        "empId": 9142,
        "rbs": 107.7
    },
    {
        "empId": 9050,
        "rbs": 177.5
    },
    {
        "empId": 8032,
        "rbs": 101.5
    },
    {
        "empId": 8478,
        "rbs": 192.8
    },
    {
        "empId": 78393,
        "rbs": 166.7
    },
    {
        "empId": 9155,
        "rbs": 148.3
    },
    {
        "empId": 309,
        "rbs": 152.9
    },
    {
        "empId": 370721,
        "rbs": 104.5
    },
    {
        "empId": 12302,
        "rbs": 108.4
    },
    {
        "empId": "R-635",
        "rbs": 111.4
    },
    {
        "empId": 526,
        "rbs": 125.9
    },
    {
        "empId": 8275,
        "rbs": 122.7
    },
    {
        "empId": 451,
        "rbs": 93
    },
    {
        "empId": "R-484",
        "rbs": 123.7
    },
    {
        "empId": 101,
        "rbs": 118.9
    },
    {
        "empId": 78084,
        "rbs": 98.7
    },
    {
        "empId": 91974,
        "rbs": 112.9
    },
    {
        "empId": 492,
        "rbs": 121.2
    },
    {
        "empId": 167,
        "rbs": 96.4
    },
    {
        "empId": 8267,
        "rbs": 149.2
    },
    {
        "empId": 8379,
        "rbs": 110.1
    },
    {
        "empId": 852,
        "rbs": 120.6
    },
    {
        "empId": 405881,
        "rbs": 139
    },
    {
        "empId": 7799,
        "rbs": 141.2
    },
    {
        "empId": 12797,
        "rbs": 103
    },
    {
        "empId": 8327,
        "rbs": 102.6
    },
    {
        "empId": 91459,
        "rbs": 125.1
    },
    {
        "empId": 424,
        "rbs": 137
    },
    {
        "empId": 381412,
        "rbs": 164.5
    },
    {
        "empId": 9157,
        "rbs": 93.2
    },
    {
        "empId": 382474,
        "rbs": 150.9
    },
    {
        "empId": 45832,
        "rbs": 161
    },
    {
        "empId": 13968,
        "rbs": 96.4
    },
    {
        "empId": 8890,
        "rbs": 151.9
    },
    {
        "empId": 21163,
        "rbs": 139.8
    },
    {
        "empId": 71844,
        "rbs": 119
    },
    {
        "empId": 845,
        "rbs": 148.6
    },
    {
        "empId": 391056,
        "rbs": 148.2
    },
    {
        "empId": 8336,
        "rbs": 104.3
    },
    {
        "empId": 390768,
        "rbs": 141.3
    },
    {
        "empId": 8864,
        "rbs": 165.8
    },
    {
        "empId": "C33",
        "rbs": 124.3
    },
    {
        "empId": 9051,
        "rbs": 139
    },
    {
        "empId": 380828,
        "rbs": 153.8
    },
    {
        "empId": 8000,
        "rbs": 128
    },
    {
        "empId": 8298,
        "rbs": 110.1
    },
    {
        "empId": 9061,
        "rbs": 120.1
    },
    {
        "empId": 8254,
        "rbs": 150.4
    },
    {
        "empId": 7840,
        "rbs": 160.5
    },
    {
        "empId": 8324,
        "rbs": 149.3
    },
    {
        "empId": 12794,
        "rbs": 110
    },
    {
        "empId": 11436,
        "rbs": 136.6
    },
    {
        "empId": 8952,
        "rbs": 115.1
    },
    {
        "empId": 9057,
        "rbs": 100
    },
    {
        "empId": 8937,
        "rbs": 117
    },
    {
        "empId": 9064,
        "rbs": 120.6
    },
    {
        "empId": 73,
        "rbs": 107.8
    },
    {
        "empId": 8071,
        "rbs": 117.9
    },
    {
        "empId": 88,
        "rbs": 131
    },
    {
        "empId": 8719,
        "rbs": 155.9
    },
    {
        "empId": 8915,
        "rbs": 118.2
    },
    {
        "empId": "N-479",
        "rbs": 131.8
    },
    {
        "empId": 9146,
        "rbs": 101.4
    },
    {
        "empId": 8746,
        "rbs": 115.4
    },
    {
        "empId": 8333,
        "rbs": 110.2
    },
    {
        "empId": 8227,
        "rbs": 131.4
    },
    {
        "empId": 397218,
        "rbs": 136.7
    },
    {
        "empId": 1093,
        "rbs": 129.2
    },
    {
        "empId": 8959,
        "rbs": 133.9
    },
    {
        "empId": 28594,
        "rbs": 125
    },
    {
        "empId": 8993,
        "rbs": 100.2
    },
    {
        "empId": 27243,
        "rbs": 149.5
    },
    {
        "empId": 385532,
        "rbs": 177.2
    },
    {
        "empId": 12599,
        "rbs": 179.6
    },
    {
        "empId": 8228,
        "rbs": 118.4
    },
    {
        "empId": 8055,
        "rbs": 189.3
    },
    {
        "empId": 165,
        "rbs": 142.9
    },
    {
        "empId": 380090,
        "rbs": 86.6
    },
    {
        "empId": 8222,
        "rbs": 98.7
    },
    {
        "empId": 358,
        "rbs": 124.5
    },
    {
        "empId": "Itc 3",
        "rbs": 148
    },
    {
        "empId": 8148,
        "rbs": 125
    },
    {
        "empId": 71449,
        "rbs": 171.1
    },
    {
        "empId": "SS-479",
        "rbs": 146.2
    },
    {
        "empId": 8309,
        "rbs": 149
    },
    {
        "empId": 8990,
        "rbs": 389.2
    },
    {
        "empId": 8903,
        "rbs": 140.4
    },
    {
        "empId": 77810,
        "rbs": 180.3
    },
    {
        "empId": 381,
        "rbs": 90.9
    },
    {
        "empId": 8866,
        "rbs": 112.8
    },
    {
        "empId": 302,
        "rbs": 101
    },
    {
        "empId": 653,
        "rbs": 102.9
    },
    {
        "empId": 8971,
        "rbs": 106.2
    },
    {
        "empId": 8984,
        "rbs": 148
    },
    {
        "empId": 377697,
        "rbs": 133.1
    },
    {
        "empId": 32057,
        "rbs": 142.2
    },
    {
        "empId": 9076,
        "rbs": 115.3
    },
    {
        "empId": 7835,
        "rbs": 152.2
    },
    {
        "empId": 9134,
        "rbs": 154.4
    },
    {
        "empId": 78843,
        "rbs": 145.5
    },
    {
        "empId": 8361,
        "rbs": 147
    },
    {
        "empId": 44663,
        "rbs": 132.6
    },
    {
        "empId": 365854,
        "rbs": 136.8
    },
    {
        "empId": 378829,
        "rbs": 101.5
    },
    {
        "empId": 365852,
        "rbs": 89.2
    },
    {
        "empId": 64849,
        "rbs": 148.4
    },
    {
        "empId": 392808,
        "rbs": 148.7
    },
    {
        "empId": 387293,
        "rbs": 109.1
    },
    {
        "empId": 12079,
        "rbs": 107.6
    },
    {
        "empId": 9026,
        "rbs": 195.7
    },
    {
        "empId": 90347,
        "rbs": 148.3
    },
    {
        "empId": 8717,
        "rbs": 110.2
    },
    {
        "empId": "R-46",
        "rbs": 123.4
    },
    {
        "empId": 370645,
        "rbs": 108.4
    },
    {
        "empId": 274,
        "rbs": 131.6
    },
    {
        "empId": 35839,
        "rbs": 146
    },
    {
        "empId": 8093,
        "rbs": 183
    },
    {
        "empId": 365,
        "rbs": 111.2
    },
    {
        "empId": 64843,
        "rbs": 103.9
    },
    {
        "empId": 9097,
        "rbs": 101.4
    },
    {
        "empId": 389815,
        "rbs": 96.9
    },
    {
        "empId": 8973,
        "rbs": 131.8
    },
    {
        "empId": 8554,
        "rbs": 115.3
    },
    {
        "empId": 20908,
        "rbs": 146.1
    },
    {
        "empId": 80029,
        "rbs": 123.8
    },
    {
        "empId": "SS-630",
        "rbs": 97.2
    },
    {
        "empId": 92517,
        "rbs": 138.5
    },
    {
        "empId": 8737,
        "rbs": 104.9
    },
    {
        "empId": "M-715",
        "rbs": 118.7
    },
    {
        "empId": "C34",
        "rbs": 144
    },
    {
        "empId": 12304,
        "rbs": 142.7
    },
    {
        "empId": 8375,
        "rbs": 130.6
    },
    {
        "empId": 12280,
        "rbs": 149.8
    },
    {
        "empId": 8437,
        "rbs": 183.1
    },
    {
        "empId": 405406,
        "rbs": 106.4
    },
    {
        "empId": 927,
        "rbs": 128.5
    },
    {
        "empId": 43220,
        "rbs": 106.4
    },
    {
        "empId": 380040,
        "rbs": 113.8
    },
    {
        "empId": "C35",
        "rbs": 112.4
    },
    {
        "empId": 12616,
        "rbs": 179.6
    },
    {
        "empId": 447,
        "rbs": 145.8
    },
    {
        "empId": 75131,
        "rbs": 121.8
    },
    {
        "empId": 15379,
        "rbs": 102.4
    },
    {
        "empId": 17653,
        "rbs": 132.3
    },
    {
        "empId": 9080,
        "rbs": 98.1
    },
    {
        "empId": 7931,
        "rbs": 141.3
    },
    {
        "empId": 8210,
        "rbs": 107.8
    },
    {
        "empId": "SS-589",
        "rbs": 118.3
    },
    {
        "empId": "SA95T",
        "rbs": 118.5
    },
    {
        "empId": 95853,
        "rbs": 137.7
    },
    {
        "empId": 8800,
        "rbs": 153.1
    },
    {
        "empId": 675,
        "rbs": 132.4
    },
    {
        "empId": 369902,
        "rbs": 122.7
    },
    {
        "empId": 8504,
        "rbs": 155.2
    },
    {
        "empId": 43221,
        "rbs": 109
    },
    {
        "empId": 389817,
        "rbs": 92.1
    },
    {
        "empId": 20317,
        "rbs": 93.7
    },
    {
        "empId": 8943,
        "rbs": 102.5
    },
    {
        "empId": 369904,
        "rbs": 138.7
    },
    {
        "empId": 94324,
        "rbs": 129.9
    },
    {
        "empId": 62361,
        "rbs": 141.3
    },
    {
        "empId": 8569,
        "rbs": 139.3
    },
    {
        "empId": 8877,
        "rbs": 130.7
    },
    {
        "empId": 8964,
        "rbs": 120.5
    },
    {
        "empId": 812,
        "rbs": 154.8
    }
]