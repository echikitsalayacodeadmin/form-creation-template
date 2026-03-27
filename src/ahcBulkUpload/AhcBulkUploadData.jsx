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
                            PFT,
                        },
                        healthHistoryFormData: item.healthHistoryFormData,
                        remarks: item.remarks,
                    };

                    // ✅ FINAL CLEAN
                    finalObj = cleanObject(finalObj);

                    return finalObj;
                })?.filter((item) => item?.cholestrolData);

                console.log("Original CSV Data:", csvData);
                console.log("Transformed Data:", finalData);
            },
        });
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