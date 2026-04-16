import React, { useState } from "react";
import { states } from "./states";
import { cities } from "./cities";


const GenerateStateCityJSON = () => {
  const [result, setResult] = useState(null);

  const generateJSON = () => {
    // Step 1: stateCode → stateName map
    const stateCodeMap = {};
    states.forEach((state) => {
      stateCodeMap[state.isoCode] = state.name;
    });

    // Step 2: Build mapping
    const tempMap = {};

    cities.forEach((city) => {
      const stateName = stateCodeMap[city.stateCode];
      if (!stateName) return;

      if (!tempMap[stateName]) {
        tempMap[stateName] = new Set();
      }

      const cleanName = city.name?.trim();
      if (!cleanName) return;

      tempMap[stateName].add(cleanName);
    });

    // Step 3: Convert Set → Array
    const finalResult = {};
    Object.keys(tempMap).forEach((state) => {
      finalResult[state] = Array.from(tempMap[state]).sort();
    });

    setResult(finalResult);
  };

  // 🔽 Download JSON
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "india-state-city.json";
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Generate India State-City JSON</h2>

      <button onClick={generateJSON}>Generate JSON</button>

      {result && (
        <>
          <button onClick={downloadJSON} style={{ marginLeft: 10 }}>
            Download JSON
          </button>

          <pre
            style={{
              marginTop: 20,
              maxHeight: 400,
              overflow: "auto",
              background: "#111",
              color: "#0f0",
              padding: 10,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default GenerateStateCityJSON;