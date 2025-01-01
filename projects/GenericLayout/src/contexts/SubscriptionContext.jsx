import React, { createContext, useState, useContext } from 'react';

// Define subscription types
export const SUBSCRIPTION_TYPES = {
  FREE: 'Free',
  BASIC: 'Basic',
  PRO: 'Pro'
};

// Create the context
const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    type: SUBSCRIPTION_TYPES.FREE,
    features: getFeaturesByType(SUBSCRIPTION_TYPES.FREE)
  });

  // Function to get features based on subscription type
  function getFeaturesByType(type) {
    switch (type) {
      case SUBSCRIPTION_TYPES.FREE:
        return {
          maxUsers: 1,
          maxProjects: 2,
          analytics: 'Basic',
          support: 'Email'
        };
      case SUBSCRIPTION_TYPES.BASIC:
        return {
          maxUsers: 5,
          maxProjects: 10,
          analytics: 'Advanced',
          support: 'Priority'
        };
      case SUBSCRIPTION_TYPES.PRO:
        return {
          maxUsers: 'Unlimited',
          maxProjects: 'Unlimited',
          analytics: 'Custom',
          support: '24/7'
        };
      default:
        return {};
    }
  }

  // Function to change subscription
  const changeSubscription = (newType) => {
    if (Object.values(SUBSCRIPTION_TYPES).includes(newType)) {
      setSubscription({
        type: newType,
        features: getFeaturesByType(newType)
      });
    } else {
      console.error('Invalid subscription type');
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscription, changeSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
