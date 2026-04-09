import React, { createContext, useEffect, useRef } from 'react';
import { useUser } from '../auth/context/useuser';

export const TrackerContext = createContext();

const apiBaseUrl = process.env.REACT_APP_TRACKER_API || 'http://localhost/cairnsgames/php/tracker';

export const TrackerProvider = ({ children }) => {
  const { user } = useUser();

  // Use refs for mutable state to avoid React state race conditions
  const cacheRef = useRef(new Map()); // Map<itemType, Set<itemId>>
  const timersRef = useRef(new Map()); // Map<itemType, timerId>
  const processingRef = useRef(new Set()); // Set<itemType>
  const retriesRef = useRef(new Map()); // Map<itemType, retryCount>

  const sendItems = async (itemType, items) => {
    if (!items || items.length === 0) return false;

    console.log('tracker: Sending items to API', { itemType, items });

    const payload = {
      type: itemType,
      user_id: user?.id,
      id: items,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/itemseen.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status} body: ${text}`);
      }

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text().catch(() => '');
        console.error(`Unexpected non-JSON response for ${itemType}:`, text);
        return false;
      }

      await response.json();
      return true;
    } catch (error) {
      console.error(`Failed to send items for type "${itemType}":`, error);
      return false;
    }
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
    console.log('Tracker: Schedule Flush', { itemType, delay });
    // Clear existing timer
    clearTimer(itemType);

    const timerId = setTimeout(() => {
      console.log('Tracker: Trigger Flush', { itemType });
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
      console.log('Tracker: Processing items', { itemType, itemsToSend: [] });
      processingRef.current.delete(itemType);
      return;
    }

    const itemsToSend = Array.from(set);
    // remove from cache immediately so new items can be collected
    cache.delete(itemType);

    console.log('Tracker: Processing items', { itemType, itemsToSend });

    try {
      const ok = await sendItems(itemType, itemsToSend);
      if (!ok) {
        // Failed to send: drop these items (do not retry)
        console.warn(`Tracker: send failed for ${itemType}, dropping ${itemsToSend.length} items`, { itemType, itemsToSend });
        retriesRef.current.delete(itemType);
      } else {
        // success => reset retries
        retriesRef.current.delete(itemType);
      }
    } catch (err) {
      // On unexpected error: log and drop (no re-queue)
      console.error('Tracker flush error (dropping items)', err, { itemType, itemsToSend });
      retriesRef.current.delete(itemType);
    } finally {
      processingRef.current.delete(itemType);
    }
  };

  const trackItem = (itemType, itemId) => {
    console.log('Tracker, trackItem called', { itemType, itemId });
    if (!user?.id) {
      console.warn('Cannot track item: user not logged in');
      return;
    }

    if (!itemType || itemId === undefined || itemId === null) {
      console.warn('Cannot track item: itemType and itemId are required');
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
