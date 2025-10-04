import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HistoricalSitesPage from '../pages/HistoricalSitesPage';

const HistoricalSitesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HistoricalSitesPage />} />
    </Routes>
  );
};

export default HistoricalSitesRoutes;