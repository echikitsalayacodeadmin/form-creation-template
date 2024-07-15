import * as React from "react";
import {
  DataGrid,
  GridPagination,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  gridFilteredSortedRowIdsSelector,
  gridPageCountSelector,
  gridRowTreeSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";
// import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, createSvgIcon } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";

function customCheckbox(theme) {
  return {
    "& .MuiCheckbox-root svg": {
      width: 16,
      height: 16,
      backgroundColor: "transparent",
      border: `1px solid ${
        theme.palette.mode === "light" ? "#d9d9d9" : "rgb(67, 67, 67)"
      }`,
      borderRadius: 2,
    },
    "& .MuiCheckbox-root svg path": {
      display: "none",
    },
    "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
      backgroundColor: "#1890ff",
      borderColor: "#1890ff",
    },
    "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
      position: "absolute",
      display: "table",
      border: "2px solid #fff",
      borderTop: 0,
      borderLeft: 0,
      transform: "rotate(45deg) translate(-50%,-50%)",
      opacity: 1,
      transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
      content: '""',
      top: "50%",
      left: "39%",
      width: 5.71428571,
      height: 9.14285714,
    },
    "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after":
      {
        width: 8,
        height: 8,
        backgroundColor: "#1890ff",
        transform: "none",
        top: "39%",
        border: 0,
      },
  };
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === "light"
      ? "rgba(0,0,0,.85)"
      : "rgba(255,255,255,0.85)",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  //   "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
  //     borderRight: `1px solid ${theme.palette.mode === "light" ? "#f0f0f0" : "#303030"}`,
  //   },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${
      theme.palette.mode === "light" ? "#C0C0C0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-cell": {
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.65)",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },

  ...customCheckbox(theme),
}));

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
      renderItem={(item) => (
        <PaginationItem
          type="last"
          slots={{
            previous: () => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowBackIcon />
                <Typography sx={{ marginLeft: "10px" }}>Previous</Typography>
              </Box>
            ),
            next: () => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ marginRight: "10px" }}>Next</Typography>
                <ArrowForwardIcon />
              </Box>
            ),
          }}
          {...item}
        />
      )}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const PAGE_SIZE = 11;

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const getRowsWithGroups = ({ apiRef }) =>
    gridFilteredSortedRowIdsSelector(apiRef);

  const getRowsWithoutGroups = ({ apiRef }) => {
    const rows = gridFilteredSortedRowIdsSelector(apiRef);
    const tree = gridRowTreeSelector(apiRef);
    return rows.filter((rowId) => tree[rowId].type !== "group");
  };

  const ExportIcon = createSvgIcon(
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
    "SaveAlt"
  );

  const handleExport = (options) => apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps = {
    color: "primary",
    size: "small",
    startIcon: <ExportIcon />,
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getRowsWithoutGroups })}
      >
        Download
      </Button>
    </GridToolbarContainer>
  );
}

const CustomDataGridLayout = ({
  selectedColumns,
  Gridheight,
  hideFooterPagination,
  initialState,
  columns,
  rows,
  getRowId,
  selectionModel,
  onSelectionModelChange,
  keepNonExistentRowsSelected,
  onRowSelectionModelChange,
  disableSelectionOnClick,
  disableRowSelectionOnClick,
  onCellClick,
  rowHeight,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  checkboxSelection = true,
  getRowClassName,
  editMode,
  processRowUpdate,
  rowModesModel,
  onRowModesModelChange,
  onRowEditStop,
  styles,
}) => {
  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: PAGE_SIZE,
  //   page: 0,
  // });
  const customRowStyles = ({ highlighted }) => ({
    backgroundColor: highlighted ? "red" : "green", // Change this to your desired color
  });

  return (
    <React.Fragment>
      <Box
        style={{
          width: "100%",
        }}
      >
        <StyledDataGrid
          sx={{
            height: Gridheight ? Gridheight : "71vh",
            ...styles,
          }}
          rowHeight={rowHeight}
          hideFooterPagination={hideFooterPagination}
          checkboxSelection={checkboxSelection}
          slots={{
            pagination: CustomPagination,
            toolbar: CustomToolbar,
          }}
          getRowId={getRowId}
          rows={rows}
          columns={columns}
          initialState={initialState}
          onCellClick={onCellClick}
          disableSelectionOnClick={disableSelectionOnClick}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          selectionModel={selectionModel}
          onRowSelectionModelChange={onRowSelectionModelChange}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          getRowClassName={(params) => {
            const snoCount = rows.filter(
              (row) => row.sno === params.row.sno
            )?.length;
            // const employeeIdCount = rows.filter(
            //   (row) => row.employeeid === params.row.employeeid
            // )?.length;

            return params.row.employeeid === "" ||
              params.row.sno === "" ||
              params.row.name === "" ||
              params.row.foundInDb === false ||
              snoCount > 1
              ? //  ||
                // employeeIdCount > 1
                "error"
              : "";
          }}
          editMode={editMode}
          processRowUpdate={processRowUpdate}
          rowModesModel={rowModesModel}
          onRowModesModelChange={onRowModesModelChange}
          onRowEditStop={onRowEditStop}
        />
      </Box>
    </React.Fragment>
  );
};

export default CustomDataGridLayout;
