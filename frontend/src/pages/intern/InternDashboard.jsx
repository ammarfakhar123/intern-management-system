import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import API from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const InternDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/dashboard/intern');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching intern dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: 'In Progress' });
      toast.success('Task started! Status is now In Progress.');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start task');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your personal dashboard..." size="lg" />;
  }

  const { stats, intern, myTasks, upcomingDeadlines, recentFeedback } = data || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner - High Contrast Card */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm border-l-4 border-l-purple-600">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold mb-3">
          <span>Internship Milestone Dashboard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Welcome back, {intern?.name || 'Intern'}! 👋
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          You are enrolled in the <span className="font-bold text-slate-900">{intern?.department}</span> department.
          Review your assigned milestones, start working, and submit completed deliverables.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={stats?.assignedTasks || 0}
          subtitle="Total milestones"
          icon={CheckSquare}
          color="indigo"
          index={0}
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          subtitle="To be worked on"
          icon={Clock}
          color="amber"
          index={1}
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          subtitle="Admin approved"
          icon={CheckCircle2}
          color="emerald"
          index={2}
        />
        <StatCard
          title="Overall Progress"
          value={`${stats?.overallProgress || 0}%`}
          subtitle="(Completed / Assigned) × 100"
          badgeText={stats?.overallProgress >= 100 ? 'Completed' : 'In Progress'}
          icon={TrendingUp}
          color="purple"
          index={3}
        />
      </div>

      {/* Overall Progress Bar Hero Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Overall Internship Progress
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calculated automatically based on admin-approved milestones
            </p>
          </div>
          <div className="text-xs font-bold text-slate-800">
            {stats?.completedTasks || 0} of {stats?.assignedTasks || 0} tasks completed
          </div>
        </div>

        <ProgressBar
          progress={stats?.overallProgress || 0}
          showLabel={false}
          size="lg"
        />

        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <span>Formula: <code className="text-indigo-700 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">(Completed Tasks / Total Assigned) × 100</code></span>
          <button
            onClick={() => navigate('/intern/progress')}
            className="text-indigo-600 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two columns: Assigned Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Tasks (2 Cols span) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">My Assigned Tasks</h3>
              <p className="text-xs text-slate-500">Recent project assignments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/intern/tasks')}
              className="text-xs font-bold text-indigo-600"
            >
              All Tasks
            </Button>
          </div>

          <div className="space-y-3">
            {myTasks?.length > 0 ? (
              myTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusBadge status={task.priority} size="xs" />
                      <StatusBadge status={task.status} size="xs" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.status === 'Pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartTask(task._id)}
                        className="text-xs font-bold"
                      >
                        Start Task
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/intern/tasks')}
                      className="text-xs font-bold border-slate-300 text-slate-700"
                    >
                      {task.status === 'Submitted' ? 'View Submission' : 'Details'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No tasks assigned"
                description="Your mentor or administrator has not assigned tasks yet."
              />
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines & Recent Feedback */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-500 mb-4">Urgent milestones</p>

            <div className="space-y-2.5">
              {upcomingDeadlines?.length > 0 ? (
                upcomingDeadlines.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <StatusBadge status={item.priority} size="xs" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  No upcoming deadlines! Great job!
                </p>
              )}
            </div>
          </div>

          {/* Recent Admin Feedback */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              Recent Admin Feedback
            </h3>
            <p className="text-xs text-slate-500 mb-4">Mentor evaluations</p>

            <div className="space-y-3">
              {recentFeedback?.length > 0 ? (
                recentFeedback.map((fb) => (
                  <div
                    key={fb._id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 line-clamp-1">
                        {fb.taskId?.title || 'Task'}
                      </span>
                      <StatusBadge status={fb.decision} size="xs" />
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      "{fb.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                      Reviewed by {fb.adminId?.name || 'Admin'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  No feedback received yet. Submit work to get feedback!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
