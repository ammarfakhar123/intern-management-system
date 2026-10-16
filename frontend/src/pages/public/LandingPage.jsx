import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  BarChart3,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
  FileCheck,
  MessageSquare,
  Lock,
  Menu,
  X,
  ExternalLink,
  Laptop,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleDashboardRedirect = () => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/intern/dashboard');
    }
  };

  const faqs = [
    {
      q: 'Can interns register themselves publicly on the website?',
      a: 'No. To maintain security and data integrity, interns cannot self-register. Company administrators create and provision intern credentials directly from within the Admin portal.',
    },
    {
      q: 'Can a company manage multiple interns across different departments?',
      a: 'Yes! Company admins can manage an unlimited number of interns across various departments (Frontend, Backend, Design, QA) with isolated task assignments and performance tracking.',
    },
    {
      q: 'How do interns submit their project deliverables?',
      a: 'Interns access their personalized dashboard, select their assigned task, and upload their GitHub repository URL, live preview link, and project notes. Admins can review, grade (1-100), and leave constructive feedback.',
    },
    {
      q: 'Is there a demo available to test the platform immediately?',
      a: 'Yes, on the login page you can click "One-Click Demo Accounts" to instantly explore both the Company Admin and the Intern experiences without creating an account.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Intern<span className="text-indigo-600">Pulse</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#roles" className="hover:text-indigo-600 transition-colors">
              Roles & Access
            </a>
            <a href="#faqs" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={handleDashboardRedirect}
                icon={ArrowRight}
                iconPosition="right"
                className="font-bold shadow-md shadow-indigo-600/20"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register Company</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700"
              >
                How It Works
              </a>
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700"
              >
                Roles & Access
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-700"
              >
                FAQ
              </a>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    onClick={handleDashboardRedirect}
                    className="w-full font-bold"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-sm"
                    >
                      Register Company Admin
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Modern Internship Orchestration Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
            >
              Streamline Your <span className="text-indigo-600">Internship</span>{' '}
              Program with Confidence.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
            >
              The all-in-one platform for companies to register their organization,
              provision secure intern credentials, assign structured milestone tasks, and
              track growth with verifiable metrics.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Building2 className="w-4 h-4" />
                <span>Register Your Company</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-all"
              >
                <span>Live Platform Login</span>
              </Link>
            </motion.div>

            {/* Trust Points */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Company-Isolated Workspace</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Admins Provision Interns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Progress Metrics</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Mockup Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
          >
            {/* Window Topbar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">
                  internpulse.app / workspace / TechCorp Global
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  Live System Preview
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="p-6 sm:p-8 bg-slate-50/50">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Active Interns
                    </span>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">12 Assigned</div>
                  <span className="text-[11px] text-emerald-600 font-bold">● 100% On-Track</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tasks Completed
                    </span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <FileCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">28 / 32</div>
                  <span className="text-[11px] text-slate-500 font-medium">87.5% milestone velocity</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Average Score
                    </span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">92 / 100</div>
                  <span className="text-[11px] text-purple-600 font-bold">Excellent Review Tier</span>
                </div>
              </div>

              {/* Sample Task Table Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="font-extrabold text-sm text-slate-900">
                    Recent Assigned Deliverables
                  </div>
                  <span className="text-xs font-bold text-indigo-600">Company Scoped</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Build RESTful Authentication & JWT Guards
                      </span>
                      <span className="text-slate-500 text-[11px]">Assigned to: Alex Morgan • Backend</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        Completed (Score: 95)
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Implement Interactive Dashboard Analytics
                      </span>
                      <span className="text-slate-500 text-[11px]">Assigned to: Alex Morgan • Frontend</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                        Under Review
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Deploy Production Build to Vercel Cloud
                      </span>
                      <span className="text-slate-500 text-[11px]">Assigned to: Jordan Lee • DevOps</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              Built For Organizations
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything Your Internship Program Needs
            </h2>
            <p className="mt-3 text-slate-600 text-sm font-medium">
              Eliminate email chaos and scattered spreadsheets with structured workflows built for modern mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-indigo-600/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Company-Isolated Portals</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Every registered company operates within its own secure workspace. Interns and tasks belong strictly to your company and cannot be seen by other organizations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-purple-600/20">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Admin-Controlled Intern Accounts</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Interns cannot sign up publicly. Company admins securely onboard their candidates and set their credentials directly, preventing unauthorized registrations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-emerald-600/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Structured Task Assignment</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Assign detailed milestones with priority tags, expected deliverables, submission guidelines, and target deadlines to keep interns focused.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-amber-600/20">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Proof of Work Submissions</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Interns submit live project URLs, GitHub repository links, and comprehensive release notes directly for admin evaluation and grading.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-sky-600/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Granular Mentor Feedback</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Grade submissions on a 1-100 scale, request revisions, or approve deliverables with qualitative feedback that guides intern professional growth.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md shadow-rose-600/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Automated Progress Analytics</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Real-time completion percentage, department performance breakdowns, and visual activity charts give leadership full visibility at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "How It Works" Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              Simple 3-Step Lifecycle
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How InternPulse Works
            </h2>
            <p className="mt-3 text-slate-600 text-sm font-medium">
              A clear, structured workflow designed so companies and interns hit the ground running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="text-lg font-black text-slate-900">Company Admin Registers</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Organization leads create their company account. They instantly gain access to a dedicated Admin Portal configured specifically for their team.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant workspace activation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="text-lg font-black text-slate-900">Admin Provisions Interns</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                From the admin dashboard, the company adds its interns, sets their credentials, and assigns tasks with milestones, guidelines, and deadlines.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No self-registration chaos</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="text-lg font-black text-slate-900">Work, Review & Track</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Interns log in, execute assignments, submit deliverables, and view mentor feedback, while admins monitor completion velocity on live charts.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Transparent performance metrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Role & Access Clarity Section */}
      <section id="roles" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              Access Matrix
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Designed For Two Distinct Roles
            </h2>
            <p className="mt-3 text-slate-600 text-sm font-medium">
              InternPulse enforces clean separation between company management and intern execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Admin Side */}
            <div className="p-8 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Company Administrators</h3>
                  <span className="text-xs font-bold text-indigo-700">Can Register Online</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                Any organization or company manager can register themselves to create an isolated organization hub.
              </p>

              <ul className="space-y-3 text-xs font-bold text-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Register company and workspace</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Create and provision intern accounts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Assign tasks, guidelines, and target deadlines</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Review submissions, score work, and leave feedback</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-md hover:bg-indigo-700 transition-colors"
                >
                  <span>Register As Company Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Intern Side */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Intern Candidates</h3>
                  <span className="text-xs font-bold text-purple-700">Account Provided by Admin</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                Interns receive their verified login credentials directly from their company admin or mentor.
              </p>

              <ul className="space-y-3 text-xs font-bold text-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>View assigned tasks and clear project briefs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Submit GitHub repos, live URLs, and notes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Track overall progress % and milestone milestones</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Receive scores and constructive supervisor feedback</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <span>Intern Sign In Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faqs" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              Answers & Help
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4 text-xs text-slate-600 leading-relaxed font-medium"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Banner */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Transform Your Internship Program?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto font-medium">
            Register your company today and join organizations organizing talent, mentoring with ease, and delivering results.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-600 text-sm font-black hover:bg-slate-100 transition-all shadow-lg hover:scale-105"
            >
              Register Company Admin
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white text-sm font-bold border border-indigo-400/30 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Modern Responsive Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                Intern<span className="text-indigo-400">Pulse</span>
              </span>
              <p className="mt-1 text-xs text-slate-400">
                Full-Stack Intern Management & Progress Tracking System
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <Link to="/register" className="hover:text-white transition-colors">
                Company Registration
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} InternPulse. All rights reserved.</p>
            <p>Designed for organizations, supervisors, and interns.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
