export const downloadCsv = (data) => {
  const header = Object.keys(data[0]).join(",") + "\n";
  const body = data
    .map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "automation-report.csv";
  link.click();
  URL.revokeObjectURL(url);
};
