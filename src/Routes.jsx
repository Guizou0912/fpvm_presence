import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AttendanceReports from './pages/attendance-reports';
import QRCodeScanner from './pages/qr-code-scanner';
import LoginPage from './pages/login';
import MemberManagementDashboard from './pages/member-management-dashboard';
import MemberProfile from './pages/member-profile';
import QRBadgeGenerator from './pages/qr-badge-generator';
import OrganizationStructureManagement from './pages/organization-structure-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AttendanceReports />} />
        <Route path="/attendance-reports" element={<AttendanceReports />} />
        <Route path="/qr-code-scanner" element={<QRCodeScanner />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/member-management-dashboard" element={<MemberManagementDashboard />} />
        <Route path="/member-profile" element={<MemberProfile />} />
        <Route path="/qr-badge-generator" element={<QRBadgeGenerator />} />
        <Route path="/organization-structure-management" element={<OrganizationStructureManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;