// useEventSubscription.js
import { useEffect } from 'react';
import eventing from './eventing';

const useEventing = (eventType, action, callback) => {
  useEffect(() => {
    eventing.subscribe(eventType, action, callback);

    // Cleanup subscription on unmount
    return () => {
      eventing.unsubscribe(eventType, action, callback);
    };
  }, [eventType, action, callback]);
};

export default useEventing;
