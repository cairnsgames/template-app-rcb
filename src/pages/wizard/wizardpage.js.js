import WizardSample from "../../components/wizard/sample";
import ArrowBar from "../../components/wizard2/wizard2";
import PageFull from "../../parts/pagelayouts/pagefull";

const WizardPage = () => {
  return (
    <PageFull style={{ margin: "1rem" }}>
      <h1>Wizard Page</h1>
      <WizardSample />
    </PageFull>
  );
};

export default WizardPage;
