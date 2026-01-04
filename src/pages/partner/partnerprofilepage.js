import PartnerForm from "../../mobile/pages/partners/partnerform";
import ProfileForm from "../../packages/profile/profileform";
import PageFull from "../../parts/pagelayouts/pagefull";
import { OfferingsProvider, useOfferings } from "../../mobile/pages/partners/offeringscontext";


const PartnerProfileContent = ({ id, roles }) => {
  const { offerings, loading, error } = useOfferings();
  return (
    <PageFull >
      <PartnerForm id={id} roles={roles} offerings={offerings} offeringsLoading={loading} offeringsError={error} />
    </PageFull>
  );
};

const PartnerProfilePage = (props) => (
  <OfferingsProvider className="pagesPartnerProfilePage">
    <PartnerProfileContent {...props} />
  </OfferingsProvider>
);

export default PartnerProfilePage;
