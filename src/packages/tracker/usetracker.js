import React, { createContext, useContext, useRef, useCallback } from 'react';
import { TrackerContext } from './trackercontext';

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};