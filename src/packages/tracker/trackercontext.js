import React, { createContext, useEffect, useRef } from 'react';
import { useUser } from '../auth/context/useuser';
import useTenant from '@cairnsgames/tenant/context/usetenant';

export const TrackerContext = createContext();

const apiBaseUrl = process.env.REACT_APP_TRACKER_API || 'http://localhost/cairnsgames/php/tracker';

export const TrackerProvider = ({ children }) => {
  const { user } = useUser();
  const { tenant } = useTenant();

  // Use refs for mutable state to avoid React state race conditions
  const cacheRef = useRef(new Map()); // Map<itemType, Set<itemId>>
  const timersRef = useRef(new Map()); // Map<itemType, timerId>
  const processingRef = useRef(new Set()); // Set<itemType>
  const retriesRef = useRef(new Map()); // Map<itemType, retryCount>

  const sendItems = async (itemType, items) => {
    if (!items || items.length === 0) return false;
    const payload = {
      type: itemType,
      user_id: user?.id,
      id: items,
    };

    // Fire-and-forget: we do not care about the response or failures.
    try {
      fetch(`${apiBaseUrl}/itemseen.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', app_id: tenant },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (e) {
      // swallow synchronous errors (very unlikely)
    }

    // Always treat as successful from the caller's perspective
    return true;
  };

  const clearTimer = (itemType) => {
    const timers = timersRef.current;
    const t = timers.get(itemType);
    if (t) {
      clearTimeout(t);
      timers.delete(itemType);
    }
  };

  const scheduleFlush = (itemType, delay = 3000) => {
    // Clear existing timer
    clearTimer(itemType);

    const timerId = setTimeout(() => {
      flush(itemType);
    }, delay);

    timersRef.current.set(itemType, timerId);
  };

  const flush = async (itemType) => {
    if (!itemType) return;

    // prevent concurrent flushes for same type
    if (processingRef.current.has(itemType)) return;
    processingRef.current.add(itemType);

    // clear timer right away
    clearTimer(itemType);

    const cache = cacheRef.current;
    const set = cache.get(itemType);
    if (!set || set.size === 0) {
      processingRef.current.delete(itemType);
      return;
    }

    const itemsToSend = Array.from(set);
    // remove from cache immediately so new items can be collected
    cache.delete(itemType);

    

    try {
      const ok = await sendItems(itemType, itemsToSend);
      if (!ok) {
        // Failed to send: drop these items (do not retry)
        retriesRef.current.delete(itemType);
      } else {
        // success => reset retries
        retriesRef.current.delete(itemType);
      }
    } catch (err) {
      // On unexpected error: drop (no re-queue)
      retriesRef.current.delete(itemType);
    } finally {
      processingRef.current.delete(itemType);
    }
  };

  const trackItem = (itemType, itemId) => {
    if (!user?.id) {
      return;
    }

    if (!itemType || itemId === undefined || itemId === null) {
      return;
    }

    const cache = cacheRef.current;

    let items = cache.get(itemType);
    if (!items) {
      items = new Set();
      cache.set(itemType, items);
    }

    // Avoid duplicates: Set will handle it
    items.add(itemId);

    // If we reached threshold, flush immediately
    if (items.size >= 100) {
      clearTimer(itemType);
      // flush async to avoid blocking caller
      setTimeout(() => flush(itemType), 0);
      return;
    }

    // Ensure a timer is set for delayed flush
    const timers = timersRef.current;
    if (!timers.has(itemType)) {
      scheduleFlush(itemType);
    }
  };

  const flushAll = async () => {
    const types = Array.from(cacheRef.current.keys());
    await Promise.all(types.map(t => flush(t)));
  };

  const getCacheStatus = () => {
    const status = {};
    cacheRef.current.forEach((items, itemType) => {
      status[itemType] = {
        itemCount: items.size,
        items: Array.from(items),
        isProcessing: processingRef.current.has(itemType),
      };
    });

    return {
      cacheStatus: status,
      userId: user?.id,
      currentlyProcessing: Array.from(processingRef.current),
    };
  };

  // Cleanup on unmount: clear timers and attempt to send remaining items
  useEffect(() => {
    return () => {
      // clear timers
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current.clear();

      // attempt to send remaining items synchronously (best-effort)
      cacheRef.current.forEach((items, itemType) => {
        if (items.size > 0) {
          // fire-and-forget
          sendItems(itemType, Array.from(items));
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    trackItem,
    flushAll,
    getCacheStatus,
    userId: user?.id,
  };

  return (
    <TrackerContext.Provider value={contextValue}>{children}</TrackerContext.Provider>
  );
};

export default TrackerProvider;

// Allow webpack Hot Module Replacement to accept updates to this module
// so HMR doesn't abort the update propagation chain.
if (typeof module !== 'undefined' && module.hot && module.hot.accept) {
  module.hot.accept();
}
