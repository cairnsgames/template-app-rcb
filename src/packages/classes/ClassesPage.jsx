import React from 'react';
import { ClassProvider } from './context/ClassContext';
import Classes from './Classes';

const ClassesPage = () => {
  return (
    <ClassProvider currentRole="dancer">
      <Classes role="dancer" />
    </ClassProvider>
  );
}

export default ClassesPage;