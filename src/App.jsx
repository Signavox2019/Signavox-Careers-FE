import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import JobListPage from './pages/JobListPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
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
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* Add more routes here as you build additional pages */}
              </Routes>
            </Layout>
          } />
        </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
