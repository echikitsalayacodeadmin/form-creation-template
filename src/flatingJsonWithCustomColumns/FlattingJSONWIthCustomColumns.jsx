import React, { Fragment, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import Papa from "papaparse";
import { saveAs } from "file-saver";

// helper: flatten nested objects
const flattenObject = (obj, parentKey = "", res = {}) => {
  for (let key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const propName = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, propName, res);
    } else {
      res[propName] = value;
    }
  }
  return res;
};

const FlattingCSVWithCustomColumns = () => {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);

  // handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rawData = results.data;

        // try parsing JSON-like strings in each row
        const parsedData = rawData.map((row) => {
          let parsedRow = { ...row };
          for (let key in parsedRow) {
            if (typeof parsedRow[key] === "string") {
              try {
                const parsed = JSON.parse(parsedRow[key]);
                if (typeof parsed === "object") {
                  parsedRow[key] = parsed;
                }
              } catch {
                // not JSON, keep as string
              }
            }
          }
          return parsedRow;
        });

        // collect all unique keys (top-level only for selection UI)
        const allKeys = Array.from(
          new Set(parsedData.flatMap((row) => Object.keys(row)))
        );

        setCsvData(parsedData);
        setColumns(allKeys);
      },
    });
  };

  // get flattened data with union of all unique keys
  const getFlattenedData = () => {
    if (!selectedCols.length) return [];

    let flattenedRows = csvData.map((row) => {
      let newRow = {};
      for (let col of selectedCols) {
        const val = row[col];
        if (val && typeof val === "object" && !Array.isArray(val)) {
          const flat = flattenObject(val, col);
          Object.assign(newRow, flat);
        } else {
          newRow[col] = val ?? "";
        }
      }
      return newRow;
    });

    // build union of all keys across rows
    const allKeys = Array.from(
      new Set(flattenedRows.flatMap((r) => Object.keys(r)))
    );

    // normalize rows so each has all keys
    const normalizedRows = flattenedRows.map((row) => {
      let fullRow = {};
      for (let key of allKeys) {
        fullRow[key] = row[key] ?? "";
      }
      return fullRow;
    });

    return normalizedRows;
  };

  // download as CSV or JSON
  const handleDownload = (format = "csv") => {
    let flattened = getFlattenedData();
    if (!flattened.length) {
      alert("No data to download");
      return;
    }

    console.log("Sample flattened row:", flattened[0]);

    let blob;
    if (format === "json") {
      blob = new Blob([JSON.stringify(flattened, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, "flattened.json");
    } else if (format === "csv") {
      const csvContent = Papa.unparse(flattened);
      blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "flattened.csv");
    }
  };

  return (
    <Fragment>
      <Card sx={{ maxWidth: 700, margin: "20px auto", p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            CSV Flattener with Custom Columns
          </Typography>

          <Box sx={{ my: 2 }}>
            <Button variant="contained" component="label">
              Upload CSV File
              <input
                type="file"
                hidden
                accept=".csv,text/csv"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          {columns.length > 0 && (
            <Autocomplete
              multiple
              options={columns}
              getOptionLabel={(option) => option}
              value={selectedCols}
              onChange={(e, newValue) => setSelectedCols(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Columns" />
              )}
              sx={{ my: 2 }}
            />
          )}

          {selectedCols.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownload("csv")}
              >
                Download CSV
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDownload("json")}
              >
                Download JSON
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default FlattingCSVWithCustomColumns;
