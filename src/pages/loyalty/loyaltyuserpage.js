import UserLoyaltyCards from "../../packages/loyalty/userloyaltycards";
import { UserLoyaltyProvider } from "../../packages/loyalty/context/userloyaltyprovider";
import PageFull from "../../parts/pagelayouts/pagefull";

const UserLoyaltyPage = () => {
  return (
    <PageFull className="pagesUserLoyaltyPage">
      <UserLoyaltyProvider>
        <UserLoyaltyCards />
      </UserLoyaltyProvider>
    </PageFull>
  );
};

export default UserLoyaltyPage;
