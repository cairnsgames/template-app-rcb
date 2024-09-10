import ProfileForm from "../../packages/profile/profileform";
import PageFull from "../../parts/pagelayouts/pagefull";

const ProfilePage = ({ id }) => {
  return (
    <PageFull>
      <ProfileForm />
    </PageFull>
  );
};

export default ProfilePage;
