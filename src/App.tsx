import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Live from './pages/Live';
import About from './pages/About';
import News from './pages/News';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import ArticleDetail from './pages/ArticleDetail';
import Violations from './pages/Violations';
import Academy from './pages/Academy';
import YemenJPT from './pages/YemenJPT';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Tenders from './pages/Tenders';
import Contact from './pages/Contact';
import Search from './pages/Search';
import ProjectsDemo from './pages/ProjectsDemo';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/admin/Dashboard';
import LoginPage from './pages/admin/LoginPage';
import StaffDashboard from './pages/staff/Dashboard';
import JournalistDashboard from './pages/journalist/Dashboard';
import AccessDenied from './pages/AccessDenied';
import MediaProductDetail from './pages/MediaProductDetail';
import VerifyCertificate from './pages/VerifyCertificate';
import VolunteerPortal from './pages/VolunteerPortal';
import VolunteerOpportunityDetail from './pages/VolunteerOpportunityDetail';
import './i18n';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

import { motion, AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';

import RequireRole from './components/RequireRole';
import { PressAgentChat } from './components/PressAgentChat';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/admin';
const ROOT_PATH = import.meta.env.VITE_ROOT_PATH || '/root';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-grow flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* ... Rest of routes below ... */}
          <Route path="/live" element={<Live />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<ArticleDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/violations" element={<Violations />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/yemen-jpt" element={<YemenJPT />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/tenders" element={<Tenders />} />
          <Route path="/projects" element={<ProjectsDemo />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          
          {/* Media Products Public URLs */}
          <Route path="/stories/success-story/:slug" element={<MediaProductDetail />} />
          <Route path="/stories/human-story/:slug" element={<MediaProductDetail />} />
          <Route path="/documentaries/:slug" element={<MediaProductDetail />} />
          <Route path="/press-releases/:slug" element={<MediaProductDetail />} />
          <Route path="/research/reports/:slug" element={<MediaProductDetail />} />
          <Route path="/campaigns/:slug" element={<MediaProductDetail />} />
          <Route path="/infographics/:slug" element={<MediaProductDetail />} />

          {/* Certificate Verification routes */}
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/verify-certificate/:id" element={<VerifyCertificate />} />

          {/* Volunteer Management System URLs */}
          <Route path="/volunteer-portal" element={<VolunteerPortal />} />
          <Route path="/volunteer-opportunities/:slug" element={<VolunteerOpportunityDetail />} />

          <Route path={`${ADMIN_PATH}/*`} element={<RequireRole roles={['admin', 'root']}><AdminDashboard /></RequireRole>} />
          <Route path={`${ROOT_PATH}/*`} element={<RequireRole roles={['root', 'admin']}><AdminDashboard /></RequireRole>} />
          <Route path="/staff/*" element={<RequireRole roles={['staff', 'admin', 'root']}><StaffDashboard /></RequireRole>} />
          <Route path="/profile/*" element={<RequireRole roles={['journalist', 'staff', 'admin', 'root']}><JournalistDashboard /></RequireRole>} />
          {/* Fallback for standard paths if they differ */}
          {ADMIN_PATH !== '/admin' && <Route path="/admin/*" element={<RequireRole roles={['admin', 'root']}><AdminDashboard /></RequireRole>} />}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
          <PressAgentChat />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
