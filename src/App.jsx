import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import NavigationSpinner from './components/common/NavigationSpinner';
import RouteChangeSpinner from './components/common/RouteChangeSpinner';
import HomePage from './pages/HomePage';
import JobListPage from './pages/JobListPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import JobForm from "./pages/JobForm";
import JobDetails from "./pages/JobDetails";
import ManageApplicants from "./pages/ManageApplicants";
import ApplicantDetails from "./pages/ApplicantDetails";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <NavigationProvider>
            <Router>
              <RouteChangeSpinner />
              <Routes>
                {/* Authentication Routes - Protected from logged-in users */}
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false} authPages={['login', 'register', 'forgot-password']}>
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute requireAuth={false} authPages={['login', 'register', 'forgot-password']}>
                      <RegisterPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <ProtectedRoute requireAuth={false} authPages={['login', 'register', 'forgot-password']}>
                      <ForgotPasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* Main Application Routes */}
                <Route path="/" element={
                  <Layout>
                    <HomePage />
                  </Layout>
                } />
                <Route path="/jobs" element={
                  <Layout>
                    <JobListPage />
                  </Layout>
                } />
                <Route path="/profile" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true}>
                      <ProfilePage />
                    </ProtectedRoute>
                  </Layout>
                } />

                {/* Admin */}
                <Route path="/admin" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path="/admin/jobs/new" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <JobForm />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path="/admin/jobs/:id/edit" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <JobForm />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path="/admin/jobs/:id" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <JobDetails />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path="/admin/jobs/:id/applicants" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <ManageApplicants />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path="/admin/applicants/:userId" element={
                  <Layout>
                    <ProtectedRoute requireAuth={true} requireAdmin={true}>
                      <ApplicantDetails />
                    </ProtectedRoute>
                  </Layout>
                } />

                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            <NavigationSpinner />
          </NavigationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
