import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EncyclopediaPage from '../pages/EncyclopediaPage';

const EncyclopediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EncyclopediaPage />} />
    </Routes>
  );
};

export default EncyclopediaRoutes;