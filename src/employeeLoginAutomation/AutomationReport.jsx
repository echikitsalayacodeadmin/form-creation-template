import useAutomation from "./useAutomation";

const otp = "100000";
const AutomationReport = () => {
  const { report, runAutomationFlow } = useAutomation();

  const handleRun = () => {
    runAutomationFlow("9754459704", otp);
  };

  return (
    <div>
      <button onClick={handleRun}>Run Automation</button>
      {report && <pre>{JSON.stringify(report, null, 2)}</pre>}
    </div>
  );
};

export default AutomationReport;
