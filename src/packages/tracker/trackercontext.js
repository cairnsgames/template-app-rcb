import React, { createContext, useState, useEffect } from 'react';
import { useUser } from '../auth/context/useuser';

export const TrackerContext = createContext();

const apiBaseUrl = process.env.REACT_APP_TRACKER_API || 'http://localhost/cairnsgames/php/tracker';

export const TrackerProvider = ({ children }) => {
  const {user} = useUser();
  const [cache, setCache] = useState(new Map());
  const [timers, setTimers] = useState(new Map());
  const [processing, setProcessing] = useState(new Set()); // Track what's currently being processed

  const sendItems = async (itemType, items) => {
    if (!items || items.length === 0) return false;

    const payload = {
      type: itemType,
      user_id: user?.id,
      id: items
    };

    try {
      const response = await fetch(`${apiBaseUrl}/itemseen.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return true;
    } catch (error) {
      console.error(`Failed to send items for type "${itemType}":`, error);
      return false;
    }
  };

  const processAndClearItems = async (itemType) => {

    // Retrieve items from cache
    let itemsToSend = [];
    setCache(prev => {
      const newCache = new Map(prev);
      const currentItems = newCache.get(itemType);
      if (currentItems && currentItems.size > 0) {
        itemsToSend = Array.from(currentItems);
        newCache.delete(itemType);
      }
      return newCache;
    });

    // Ensure items are processed even if cache is updated rapidly
    if (itemsToSend.length === 0) {
      console.log(`No items to send for ${itemType}, skipping API call`);
      return;
    }

    // Clear the timer
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timerId = newTimers.get(itemType);
      if (timerId) {
        clearTimeout(timerId);
        newTimers.delete(itemType);
      }
      return newTimers;
    });

    // Send the items
    try {
      const result = await sendItems(itemType, itemsToSend);
    } catch (error) {
      console.error(`Failed to send items for ${itemType}:`, error);
    }
  };

  const scheduleFlush = (itemType) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      
      // Clear existing timer
      const existingTimer = newTimers.get(itemType);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new timer
      const timerId = setTimeout(() => {
        processAndClearItems(itemType);
      }, 30000); // 30 seconds

      newTimers.set(itemType, timerId);
      return newTimers;
    });
  };

  const trackItem = async (itemType, itemId) => {
    if (!user?.id) {
      console.warn('Cannot track item: user not logged in');
      return;
    }

    if (!itemType || itemId === undefined || itemId === null) {
      console.warn('Cannot track item: itemType and itemId are required');
      return;
    }

    // Check if this is a different item type than what's currently cached
    const currentTypes = Array.from(cache.keys());
    const isDifferentType = currentTypes.length > 0 && !currentTypes.includes(itemType);
    
    if (isDifferentType) {
      // Flush all existing types first, but only if they're not already being processed
      const typesToFlush = currentTypes.filter(type => !processing.has(type));
      if (typesToFlush.length > 0) {
        await Promise.all(typesToFlush.map(type => processAndClearItems(type)));
      }
    }

    // Don't add items if this type is currently being processed
    if (processing.has(itemType)) {
      return;
    }

    setCache(prev => {
      const newCache = new Map(prev);
      let items = newCache.get(itemType);
      
      if (!items) {
        items = new Set();
        newCache.set(itemType, items);
        scheduleFlush(itemType);
      }

      // Add item to cache
      items.add(itemId);

      // If we have 100 or more items, flush immediately
      if (items.size >= 100) {
        // Use setTimeout to avoid state update conflicts
        setTimeout(() => processAndClearItems(itemType), 0);
      }

      return newCache;
    });
  };

  const flushAll = async () => {
    const types = Array.from(cache.keys());
    await Promise.all(types.map(itemType => processAndClearItems(itemType)));
  };

  const getCacheStatus = () => {
    const status = {};
    cache.forEach((items, itemType) => {
      status[itemType] = {
        itemCount: items.size,
        items: Array.from(items),
        isProcessing: processing.has(itemType)
      };
    });
    
    return {
      cacheStatus: status,
      userId: user?.id,
      currentlyProcessing: Array.from(processing)
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timers
      timers.forEach(timerId => clearTimeout(timerId));
      
      // Flush remaining items
      cache.forEach((items, itemType) => {
        if (items.size > 0) {
          sendItems(itemType, Array.from(items));
        }
      });
    };
  }, []);

  const contextValue = {
    trackItem,
    flushAll,
    getCacheStatus,
    userId: user?.id
  };

  return (
    <TrackerContext.Provider value={contextValue}>
      {children}
    </TrackerContext.Provider>
  );
};

export default TrackerProvider;
