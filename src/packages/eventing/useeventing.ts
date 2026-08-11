import { useEffect } from "react";
import eventing from "./eventing";

const useEventing = (
  eventType: string,
  action: string | null,
  callback: (data: unknown) => void
): void => {
  useEffect(() => {
    eventing.subscribe(eventType, action, callback);
    return () => {
      eventing.unsubscribe(eventType, action, callback);
    };
  }, [eventType, action, callback]);
};

export default useEventing;
