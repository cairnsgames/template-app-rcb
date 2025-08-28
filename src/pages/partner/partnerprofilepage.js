import PartnerForm from "../../mobile/pages/partners/partnerform";
import ProfileForm from "../../packages/profile/profileform";
import PageFull from "../../parts/pagelayouts/pagefull";

const PartnerProfilePage = ({ id, roles }) => {
  return (
    <PageFull>
      <PartnerForm id={id} roles={roles} />
    </PageFull>
  );
};

export default PartnerProfilePage;
