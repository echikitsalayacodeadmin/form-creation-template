import React from "react";
import UltraTech from "./ultratech/ultraTech";
import GenericFormGenerator from "./genericFormGenerator/genericFormGenerator";
import UltratechDepartmentWise from "./ultratech/ultratechDepartmentWise";
import VacinationCertificate from "./adaniWilmar/vacinationCertificate";
import VacinationVIkram from "./vikram/vacinationVIkram";
import BloodPdf from "./blood/bloodPdf";
import UshaKiranPalace from "./ushaKiranPalace/ushaKiranPalace";
import Hershey from "./hershey/hershey";
import Pepsico from "./pepsico/pepsico";

const App = () => {
  return (
    <div>
      {/* <VacinationCertificate /> */}
      <Pepsico />
      {/* <GenericFormGenerator /> */}
    </div>
  );
};

export default App;
