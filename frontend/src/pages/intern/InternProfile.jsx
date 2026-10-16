import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const InternProfile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name cannot be empty');
    }

    try {
      setLoading(true);
      const res = await API.put('/auth/profile', { name, phone });
      updateUser(res.data);
      toast.success('Profile details updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formattedJoiningDate = user?.joiningDate
    ? new Date(user.joiningDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not specified';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          My Profile & Account Details
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View your assigned department, onboarding date, and edit your contact details.
        </p>
      </div>

      {/* Profile Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user?.department || 'Engineering'}
                </span>
                <StatusBadge status={user?.status || 'Active'} size="xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Read-only Department and Program Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Assigned Department
            </span>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">
              {user?.department || 'Frontend Engineering'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              Joining Date
            </span>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">
              {formattedJoiningDate}
            </p>
          </div>
        </div>

        {/* Editable Fields Form */}
        <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Edit Personal Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Contact Phone"
              name="phone"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              loading={loading}
              className="font-bold"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InternProfile;
