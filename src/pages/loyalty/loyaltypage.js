import Loyalty from "../../packages/loyalty/loyalty";
import LoyaltyProvider from "../../packages/loyalty/context/loyaltyprovider";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import PageFull from "../../parts/pagelayouts/pagefull";
const LoyaltyPage = ({ id }) => {
  return (
    <PageFull className="pagesLoyaltyPage">
      <LoyaltyProvider>
        <Loyalty />
      </LoyaltyProvider>
    </PageFull>
  );
};

export default LoyaltyPage;
