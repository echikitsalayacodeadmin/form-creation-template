import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  LinearProgress,
} from "@mui/material";
import { downloadCsv } from "./exportCsv";
import useAutomationBatch from "./useAutomationBatch";
import React, { useState } from "react";

export default function BatchAutomationDashboard() {
  const { results, startBatch, inProgress } = useAutomationBatch();
  const [mobileListText, setMobileListText] = useState("");
  const [otp, setOtp] = React.useState("");

  const handleRun = () => {
    const numbers = mobileListText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    startBatch(numbers, otp);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Batch Automation 🚀</Typography>

          <TextField
            label="Mobile Numbers (one per line)"
            fullWidth
            multiline
            minRows={6}
            sx={{ my: 2 }}
            value={mobileListText}
            onChange={(e) => setMobileListText(e.target.value)}
          />

          <TextField
            label="OTP (same for all)"
            fullWidth
            sx={{ mb: 2 }}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleRun}
            disabled={inProgress}
          >
            {inProgress ? "Processing..." : "Start Batch"}
          </Button>

          {inProgress && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="caption">
                Processed {results.length} numbers…
              </Typography>
            </Box>
          )}

          {results.length > 0 && !inProgress && (
            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={() => downloadCsv(results)}
            >
              Download CSV 📥
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
