import React from 'react';
import Header from '../../components/Header';
import MobileLayout from '../../layouts/MobileLayout';
import DesktopLayout from '../../layouts/DesktopLayout';
import Dashboard from './components/Dashboard';
import useIsMobile from '../../hooks/useIsMobile';

const DashboardPage = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileLayout>
          <Dashboard />
        </MobileLayout>
      ) : (
        <DesktopLayout>
          <Dashboard />
        </DesktopLayout>
      )}
    </>
  );
};

export default DashboardPage;
