import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import API from '../../services/api';
import ProgressBar from '../../components/common/ProgressBar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const InternProgress = () => {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [dashRes, tasksRes] = await Promise.all([
        API.get('/dashboard/intern'),
        API.get('/tasks'),
      ]);
      setData(dashRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load progress details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Calculating your internship progress..." size="lg" />;
  }

  const { stats } = data || {};
  const completedList = tasks.filter((t) => t.status === 'Completed');
  const remainingList = tasks.filter((t) => t.status !== 'Completed');

  const progressPercent = stats?.overallProgress || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          My Progress & Completion Tracking
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Automatic performance calculation based on admin evaluations and milestones.
        </p>
      </div>

      {/* Main Formula & Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Completion Rate
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
              {progressPercent}% Complete
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {stats?.completedTasks || 0} of {stats?.assignedTasks || 0} milestones approved by admin
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 max-w-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
              Evaluation Formula
            </span>
            <code className="text-xs font-black text-indigo-700 font-mono block">
              Progress = (Completed / Total Assigned) × 100
            </code>
            <p className="text-[10px] text-slate-600 font-medium mt-1">
              Note: Only tasks reviewed and approved by administrators count toward completion.
            </p>
          </div>
        </div>

        {/* Large Animated Progress Bar */}
        <ProgressBar
          progress={progressPercent}
          showLabel={false}
          size="lg"
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-bold block mb-1">Total Assigned</span>
            <span className="text-2xl font-black text-slate-900">{stats?.assignedTasks || 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-bold block mb-1">Approved & Completed</span>
            <span className="text-2xl font-black text-emerald-700">{stats?.completedTasks || 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-xs text-purple-800 font-bold block mb-1">Under Review</span>
            <span className="text-2xl font-black text-purple-700">{stats?.submittedTasks || 0}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs text-amber-800 font-bold block mb-1">In Progress / Pending</span>
            <span className="text-2xl font-black text-amber-700">{stats?.pendingTasks || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Two lists: Completed Milestones & Remaining Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved Completed Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Completed Milestones ({completedList.length})
              </h3>
              <p className="text-xs text-slate-500">Verified and approved tasks</p>
            </div>
          </div>

          <div className="space-y-3">
            {completedList.length > 0 ? (
              completedList.map((task) => (
                <div
                  key={task._id}
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 block truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Completed on {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StatusBadge status="Completed" size="xs" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No tasks completed yet. Keep working on your assigned tasks!
              </p>
            )}
          </div>
        </div>

        {/* Remaining Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Remaining Milestones ({remainingList.length})
              </h3>
              <p className="text-xs text-slate-500">Tasks in queue or under review</p>
            </div>
          </div>

          <div className="space-y-3">
            {remainingList.length > 0 ? (
              remainingList.map((task) => (
                <div
                  key={task._id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 block truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={task.priority} size="xs" />
                    <StatusBadge status={task.status} size="xs" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Award className="w-10 h-10 text-indigo-600 mx-auto mb-2 opacity-90" />
                <p className="text-xs font-bold text-slate-900">All Milestones Finished!</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Congratulations! You have completed all assigned tasks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternProgress;
