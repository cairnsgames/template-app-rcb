import WizardSample from "../../components/wizard/sample";
import PageFull from "../../parts/pagelayouts/pagefull";
import ArrowBar from "../../components/wizard/arrowbar";

const WizardPage = () => {
  return (
    <PageFull>
      <h1>Create Schedule</h1>
      <WizardSample />
    </PageFull>
  );
};

export default WizardPage;
