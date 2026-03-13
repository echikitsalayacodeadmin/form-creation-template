import React from "react";
import Papa from "papaparse";

export function transformCsvRow(row) {
    const result = {
        cholestrolData: {},
        healthHistoryFormData: {},
    };

    Object.keys(row).forEach((key) => {
        const value = row[key];

        // cholestrolData fields
        if (key.startsWith("cholestrolData.")) {
            const subKey = key.replace("cholestrolData.", "");

            // URINE_PROBLEMS nested object
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

        // normal fields
        else {
            result[key] = value;
        }
    });

    return result;
}
const AhcBulkUploadData = () => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            header: true, // converts CSV rows to objects
            skipEmptyLines: true,
            complete: (results) => {
                const csvData = results.data;

                // transform each row
                const transformedData = csvData.map((row) => transformCsvRow(row));

                console.log("Original CSV Data:", csvData);
                console.log(
                    "Transformed Data:",
                    transformedData?.map((item) => {
                        const { PFT, ...rest } = item;

                        const cleanedCholesterolData = { ...item?.cholestrolData };

                        Object.keys(cleanedCholesterolData).forEach((key) => {
                            const value = cleanedCholesterolData[key];

                            if (typeof value === "string") {
                                cleanedCholesterolData[key] = value.replace(/\//g, "");
                            }
                        });

                        return {
                            ...rest,
                            eyeSightWithGlasses: item?.eyeSightWithGlasses === "TRUE",
                            cholestrolData: {
                                ...cleanedCholesterolData,
                                PFT,
                            },
                        };
                    })
                );
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