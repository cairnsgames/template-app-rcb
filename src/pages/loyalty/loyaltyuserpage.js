import UserLoyaltyCards from "../../packages/loyalty/userloyaltycards";
import { UserLoyaltyProvider } from "../../packages/loyalty/userloyaltyprovider";
import PageFull from "../../parts/pagelayouts/pagefull";

const UserLoyaltyPage = () => {
  return (
    <PageFull style={{ padding: "1rem" }}>
      <UserLoyaltyProvider>
        <UserLoyaltyCards />
      </UserLoyaltyProvider>
    </PageFull>
  );
};

export default UserLoyaltyPage;
