import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  MessageSquare,
  LayoutGrid,
  List,
} from 'lucide-react';
import API from '../../services/api';
import TaskCard from '../../components/common/TaskCard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [internFilter, setInternFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });

  // Feedback form state
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackDecision, setFeedbackDecision] = useState('approved');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (internFilter) params.internId = internFilter;
      if (search) params.search = search;

      const res = await API.get('/tasks', { params });
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await API.get('/interns');
      setInterns(res.data);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, priorityFilter, internFilter, search]);

  const openCreateModal = () => {
    setTaskForm({
      title: '',
      description: '',
      assignedTo: interns.length > 0 ? interns[0]._id : '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Pending',
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
    });
    setIsEditOpen(true);
  };

  const openReviewModal = async (task) => {
    setSelectedTask(task);
    setIsReviewOpen(true);
    setFeedbackComment('');
    setFeedbackDecision('approved');
    try {
      setLoadingDetails(true);
      const res = await API.get(`/tasks/${task._id}`);
      setTaskDetails(res.data);
    } catch (error) {
      toast.error('Failed to load task submission details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.assignedTo) {
      return toast.error('Please assign an intern');
    }
    try {
      setSubmitting(true);
      await API.post('/tasks', taskForm);
      toast.success('Task created successfully!');
      setIsCreateOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.put(`/tasks/${selectedTask._id}`, taskForm);
      toast.success('Task updated successfully!');
      setIsEditOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await API.delete(`/tasks/${selectedTask._id}`);
      toast.success('Task deleted successfully');
      setIsDeleteOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (decision) => {
    if (!feedbackComment.trim()) {
      return toast.error('Please provide a feedback comment');
    }
    try {
      setSubmitting(true);
      await API.post('/feedback', {
        taskId: selectedTask._id,
        comment: feedbackComment,
        decision,
      });

      if (decision === 'approved') {
        toast.success('Work approved! Task is now marked Completed.');
      } else {
        toast.success('Revision requested. Task status returned to In Progress.');
      }

      setIsReviewOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const tableColumns = [
    {
      header: 'Task Title',
      render: (row) => (
        <div>
          <span className="font-bold text-appText block text-xs">{row.title}</span>
          <span className="text-[11px] text-appText-muted line-clamp-1 max-w-xs">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: 'Assigned Intern',
      render: (row) => (
        <span className="font-medium text-slate-700">
          {row.assignedTo?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Priority',
      render: (row) => <StatusBadge status={row.priority} size="xs" />,
    },
    {
      header: 'Due Date',
      render: (row) => (
        <span className="text-appText-muted">
          {new Date(row.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openReviewModal(row)}
            title="View Details & Review"
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-indigo-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            title="Edit Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            title="Delete Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const latestSubmission = taskDetails?.submissions?.[0];

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Task Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Assign tasks, monitor milestone progress, and review intern submissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={openCreateModal}
            className="text-xs shrink-0"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-soft flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search tasks by title..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-44">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Submitted', label: 'Submitted' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </div>

        <div className="w-full md:w-36">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
        </div>

        <div className="w-full md:w-52">
          <Select
            value={internFilter}
            onChange={(e) => setInternFilter(e.target.value)}
            options={[
              { value: '', label: 'All Interns' },
              ...interns.map((i) => ({ value: i._id, label: i.name })),
            ]}
          />
        </div>
      </div>

      {/* Tasks View: Grid or Table */}
      {viewMode === 'grid' ? (
        loading ? (
          <div className="bg-white rounded-2xl border border-surface-border p-12">
            <LoadingSpinner label="Loading tasks..." />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-appText">No tasks found</h4>
            <p className="text-xs text-appText-muted mt-1 max-w-sm mx-auto">
              No tasks match your selected filters. Create a new task or reset the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                isAdmin={true}
                onView={openReviewModal}
              />
            ))}
          </div>
        )
      ) : (
        <DataTable
          columns={tableColumns}
          data={tasks}
          loading={loading}
          emptyTitle="No tasks found"
          emptyDescription="Try selecting a different filter or create a new task."
        />
      )}

      {/* Modal: Create Task */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
        subtitle="Define requirements and assign to an enrolled intern."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g. Implement Responsive Dashboard"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Task Description <span className="text-danger">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Detailed instructions, tech stack expectations, and acceptance criteria..."
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="block w-full rounded-xl border border-surface-border p-3 text-sm text-appText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Intern"
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              options={interns.map((i) => ({
                value: i._id,
                label: `${i.name} (${i.department})`,
              }))}
              required
            />

            <Select
              label="Priority"
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

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Task */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Task Details"
        subtitle="Update task specifications, priority, deadline, or assigned intern."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Task Description <span className="text-danger">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="block w-full rounded-xl border border-surface-border p-3 text-sm text-appText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Intern"
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              options={interns.map((i) => ({
                value: i._id,
                label: `${i.name} (${i.department})`,
              }))}
              required
            />

            <Select
              label="Priority"
              name="priority"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              options={['Low', 'Medium', 'High']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              required
            />

            <Select
              label="Task Status"
              name="status"
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
              options={['Pending', 'In Progress', 'Submitted', 'Completed']}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Task Details & Submission Review (Admin Feedback) */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Task Details & Review"
        subtitle={selectedTask?.title}
        maxWidth="max-w-2xl"
      >
        {loadingDetails ? (
          <LoadingSpinner label="Loading submission details..." />
        ) : (
          <div className="space-y-6">
            {/* Task Info Header */}
            <div className="bg-slate-50 p-4 rounded-xl border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Assigned Intern:{' '}
                  <span className="text-primary">
                    {taskDetails?.task?.assignedTo?.name || 'Unassigned'}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={taskDetails?.task?.priority} size="xs" />
                  <StatusBadge status={taskDetails?.task?.status} size="xs" />
                </div>
              </div>
              <p className="text-xs text-appText-muted leading-relaxed">
                {taskDetails?.task?.description}
              </p>
              <div className="text-[11px] text-appText-muted pt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Due Date:{' '}
                  {new Date(taskDetails?.task?.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Submission Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                Latest Intern Submission
              </h4>

              {latestSubmission ? (
                <div className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary">
                      Submitted on{' '}
                      {new Date(latestSubmission.submittedAt).toLocaleString()}
                    </span>
                    <StatusBadge status={latestSubmission.status} size="xs" />
                  </div>

                  <p className="text-xs text-appText leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {latestSubmission.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {latestSubmission.githubLink && (
                      <a
                        href={latestSubmission.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub Repository
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}

                    {latestSubmission.projectLink && (
                      <a
                        href={latestSubmission.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-200 bg-indigo-50/50 text-xs font-semibold text-primary hover:bg-indigo-50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo / Project Link
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-surface-border text-center text-xs text-appText-muted">
                  The intern has not submitted work for this task yet.
                </div>
              )}
            </div>

            {/* Previous Feedback History */}
            {taskDetails?.feedback?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Feedback History
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {taskDetails.feedback.map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-slate-50 rounded-xl border border-surface-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">
                          {item.adminId?.name || 'Admin'}
                        </span>
                        <StatusBadge status={item.decision} size="xs" />
                      </div>
                      <p className="text-appText-muted">{item.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Feedback & Approval Action Box */}
            <div className="pt-4 border-t border-surface-border space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Provide Admin Feedback & Evaluation
              </label>

              <textarea
                rows={3}
                placeholder="Write constructive review comments, suggestions, or notes for the intern..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="block w-full rounded-xl border border-surface-border p-3 text-xs text-appText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              />

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsReviewOpen(false)}
                >
                  Close
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleFeedbackSubmit('changes_requested')}
                  loading={submitting}
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Request Changes
                </Button>

                <Button
                  variant="success"
                  size="md"
                  icon={CheckCircle2}
                  onClick={() => handleFeedbackSubmit('approved')}
                  loading={submitting}
                >
                  Approve Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? All related submissions and evaluations will be removed."
        itemName={selectedTask?.title}
        confirmText="Yes, Delete Task"
        loading={submitting}
      />
    </div>
  );
};

export default TaskList;
