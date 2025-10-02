// Admin Module - Complete administrative interface for Mayegue platform
export { default as AdminPage } from './pages/AdminPage';
export { default as AdminDashboard } from './pages/DashboardPage';
export { useAdminStore } from './store/adminStore';
export type { AdminUser, ContentItem, ContentReport, SystemMetrics, AdminAction } from './store/adminStore';
export * from './components';


