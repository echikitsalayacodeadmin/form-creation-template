import React from "react";
import Papa from "papaparse";


// ✅ Deep clean function
export function cleanObject(obj) {
    if (Array.isArray(obj)) {
        const cleanedArray = obj
            .map(cleanObject)
            .filter(
                (item) =>
                    item !== undefined &&
                    item !== null &&
                    item !== "" &&
                    !(typeof item === "object" && Object.keys(item).length === 0)
            );

        return cleanedArray.length ? cleanedArray : undefined;
    }

    if (typeof obj === "object" && obj !== null) {
        const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
            const cleanedValue = cleanObject(value);

            if (
                cleanedValue !== undefined &&
                cleanedValue !== null &&
                cleanedValue !== "" &&
                !(typeof cleanedValue === "object" &&
                    Object.keys(cleanedValue).length === 0)
            ) {
                acc[key] = cleanedValue;
            }

            return acc;
        }, {});

        return Object.keys(cleanedObj).length ? cleanedObj : undefined;
    }

    // remove empty string with spaces
    if (typeof obj === "string") {
        const trimmed = obj.trim();
        return trimmed === "" ? undefined : trimmed;
    }

    return obj;
}

// ✅ Transform CSV row into structured object
export function transformCsvRow(row) {
    const result = {
        cholestrolData: {},
        healthHistoryFormData: {},
        remarks: {},
    };

    Object.keys(row).forEach((key) => {
        const value = row[key];

        // cholestrolData fields
        if (key.startsWith("cholestrolData.")) {
            const subKey = key.replace("cholestrolData.", "");

            if (subKey.startsWith("URINE_PROBLEMS.")) {
                const urineKey = subKey.replace("URINE_PROBLEMS.", "");

                if (!result.cholestrolData.URINE_PROBLEMS) {
                    result.cholestrolData.URINE_PROBLEMS = {};
                }

                result.cholestrolData.URINE_PROBLEMS[urineKey] = value;
            } else {
                result.cholestrolData[subKey] = value;
            }
        }

        // healthHistoryFormData fields
        else if (key.startsWith("healthHistoryFormData.")) {
            const subKey = key.replace("healthHistoryFormData.", "");
            result.healthHistoryFormData[subKey] = value;
        }

        // remarks fields
        else if (key.startsWith("remarks.")) {
            const subKey = key.replace("remarks.", "");
            result.remarks[subKey] = value;
        }

        // normal fields
        else {
            result[key] = value;
        }
    });

    return result;
}

const AhcBulkUploadData = () => {
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const csvData = results.data;

                // Step 1: Transform raw rows
                const transformedData = csvData.map((row) =>
                    transformCsvRow(row)
                );

                // Step 2: Clean & format
                const finalData = transformedData.map((item) => {
                    const { PFT, ...rest } = item;
                    const pftValue = item?.cholestrolData?.PFT;
                    const cleanedCholesterolData = {
                        ...item?.cholestrolData,
                    };

                    // remove "/" from string values
                    Object.keys(cleanedCholesterolData).forEach((key) => {
                        const value = cleanedCholesterolData[key];

                        if (typeof value === "string") {
                            cleanedCholesterolData[key] = value.replace(/\//g, "");
                        }
                    });

                    let finalObj = {
                        ...rest,
                        eyeSightWithGlasses: item?.eyeSightWithGlasses === "TRUE" ? true : item?.eyeSightWithGlasses === "FALSE" ? false : "",
                        cholestrolData: {
                            ...cleanedCholesterolData,
                            PFT: pftValue,
                        },
                        healthHistoryFormData: item.healthHistoryFormData,
                        remarks: item.remarks,
                    };

                    // ✅ FINAL CLEAN
                    finalObj = cleanObject(finalObj);

                    return finalObj;
                }).map((item) => {
                    const { bloodSampleCollected, pft, ecg, xrayDone, eyeTest, ...rest } = item;

                    let finalObj = {
                        ...rest,
                        eyeTest:
                            item?.eyeTest === "Yes"
                                ? true
                                : item?.eyeTest === "No"
                                    ? false
                                    : null,
                        bloodSampleCollected:
                            item?.bloodSampleCollected === "Yes"
                                ? true
                                : item?.bloodSampleCollected === "No"
                                    ? false
                                    : null,
                        pft:
                            item?.pft === "Yes"
                                ? true
                                : item?.pft === "No"
                                    ? false
                                    : null,
                        ecg:
                            item?.ecg === "Yes"
                                ? true
                                : item?.ecg === "No"
                                    ? false
                                    : null,
                        xrayDone:
                            item?.xrayDone === "Yes"
                                ? true
                                : item?.xrayDone === "No"
                                    ? false
                                    : null,
                        urineSampleCollected:
                            item?.urineSampleCollected === "Yes"
                                ? true
                                : item?.urineSampleCollected === "No"
                                    ? false
                                    : null,
                        stoolSampleCollected:
                            item?.stoolSampleCollected === "Yes"
                                ? true
                                : item?.stoolSampleCollected === "No"
                                    ? false
                                    : null,
                        audiometryDone:
                            item?.audiometryDone === "Yes"
                                ? true
                                : item?.audiometryDone === "No"
                                    ? false
                                    : null,
                    };

                    return cleanObject(finalObj); // ✅ correct
                });

                console.log("Original CSV Data:", csvData);
                console.log("Transformed Data:", finalData);
            },
        });
    };


    const cleanObject = (obj) => {
        if (Array.isArray(obj)) {
            return obj
                .map(cleanObject)
                .filter(
                    (item) =>
                        item !== null &&
                        item !== undefined &&
                        item !== "" &&
                        !(typeof item === "object" && Object.keys(item).length === 0)
                );
        }

        if (typeof obj === "object" && obj !== null) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                const cleanedValue = cleanObject(value);

                const isEmptyObject =
                    typeof cleanedValue === "object" &&
                    cleanedValue !== null &&
                    !Array.isArray(cleanedValue) &&
                    Object.keys(cleanedValue).length === 0;

                if (
                    cleanedValue !== null &&
                    cleanedValue !== undefined &&
                    cleanedValue !== "" &&
                    !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
                    !isEmptyObject
                ) {
                    acc[key] = cleanedValue;
                }

                return acc;
            }, {});
        }

        return obj;
    };






    return (
        <div style={{ padding: 20 }}>
            <h3>Upload AHC CSV</h3>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default AhcBulkUploadData;