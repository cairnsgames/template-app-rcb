import { useContext } from 'react';
import { KlokoContext } from './klokocontext';

export const useKloko = () => {
  const context = useContext(KlokoContext);
  if (context === undefined) {
    throw new Error('useKloko must be used within a KlokoProvider');
  }
  return context;
};