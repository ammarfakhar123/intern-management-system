import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'Company / Organization name is required';
    }
    if (!formData.name.trim()) {
      errs.name = 'Administrator full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Work email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid work email';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register({
      companyName: formData.companyName.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      department: formData.department.trim() || 'Internship Program',
    });
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Intern<span className="text-indigo-600">Pulse</span>
          </h1>
        </Link>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Enterprise Intern Management & Progress Tracking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-md"
        >
          {/* Section Heading */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">
                Company Admin Registration
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Register Your Organization
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Set up your company workspace to manage interns, assign deliverables, and monitor milestones.
            </p>
          </div>

          {/* Intern Registration Restriction Banner */}
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold block text-amber-950 mb-0.5">
                Notice for Intern Candidates:
              </strong>
              Intern accounts cannot register independently. If you are an intern, your company administrator will create your account and provide your login credentials.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Org Name"
                id="companyName"
                name="companyName"
                placeholder="Acme Corp, TechCorp, etc."
                icon={Building2}
                value={formData.companyName}
                onChange={handleChange}
                error={errors.companyName}
                required
              />

              <Input
                label="Department / Program"
                id="department"
                name="department"
                placeholder="e.g. Software Engineering"
                icon={Briefcase}
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />
            </div>

            {/* Admin Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admin Full Name"
                id="name"
                name="name"
                placeholder="Sarah Jenkins"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <Input
                label="Contact Phone"
                id="phone"
                name="phone"
                placeholder="+1 555-0199"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            <Input
              label="Admin Work Email"
              id="email"
              name="email"
              type="email"
              placeholder="admin@company.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* Password Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Feature highlights */}
            <div className="pt-2 pb-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated isolated company workspace</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unlimited intern profiles & task tracking</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full font-bold mt-2"
            >
              Register Company Admin
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-600 font-medium">
              Already have an admin or intern account?{' '}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Sign In here
              </Link>
            </p>

            <div>
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
