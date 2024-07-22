import React from "react";
import UltraTech from "./ultratech/ultraTech";
import GenericFormGenerator from "./genericFormGenerator/genericFormGenerator";
import UltratechDepartmentWise from "./ultratech/ultratechDepartmentWise";
import VacinationCertificate from "./adaniWilmar/vacinationCertificate";
import VacinationVIkram from "./vikram/vacinationVIkram";
import BloodPdf from "./blood/bloodPdf";
import UshaKiranPalace from "./ushaKiranPalace/ushaKiranPalace";

const App = () => {
  return (
    <div>
      {/* <VacinationCertificate /> */}
      <UshaKiranPalace /> {/* <GenericFormGenerator /> */}
    </div>
  );
};

export default App;
