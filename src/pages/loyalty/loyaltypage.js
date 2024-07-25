import Loyalty from "../../packages/loyalty/loyalty";
import LoyaltyProvider from "../../packages/loyalty/loyaltyprovider";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import PageFull from "../../parts/pagelayouts/pagefull";
const LoyaltyPage = ({ id }) => {
  return (
    <PageFull style={{ padding: "1rem" }}>
      <LoyaltyProvider>
        <Loyalty />
      </LoyaltyProvider>
    </PageFull>
  );
};

export default LoyaltyPage;
