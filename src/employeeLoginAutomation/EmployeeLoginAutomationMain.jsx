import { Box, Container, Grid, Typography } from "@mui/material";
import { Fragment } from "react";
import AutomationReport from "./AutomationReport";
import BatchAutomationDashboard from "./BatchAutomationDashboard";

const mobileList = ["234234234", "2342342342", "23423423423"];

function isValidMobileNumber(mobile) {
  return /^\d{10}$/.test(mobile);
}

const EmployeeLoginAutomationMain = () => {
  console.log({ validMobile: isValidMobileNumber("2342342341") });

  return (
    <Fragment>
      <Container maxWidth={false}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h6">Generate Login Report</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <AutomationReport />

              <BatchAutomationDashboard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
};

export default EmployeeLoginAutomationMain;
