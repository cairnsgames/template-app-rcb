import { useContext, useMemo } from 'react';
import { AssistantContext } from './assistantprovider'; // Adjust the path if necessary

const useAssistant = () => {
  // Get the context
  const context = useContext(AssistantContext);

  // Throw an error if the context is not within the provider
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }

  const { venue, setVenue, roles, permissions, venues } = context;

  // Function to check if the user works at a specific venue
  const worksAt = (venueId) => {
    return venues.some((v) => v.id === venueId);
  };

  // Function to check if the user has a specific assistant permission
  const hasAssistantPermission = (permissionId) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.value === 1 : false;
  };

  // UseMemo to memoize the values
  const value = useMemo(
    () => ({
      venue,
      setVenue,
      roles,
      permissions,
      venues,
      worksAt,
      hasAssistantPermission,
    }),
    [venue, roles, permissions, venues]
  );

  return value;
};

export default useAssistant;
