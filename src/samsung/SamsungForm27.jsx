import React, { Fragment, useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import SamsungForm27Template from "./SamsungForm27Template";

const SamsungForm27 = ({
    corpId = '33525031-d147-41e3-8dc6-c330be785f88',
    campCycleId = '428775',
    fileType = "ANNEXURE",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [errorEmpCount, setErrorEmpCount] = useState(0);
    const [errorEmpIDs, setErrorEmpIDs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const generatePDF = async (data) => {
        try {
            const pdfBlob = await pdf(
                <SamsungForm27Template data={data} />
            ).toBlob();

            // const url2 = URL.createObjectURL(pdfBlob);
            // window.open(url2, "_blank");

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_FORM27.pdf`);

            const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await uploadFile(url, formData);

            if (result?.data) {
                enqueueSnackbar(`Form 27 uploaded for ${data.empId}`, {
                    variant: "success",
                });
                setUploadedCount((prev) => prev + 1);
            } else {
                enqueueSnackbar(`Upload failed for ${data.empId}`, {
                    variant: "error",
                });
                setErrorEmpCount((prev) => prev + 1);
                setErrorEmpIDs((prev) => [...prev, data.empId]);
            }
        } catch (error) {
            console.error("Error generating/uploading Form 27:", error);
            enqueueSnackbar(`Error for ${data?.empId}`, { variant: "error" });
            setErrorEmpCount((prev) => prev + 1);
            setErrorEmpIDs((prev) => [...prev, data.empId]);
        }
    };

    const fetchListOfEmployees = async () => {
        if (!corpId || !campCycleId) {
            enqueueSnackbar("Set corpId and campCycleId props.", { variant: "warning" });
            setList([]);
            setTotalEmployees(0);
            return;
        }

        const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const temp = result.data.filter((item) => ([18793761, 11327, 11376, 12548470, 18788045, 11631740, 18788057, 13641809, 12590901, 19536795, 18788902, 19508423, 10585875, 19522199, 14802865, 22520320, 6597688, 17800295, 17771656, 12507850, 13642428, 19508495, 19508508, 18788139, 6630893, 11572902, 97527996, 11574729, 8749471, 13532423, 97526700, 17787952, 11560551, 19508618, 19512816, 19510362, 19523545, 15767399, 17783524, 19523547, 18787959, 18798490, 11547782, 18798444, 19510366, 13646610, 26502507, 11524784, 13646969, 13646607, 11594614, 22527034, 13646972, 14574994, 19520224, 11593563, 19512818, 19522190, 8531481, 16806915, 15804048, 17812651, 17765245, 17775059, 13629783, 13688264, 11543916, 11548802, 11593537, 17796849, 19535083, 19520377, 12505648, 19520421, 19522410, 15833675, 18802594, 11553159, 19517408, 17787985, 11594616, 19527286, 16783312, 17800373, 17780449, 19536817, 25518630, 26513667, 11537106, 18787958, 12565874, 20529704, 19522152, 16807296, 16791373, 18788078, 19503267, 13530424, 11529008, 11551276, 19517402, 13530462, 17756848, 13641727, 13672628, 13646679, 15756971, 11590834, 12508264, 17799073, 11521817, 15840509, 7801301, 19522176, 19503222, 19522189, 15767409, 14569874, 18803728, 11537296, 6555324, 13658403, 17809610, 14501799, 12590906, 18788112, 11553179, 11547793, 15816207, 12507570, 1597166, 17780443, 13646706, 12505765, 17812626, 18799837, 17771628, 11528538, 10517061, 11521839, 7692833, 7630651, 19522210, 11553145, 11578925, 11631854, 11558463, 13627572, 19512839, 12542938, 15767395, 19522213, 13519148, 17775036, 13630023, 13630016, 17788005, 19512840, 19510397, 11529013, 11524899, 19517114, 17812658, 26501058, 11539688, 11537026, 11623484, 12578094, 15797942, 11552573, 13519698, 17775061, 17775062, 19510185, 19503251, 17775020, 21513536, 11521830, 11595322, 13658077, 13646856, 11588949, 14578481, 17771658, 17780423, 13646854, 11590079, 11601317, 19520297, 13646862, 19523573, 17800293, 8550047, 11541292, 17799044, 1558243, 26504820, 17766403, 19508450, 5747966, 18788062, 11593561, 13646853, 11537284, 13594322, 17783486, 4520187, 17765219, 17771690, 12505746, 11593798, 11555334, 12566280, 19522276, 15804085, 19510420, 18793781, 7630753, 17796851, 1625087, 11578943, 7692071, 15816235, 3586194, 18783440, 11537963, 15797048, 11541084, 16806935, 19504872, 19520336, 22538424, 17812643, 18788100, 10537660, 19503286, 19522316, 13629870, 16807756, 13651556, 8507717, 7583906, 19520351, 97526891, 17765288, 11560478, 11541375, 11524234, 19522329, 8642306, 12507848, 10544216, 17796832, 11576607, 11560683, 10517194, 17780789, 11572736, 11589650, 19523423, 13646570, 6719955, 7775486, 18798496, 19510441, 18787992, 12576954, 14504172, 11537099, 10537533, 13532432, 1625065, 19535107, 17787969, 19510450, 19510446, 17754278, 18798499, 6719966, 11543921, 11591193, 18803727, 18798358, 13646568, 19510452, 19530161, 11543953, 12502716, 18798467, 17788031, 19522383, 11543972, 19508468, 8533695, 16807757, 15833742, 19510453, 6581959, 13638634, 13660939, 11593538, 7706550, 17800368, 5748265, 11548769, 15833781, 11529018, 19522396, 10572894, 2516543, 19508469, 15809145, 11572847, 14504225, 17796820, 14567916, 14503983, 19520409, 26513635, 19520410, 26506870, 11576188, 8500001, 19504869, 17766406, 19510466, 19517405, 19510470, 19503193, 17771643, 12547135, 7774723, 19503194, 10510032, 18798503, 11524781, 540794, 11548770, 17780458, 11573449, 17788046, 14533330, 19508473, 11594603, 13658089, 11539697, 7630742, 17788047, 8652673, 18796102, 19520436, 11587667, 19535088, 17765248, 17780431, 5748196, 17757509, 13584505, 18788121, 17800306, 11590080, 9530424, 9542402, 13688011, 13629664, 19536823, 19522451, 17809609, 19503302, 18798482, 17783454, 11541576, 12588165, 13646807, 19522457, 10516561, 11547293, 1506463, 19510487, 17783512, 19522472, 19527302, 11528516, 17756852, 13629847, 19523602, 13530454, 7765517, 13629358, 13689953, 14533326, 19522469, 7773071, 17780405, 17780432, 19523410, 14554515, 17812620, 19535106, 11576940, 11523910, 13646702, 13533594, 11573466, 18798479, 17771683, 19527282, 16783334, 17788193, 19523612, 19521325, 1625043, 19520491, 19522490, 17788190, 11610556, 17796840, 19520499, 11594601, 19536801, 19525403, 17812681, 16780607, 17812682, 17765277, 11576960, 11560487, 17800331, 18793824, 19510503, 18793825, 11524016, 18788072, 19522507, 97529492, 17799020, 11523683, 1625076, 10574887, 19520514, 6630735, 9540154, 18788133, 10537531, 11543782, 13530439, 13658235, 12538414, 12576876, 15833595, 17768882, 19522518, 4666357, 19520519, 19503148, 19510500, 19536815, 11525425, 10575021, 19536816, 17771673, 12564557, 19503146, 17787956, 13519401, 19522523, 20530883, 15803488, 18788022, 19536802, 19522527, 17808669, 17780489, 18777893, 19523733, 13519728, 13646422, 10504206, 17799051, 5748378, 18788029, 16784689, 13687999, 16764190, 10544252, 13531943, 11576442, 5663570, 10515586, 11530834, 19508510, 19510525, 13646763, 11547814, 13676486, 7775442, 19503158, 17761959, 19510531, 12508265, 18788032, 19512837, 17795554, 1625054, 11634664, 6648062, 12507818, 19520548, 15838702, 19507505, 6575264, 11537297, 11548808, 19527330, 19517355, 15757013, 13646839, 14504949, 7775464, 19508512, 18788039, 10553503, 507222, 17788224, 18802194, 11539685, 17788210, 17771691, 19508497, 5748094, 13629360, 11631907, 13646814, 7888337, 19522574, 2516510, 5662691, 19517401, 17788186, 19520561, 16755051, 13532461, 11524898, 17788217, 11600999, 18788044, 17788185, 17804357, 13646808, 11530401, 11578928, 14574992].map((item) => String(item)).includes(item.empId)));
            const sorted = sortDataByName(temp);
            setList(sorted);
            setTotalEmployees(sorted.length);
            return;
        }

        enqueueSnackbar("Error fetching employee list", { variant: "error" });
        setList([]);
        setTotalEmployees(0);
    };

    useEffect(() => {
        fetchListOfEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [corpId, campCycleId]);



    const handleGeneratePDFs = async () => {
        if (!list.length) {
            enqueueSnackbar("No employees found.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);
        setErrorEmpCount(0);
        setErrorEmpIDs([]);

        for (let i = 0; i < list.length; i += 1) {
            await generatePDF(list[i]);
        }

        setIsProcessing(false);
    };

    const deleteFiles = async (data) => {
        const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
        const result = await updateData(url);

        if (result?.data) {
            enqueueSnackbar(`Deleted ${data.empId}`, { variant: "success" });
        } else {
            enqueueSnackbar(`Delete failed for ${data.empId}`, { variant: "error" });
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i += 1) {
            await deleteFiles(list[i]);
        }
    };

    return (
        <Fragment>
            <div>
                <h3>Samsung Form 27 Health Register</h3>
                <div>corpId: {corpId || "-"}</div>
                <div>campCycleId: {campCycleId || "-"}</div>
                <br />
                <button onClick={handleGeneratePDFs} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Start Generating"}
                </button>{" "}
                <button onClick={handleDeletePDF} disabled={isProcessing}>
                    Delete Files
                </button>
                <div>Total Employees: {totalEmployees}</div>
                <div>Uploaded Files: {uploadedCount}</div>
                <div>Error Files: {errorEmpCount}</div>
                <div>Error EmpIDs: {errorEmpIDs.join(", ")}</div>
                <div>Non Signature: {list.filter((item) => !item.signatureUrl).map((item) => item.empId).join(",")}</div>
                <br />
                {list.map((item, index) => (
                    <div key={item.empId || index}>
                        {index + 1}. {item.empId} - {item.name} Nature of work: {item.subDepartment} Xray -{item.xrayUrl ? "Yes" : "No"} :
                        <a href={item.annexureUrl}>{item.annexureUrl}</a>
                        <br />
                    </div>
                ))}
            </div>

            {list[0] && (
                <PDFViewer style={{ width: "100%", height: "calc(100vh - 220px)" }}>
                    <SamsungForm27Template data={list[0]} />
                </PDFViewer>
            )}
        </Fragment>
    );
};

export default SamsungForm27;
