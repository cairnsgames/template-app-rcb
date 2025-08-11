import { InView } from "react-intersection-observer";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

import "./tracker.scss";
import { useTracker } from "./usetracker";

const Tracker = ({ itemtype, id, itemid, children }) => {
  const { tenant } = useTenant();
  const { user, token } = useUser();

  const { trackItem } = useTracker();

  const seen = () => {
    trackItem(itemtype, id ?? itemid);
  }

  return (
    <InView
      className="tracker"
      style={{position:"relative"}}
      key={id ?? itemid}
      onChange={(inView, entry) => {
        if (inView && user?.id) {
          seen();
        }
      }}
    >
      {children}
    </InView>
  );
};

export default Tracker;
