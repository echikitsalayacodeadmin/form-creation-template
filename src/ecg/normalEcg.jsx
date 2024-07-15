import { Button, TextField } from "@mui/material";
import React, { Fragment, useState } from "react";

const NormalEcg = () => {
  const [id, setId] = useState("");
  return (
    <Fragment>
      <TextField
        size="small"
        fullWidth
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      <Button variant="contained">Create ECG Report</Button>
    </Fragment>
  );
};

export default NormalEcg;
