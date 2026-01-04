import ProfileForm from "../../packages/profile/profileform";
import PageSection from "../../parts/pagelayouts/pagesections";

const ProfilePage = ({ id }) => {
  return (
    <PageSection className="pagesProfilePage">
      <ProfileForm />
    </PageSection>
  );
};

export default ProfilePage;
