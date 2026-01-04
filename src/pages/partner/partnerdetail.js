import PartnerForm from "../../mobile/pages/partners/partnerform";
import PageFull from "../../parts/pagelayouts/pagefull";

const PartnerDetailPage = ({ id, roles }) => {
  const { offerings, loading, error } = useOfferings();
  return (
    <PageFull >
      <PartnerForm id={id} roles={roles} offerings={offerings} offeringsLoading={loading} offeringsError={error} />
    </PageFull>
  );
};

export default PartnerDetailPage;