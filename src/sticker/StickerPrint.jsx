import React from "react";

export default function StickerPrint() {
  const handlePrint = () => {
    window.print();
  };

  const stickerStyle = {
    width: "32mm", // 50mm
    height: "15mm", // 20mm
    border: "1px solid black",
    padding: "2mm",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const printAreaStyle = {
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Print Sticker
      </button>

      {/* Printable Sticker */}
      <div id="print-area" style={stickerStyle}>
        <div>Token: 22</div>
        <div>Name: Abhilash Chaudhary</div>
      </div>

      {/* Inline <style> block for print rules */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #print-area, #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
