import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Camps from './pages/Camps';
import CampDetailsPage from './pages/CampDetailsPage';
import BloodBanksPage from './pages/BloodBanksPage';
import FaqsPage from './pages/FaqsPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EligibilityInfoPage from './pages/EligibilityInfoPage';
import NotFoundPage from './pages/NotFoundPage';

// Donor Pages
import DonorDashboard from './pages/DonorDashboard';
import DonorProfile from './pages/DonorProfile';
import EligibilityWizard from './pages/EligibilityWizard';
import MyRegistrations from './pages/MyRegistrations';
import DonationHistoryPage from './pages/DonationHistoryPage';
import CertificatePage from './pages/CertificatePage';
import NotificationsPage from './pages/NotificationsPage';

// Organizer Pages
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateCampPage from './pages/CreateCampPage';
import ManageCampsPage from './pages/ManageCampsPage';
import RegisteredDonorsPage from './pages/RegisteredDonorsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import CampManagementPage from './pages/CampManagementPage';
import RegistrationManagementPage from './pages/RegistrationManagementPage';
import DonationRecordsPage from './pages/DonationRecordsPage';
import BloodBankManagementPage from './pages/BloodBankManagementPage';
import FeedbackManagementPage from './pages/FeedbackManagementPage';
import FaqManagementPage from './pages/FaqManagementPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <ErrorBoundary>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/camps" element={<Camps />} />
                <Route path="/camps/:id" element={<CampDetailsPage />} />
                <Route path="/blood-banks" element={<BloodBanksPage />} />
                <Route path="/eligibility-info" element={<EligibilityInfoPage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/certificates/:code" element={<CertificatePage />} />

                {/* Guest Only Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Donor Routes */}
                <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} />
                <Route path="/donor/profile" element={<ProtectedRoute allowedRoles={['donor']}><DonorProfile /></ProtectedRoute>} />
                <Route path="/donor/eligibility-wizard" element={<ProtectedRoute allowedRoles={['donor']}><EligibilityWizard /></ProtectedRoute>} />
                <Route path="/donor/registrations" element={<ProtectedRoute allowedRoles={['donor']}><MyRegistrations /></ProtectedRoute>} />
                <Route path="/donor/history" element={<ProtectedRoute allowedRoles={['donor']}><DonationHistoryPage /></ProtectedRoute>} />
                <Route path="/donor/notifications" element={<ProtectedRoute allowedRoles={['donor']}><NotificationsPage /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute allowedRoles={['donor']}><FeedbackPage /></ProtectedRoute>} />

                {/* Organizer Routes */}
                <Route path="/organizer/dashboard" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
                <Route path="/organizer/create-camp" element={<ProtectedRoute allowedRoles={['organizer']}><CreateCampPage /></ProtectedRoute>} />
                <Route path="/organizer/manage-camps" element={<ProtectedRoute allowedRoles={['organizer']}><ManageCampsPage /></ProtectedRoute>} />
                <Route path="/organizer/camp/:id/registrations" element={<ProtectedRoute allowedRoles={['organizer']}><RegisteredDonorsPage /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagementPage /></ProtectedRoute>} />
                <Route path="/admin/camps" element={<ProtectedRoute allowedRoles={['admin']}><CampManagementPage /></ProtectedRoute>} />
                <Route path="/admin/registrations" element={<ProtectedRoute allowedRoles={['admin']}><RegistrationManagementPage /></ProtectedRoute>} />
                <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={['admin']}><DonationRecordsPage /></ProtectedRoute>} />
                <Route path="/admin/blood-banks" element={<ProtectedRoute allowedRoles={['admin']}><BloodBankManagementPage /></ProtectedRoute>} />
                <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={['admin']}><FeedbackManagementPage /></ProtectedRoute>} />
                <Route path="/admin/faqs" element={<ProtectedRoute allowedRoles={['admin']}><FaqManagementPage /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
