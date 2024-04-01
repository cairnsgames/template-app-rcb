import { InView } from "react-intersection-observer";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

const Tracker = ({ itemtype, id, itemid, children }) => {
  const { tenant } = useTenant();
  const { user, token } = useUser();

  const seen = () => {
    let url = `${
      process.env.REACT_APP_TRACKER_API
    }/itemseen.php?type=${itemtype}&user_id=${user?.id ?? 0}&id=${
      id ?? itemid
    }`;
    url = url.replace(/#/g, "%23");

    // Fire and forget
    fetch(url, {
      method: "POST",
      headers: {
        token: token || "",
        "Content-Type": "application/json",
        APP_ID: tenant,
      },
      body: JSON.stringify({ "user_id": user?.id ?? 0, id }),
    });
  };

  return (
    <InView
      key={id ?? itemid}
      onChange={(inView, entry) => {
        if (inView) {
          seen();
        }
      }}
    >
      {children}
    </InView>
  );
};

export default Tracker;
