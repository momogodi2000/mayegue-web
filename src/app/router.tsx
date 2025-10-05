import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen';
import { ProtectedRoute } from '@/shared/components/auth/ProtectedRoute';
import { RoleRedirect } from '@/shared/components/auth/RoleRedirect';
import { RoleRoute } from '@/shared/components/auth/RoleRoute';
import { GuestDashboard } from '@/features/users/guest';
import { LearnerDashboard } from '@/features/users/learner';
import { TeacherDashboard } from '@/features/users/teacher';
import { AdminPage } from '@/features/users/admin';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const DictionaryPage = lazy(() => import('@/features/dictionary/pages/DictionaryPage'));
const LessonsPage = lazy(() => import('@/features/lessons/pages/LessonsPage'));
const LessonDetailPage = lazy(() => import('@/features/lessons/pages/LessonDetailPage'));
const AboutusPage = lazy(() => import('@/features/home/pages/AboutUsPage'));
const ContactusPage = lazy(() => import('@/features/home/pages/ContactusPage'));
const FAQPage = lazy(() => import('@/features/home/pages/FAQPage'));
const PartnersPage = lazy(() => import('@/features/home/pages/PartnersPage'));
const CareersPage = lazy(() => import('@/features/home/pages/CareersPage'));
const AIAssistantPage = lazy(() => import('@/features/ai-assistant/pages/AIAssistantPage'));
const GamificationPage = lazy(() => import('@/features/gamification/pages/GamificationPage'));
const CommunityPage = lazy(() => import('@/features/community/pages/CommunityPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/profile/pages/SettingsPage'));
const PricingPage = lazy(() => import('@/features/payments/pages/PricingPage'));
const NotFoundPage = lazy(() => import('@/features/errors/pages/NotFoundPage'));
const OfflinePage = lazy(() => import('@/features/errors/pages/OfflinePage'));
const TeacherLessonManagementPage = lazy(() => import('@/features/users/teacher/pages/LessonManagementPage'));
const AdminAnalyticsPage = lazy(() => import('@/features/users/admin/pages/AnalyticsPage'));
const PrivacyPage = lazy(() => import('@/features/legal/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/features/legal/pages/TermsPage'));
const CheckoutPage = lazy(() => import('@/features/payments/pages/CheckoutPage'));
const NewsletterVerifyPage = lazy(() => import('@/features/newsletter/pages/NewsletterVerifyPage'));

// V1.1 Feature Pages
const AtlasPage = lazy(() => import('@/features/atlas/pages/AtlasPage'));
const EncyclopediaPage = lazy(() => import('@/features/encyclopedia/pages/EncyclopediaPage'));
const HistoricalSitesPage = lazy(() => import('@/features/historical-sites/pages/HistoricalSitesPage'));
const MarketplacePage = lazy(() => import('@/features/marketplace/pages/MarketplacePage'));
const ARVRPage = lazy(() => import('@/features/ar-vr/pages/ARVRPage'));
const RPGGamificationPage = lazy(() => import('@/features/rpg-gamification/pages/RPGGamificationPage'));
const AIFeaturesPage = lazy(() => import('@/features/ai-features/pages/AIFeaturesPage'));
const LevelTestPage = lazy(() => import('@/features/assessment/pages/LevelTestPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutusPage />} />
          <Route path="contact" element={<ContactusPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="newsletter/verify" element={<NewsletterVerifyPage />} />
          
          {/* V1.1 Features - Public showcase pages */}
          <Route path="atlas" element={<AtlasPage />} />
          <Route path="encyclopedia" element={<EncyclopediaPage />} />
          <Route path="historical-sites" element={<HistoricalSitesPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="ar-vr" element={<ARVRPage />} />
          <Route path="rpg" element={<RPGGamificationPage />} />
          <Route path="ai-features" element={<AIFeaturesPage />} />
          
          {/* Dictionary - Public with limited features */}
          <Route path="dictionary" element={<DictionaryPage />} />
          {/* Public Guest Dashboard */}
          <Route path="dashboard/guest" element={<GuestDashboard />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<RoleRedirect />} />
            <Route path="dashboard/apprenant" element={<LearnerDashboard />} />
            <Route path="dashboard/learner" element={<Navigate to="/dashboard/apprenant" replace />} /> {/* Legacy redirect */}
            <Route element={<RoleRoute allow={["teacher", "admin"]} />}>
              <Route path="dashboard/teacher" element={<TeacherDashboard />} />
              <Route path="teacher/lessons" element={<TeacherLessonManagementPage />} />
              <Route path="dashboard/admin" element={<AdminPage />} />
              <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>
            <Route path="level-test" element={<LevelTestPage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/:lessonId" element={<LessonDetailPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="gamification" element={<GamificationPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          
          {/* Error Pages */}
          <Route path="404" element={<NotFoundPage />} />
          <Route path="offline" element={<OfflinePage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
