import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AtlasPage from '../pages/AtlasPage';

const AtlasRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AtlasPage />} />
    </Routes>
  );
};

export default AtlasRoutes;