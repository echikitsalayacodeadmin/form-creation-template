import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import CustomAutocomplete from "../assets/customAutocomplete";
import { Box, Button, Typography } from "@mui/material";
import { saveData } from "../assets/services/PostApiCall";
import { useSnackbar } from "notistack";
import { saveAs } from "file-saver";

const sortDepartments = (departments) => {
  return departments.sort((a, b) => a.localeCompare(b));
};

const handleDownload = async (url, employeeID) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    saveAs(blob, `${employeeID}.pdf`);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

const UltratechDepartmentWise = ({
  corpId = "3ee08e3d-1d0e-4f2e-bf25-43f7d4560347",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      setEmployeeList(result.data.filter((item) => item.date));
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const fetchDepartment = async () => {
    const url = `https://apibackend.uno.care/api/org/departments?corpId=${corpId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      setDepartmentList(result.data);
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const filterEmployeesByDepartment = useMemo(() => {
    return employeeList.filter(
      (item) => item.department === selectedDepartment
    );
  }, [selectedDepartment, employeeList]);

  const downloadEmployeeReport = async (employeeID) => {
    const url = `https://apibackend.uno.care/api/org/print/tests`;
    const payload = {
      corpId: corpId,
      empId: employeeID,
    };

    try {
      const printData = await saveData(url, payload, "");
      if (printData.error) {
        enqueueSnackbar(`No tests found for employee ID: ${employeeID}`, {
          variant: "error",
        });
        console.log({ error: printData.error });
      } else {
        handleDownload(printData.data, employeeID);
        setDownloadCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log("Error downloading report:", error);
      enqueueSnackbar(
        `Error downloading report for employee ID: ${employeeID}`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleDownloadReports = async () => {
    setIsLoading(true);
    setDownloadCount(0);
    for (const employee of filterEmployeesByDepartment) {
      await downloadEmployeeReport(employee.empId);
    }
    setIsLoading(false);
  };

  return (
    <Fragment>
      <Box sx={{ m: 2, p: 2 }}>
        <CustomAutocomplete
          label={"Select Department"}
          getOptionLabel={(option) => option}
          options={sortDepartments(departmentList)}
          value={selectedDepartment}
          onChange={(event, newValue, reason) => {
            setSelectedDepartment(newValue);
            if (reason === "clear") {
              setSelectedDepartment("");
            }
          }}
        />
        <Typography sx={{ marginBlock: 2 }}>
          Total Employees : {employeeList.length}
        </Typography>
        <Typography sx={{ marginBlock: 2 }}>
          Total Employees of{" "}
          <span style={{ color: "red", textDecorationLine: "underline" }}>
            {selectedDepartment}
          </span>{" "}
          Department: {filterEmployeesByDepartment.length}
        </Typography>
        <Typography sx={{ marginBlock: 2 }}>
          Downloaded Reports: {downloadCount}
        </Typography>

        <Button
          variant="contained"
          onClick={handleDownloadReports}
          disabled={isLoading || !selectedDepartment}
          sx={{ marginBlock: 2 }}
        >
          {isLoading ? "Downloading..." : "Start Downloading"}
        </Button>
      </Box>
    </Fragment>
  );
};

export default UltratechDepartmentWise;
