import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";

const CustomAutocomplete = ({
  multiple,
  disableClearable,
  disabled,
  options,
  label,
  placeholder,
  value,
  onChange,
  getOptionLabel,
  renderOption,
  asterickColor,
  required,
  helperText,
  onInputChange,
  freeSolo,
  error,
  styles,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Autocomplete
      multiple={multiple}
      disableClearable={disableClearable}
      disabled={disabled}
      fullWidth
      size="small"
      options={options}
      getOptionLabel={
        getOptionLabel ? getOptionLabel : (option) => `${option.label}`
      }
      value={value}
      onChange={onChange}
      freeSolo={freeSolo}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            ...styles,
            borderRadius: "15px",
            background: "#fff",
            color: "#127DDD",
            fontWeight: "500",
            fontSize: "13px",
            lineHeight: " 15px",
            "& input::placeholder": {
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              lineHeight: " 15px",
            },
            "& .MuiFormLabel-asterisk": {
              color: asterickColor,
            },
          }}
          required={required}
          label={label}
          variant="outlined"
          placeholder={placeholder}
          size="small"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            type: "Search Value",
          }}
        />
      )}
      renderOption={
        renderOption ? (props, option) => renderOption(props, option) : null
      }
    />
  );
};

export default CustomAutocomplete;
