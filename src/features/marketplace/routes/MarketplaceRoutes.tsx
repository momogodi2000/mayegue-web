import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MarketplacePage from '../pages/MarketplacePage';

const MarketplaceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MarketplacePage />} />
    </Routes>
  );
};

export default MarketplaceRoutes;