import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  UserPlus,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import API from '../../services/api';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [internsList, setInternsList] = useState([]);

  // Modals state
  const [isAddInternOpen, setIsAddInternOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Intern Form State
  const [internForm, setInternForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Frontend Engineering',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  // Create Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, internsRes] = await Promise.all([
        API.get('/dashboard/admin'),
        API.get('/interns'),
      ]);
      setData(dashRes.data);
      setInternsList(internsRes.data);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateIntern = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post('/interns', internForm);
      toast.success('Intern account created successfully!');
      setIsAddInternOpen(false);
      setInternForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: 'Frontend Engineering',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create intern');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.assignedTo) {
      return toast.error('Please select an intern to assign this task');
    }
    try {
      setSubmitting(true);
      await API.post('/tasks', taskForm);
      toast.success('Task created and assigned successfully!');
      setIsCreateTaskOpen(false);
      setTaskForm({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading admin dashboard..." size="lg" />;
  }

  const { stats, statusBreakdown, priorityBreakdown, recentInterns, recentTasks } = data || {};

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Actions Card - High Contrast & Clear Headings */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-indigo-600">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Administrator Workspace
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Track intern performance, assign project milestones, and review completed submissions in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={() => setIsAddInternOpen(true)}
            className="text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-50"
          >
            Add Intern
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsCreateTaskOpen(true)}
            className="text-xs font-bold"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Interns"
          value={stats?.totalInterns || 0}
          subtitle="Enrolled active interns"
          icon={Users}
          color="indigo"
          index={0}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          subtitle="Assigned milestones"
          icon={Briefcase}
          color="purple"
          index={1}
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          subtitle="Admin approved tasks"
          badgeText={
            stats?.totalTasks
              ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% done`
              : '0%'
          }
          icon={CheckCircle2}
          color="emerald"
          index={2}
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasks || 0}
          subtitle="Pending or In Progress"
          icon={Clock}
          color="amber"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Task Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Task Status Distribution</h3>
                <p className="text-xs text-slate-500">Breakdown by current phase</p>
              </div>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              {stats?.totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} tasks`, name]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No tasks to chart"
                  description="Add tasks to view status breakdown"
                  className="p-4 border-none shadow-none"
                />
              )}
            </div>
          </div>

          {/* Donut legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
            {statusBreakdown?.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-extrabold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Tasks by Priority</h3>
                <p className="text-xs text-slate-500">Urgency classification</p>
              </div>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              {stats?.totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip
                      formatter={(val) => [`${val} tasks`, 'Count']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {priorityBreakdown.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No data"
                  description="Create tasks to view priority distribution"
                  className="p-4 border-none shadow-none"
                />
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs flex justify-around text-slate-600 font-medium">
            <span>High: <b className="text-red-600">{priorityBreakdown?.[0]?.value || 0}</b></span>
            <span>Medium: <b className="text-amber-600">{priorityBreakdown?.[1]?.value || 0}</b></span>
            <span>Low: <b className="text-emerald-600">{priorityBreakdown?.[2]?.value || 0}</b></span>
          </div>
        </div>

        {/* Quick Review Needs Attention Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Review Queue</h3>
                <p className="text-xs text-slate-500">Submissions awaiting admin approval</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {stats?.submittedTasks || 0} Pending
              </span>
            </div>

            <div className="space-y-3">
              {recentTasks?.filter((t) => t.status === 'Submitted').length > 0 ? (
                recentTasks
                  .filter((t) => t.status === 'Submitted')
                  .slice(0, 3)
                  .map((task) => (
                    <div
                      key={task._id}
                      onClick={() => navigate('/admin/tasks')}
                      className="p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {task.title}
                        </span>
                        <StatusBadge status={task.priority} size="xs" />
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">
                        By {task.assignedTo?.name || 'Intern'}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-90" />
                  <p className="text-xs font-bold text-slate-900">All caught up!</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No tasks currently waiting for review.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/tasks')}
              className="w-full text-xs font-bold text-slate-800 border-slate-300"
            >
              Go to All Tasks
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Interns & Recent Tasks Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interns */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Recent Interns</h3>
              <p className="text-xs text-slate-500">Recently onboarded talents</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/admin/interns')}
              className="text-xs font-bold text-indigo-600"
            >
              View All
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInterns?.length > 0 ? (
              recentInterns.map((intern) => (
                <div
                  key={intern._id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {intern.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {intern.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {intern.department} • {intern.email}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={intern.status} size="xs" />
                </div>
              ))
            ) : (
              <EmptyState title="No interns found" description="Click Add Intern to register interns." />
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Recent Tasks</h3>
              <p className="text-xs text-slate-500">Latest assignments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/admin/tasks')}
              className="text-xs font-bold text-indigo-600"
            >
              View All
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTasks?.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      Assigned to: <span className="font-bold text-slate-700">{task.assignedTo?.name || 'Unassigned'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={task.priority} size="xs" />
                    <StatusBadge status={task.status} size="xs" />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No tasks found" description="Create a task to get started." />
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Intern */}
      <Modal
        isOpen={isAddInternOpen}
        onClose={() => setIsAddInternOpen(false)}
        title="Add New Intern"
        subtitle="Create an intern account to assign tasks and track performance."
      >
        <form onSubmit={handleCreateIntern} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Maya Lin"
            value={internForm.name}
            onChange={(e) => setInternForm({ ...internForm, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="maya.lin@internpulse.com"
            value={internForm.email}
            onChange={(e) => setInternForm({ ...internForm, email: e.target.value })}
            required
          />

          <Input
            label="Initial Password"
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={internForm.password}
            onChange={(e) => setInternForm({ ...internForm, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={internForm.phone}
              onChange={(e) => setInternForm({ ...internForm, phone: e.target.value })}
            />

            <Select
              label="Department"
              name="department"
              value={internForm.department}
              onChange={(e) => setInternForm({ ...internForm, department: e.target.value })}
              options={[
                'Frontend Engineering',
                'Backend Engineering',
                'Full-Stack Development',
                'UI/UX Design',
                'Quality Assurance',
                'Data Science',
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={internForm.joiningDate}
              onChange={(e) => setInternForm({ ...internForm, joiningDate: e.target.value })}
              required
            />

            <Select
              label="Account Status"
              name="status"
              value={internForm.status}
              onChange={(e) => setInternForm({ ...internForm, status: e.target.value })}
              options={['Active', 'Completed']}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAddInternOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Create Intern Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Task */}
      <Modal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        title="Create & Assign Task"
        subtitle="Define instructions, assign an intern, and set milestone deadline."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g. Implement Form Validation"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Task Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe requirements, deliverables, and acceptance criteria..."
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="block w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assign To Intern"
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              options={internsList.map((i) => ({
                value: i._id,
                label: `${i.name} (${i.department})`,
              }))}
              placeholder="Choose an intern..."
              required
            />

            <Select
              label="Priority Level"
              name="priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High']}
              required
            />
          </div>

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            required
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCreateTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Assign Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
