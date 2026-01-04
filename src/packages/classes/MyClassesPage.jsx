import React from 'react';
import { ClassProvider } from './context/ClassContext';
import Classes from './Classes';

const MyClassesPage = () => {
  return (
    <ClassProvider currentRole="teacher">
      <Classes role="teacher" className="packagesMyClassesPage" />
    </ClassProvider>
  );
}

export default MyClassesPage;