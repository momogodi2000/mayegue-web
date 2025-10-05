import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <AdminDashboard />
      </div>
    </div>
  );
}

