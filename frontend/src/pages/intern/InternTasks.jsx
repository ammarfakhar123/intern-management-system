import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Send,
  MessageSquare,
} from 'lucide-react';
import API from '../../services/api';
import TaskCard from '../../components/common/TaskCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const InternTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Work Submission Form
  const [submissionForm, setSubmissionForm] = useState({
    githubLink: '',
    projectLink: '',
    description: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search) params.search = search;

      const res = await API.get('/tasks', { params });
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, priorityFilter, search]);

  const handleStartTask = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: 'In Progress' });
      toast.success('Task started! Status is now In Progress.');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start task');
    }
  };

  const openDetailModal = async (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
    try {
      setLoadingDetails(true);
      const res = await API.get(`/tasks/${task._id}`);
      setTaskDetails(res.data);
    } catch (error) {
      toast.error('Failed to load task details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const openSubmitModal = (task) => {
    setSelectedTask(task);
    setSubmissionForm({
      githubLink: '',
      projectLink: '',
      description: '',
    });
    setIsSubmitModalOpen(true);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionForm.description.trim()) {
      return toast.error('Please provide a description of your work');
    }

    try {
      setSubmitting(true);
      await API.post('/submissions', {
        taskId: selectedTask._id,
        githubLink: submissionForm.githubLink,
        projectLink: submissionForm.projectLink,
        description: submissionForm.description,
      });

      toast.success('Work submitted successfully! Task status updated to Submitted.');
      setIsSubmitModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  const latestSubmission = taskDetails?.submissions?.[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          My Assigned Tasks
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View milestone requirements, start assigned tasks, and submit deliverables for evaluation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-soft flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search tasks by title..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
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

        <div className="w-full sm:w-40">
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
      </div>

      {/* Task Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12">
          <LoadingSpinner label="Loading your tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Clear search or filter filters to view your assigned tasks."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              isAdmin={false}
              onView={openDetailModal}
              onStart={handleStartTask}
              onSubmitWork={openSubmitModal}
            />
          ))}
        </div>
      )}

      {/* Modal: Task Details & History */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Task Specifications"
        subtitle={selectedTask?.title}
        maxWidth="max-w-2xl"
      >
        {loadingDetails ? (
          <LoadingSpinner label="Loading specifications..." />
        ) : (
          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-appText-muted">
                  Due:{' '}
                  <strong className="text-appText">
                    {new Date(taskDetails?.task?.dueDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </strong>
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={taskDetails?.task?.priority} size="xs" />
                  <StatusBadge status={taskDetails?.task?.status} size="xs" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Instructions & Requirements
                </h4>
                <p className="text-xs text-appText leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-surface-border">
                  {taskDetails?.task?.description}
                </p>
              </div>
            </div>

            {/* Submissions Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-primary" />
                Work Submission Status
              </h4>

              {latestSubmission ? (
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-secondary">
                      Submitted on {new Date(latestSubmission.submittedAt).toLocaleString()}
                    </span>
                    <StatusBadge status={latestSubmission.status} size="xs" />
                  </div>

                  <p className="text-appText bg-white p-3 rounded-lg border border-surface-border">
                    {latestSubmission.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {latestSubmission.githubLink && (
                      <a
                        href={latestSubmission.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub Repo
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                    {latestSubmission.projectLink && (
                      <a
                        href={latestSubmission.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-200 bg-indigo-50 text-xs font-semibold text-primary hover:bg-indigo-100"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo Link
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-surface-border text-center text-xs text-appText-muted">
                  You have not submitted work for this task yet.
                </div>
              )}
            </div>

            {/* Admin Feedback */}
            {taskDetails?.feedback?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-secondary" />
                  Admin Feedback & Review
                </h4>
                <div className="space-y-2">
                  {taskDetails.feedback.map((item) => (
                    <div
                      key={item._id}
                      className="p-3.5 rounded-xl border border-surface-border bg-slate-50 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">
                          {item.adminId?.name || 'Administrator'}
                        </span>
                        <StatusBadge status={item.decision} size="xs" />
                      </div>
                      <p className="text-appText leading-relaxed">
                        "{item.comment}"
                      </p>
                      <span className="text-[10px] text-appText-muted block">
                        Reviewed on {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-surface-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedTask?.status === 'Pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => {
                      handleStartTask(selectedTask._id);
                      setIsDetailModalOpen(false);
                    }}
                  >
                    Start Task
                  </Button>
                )}

                {(selectedTask?.status === 'In Progress' ||
                  selectedTask?.status === 'Submitted') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Send}
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      openSubmitModal(selectedTask);
                    }}
                  >
                    {selectedTask?.status === 'Submitted'
                      ? 'Resubmit Work'
                      : 'Submit Work'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Submit Work */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Completed Work"
        subtitle={selectedTask?.title}
      >
        <form onSubmit={handleSubmitWork} className="space-y-4">
          <Input
            label="GitHub Repository Link (optional)"
            name="githubLink"
            placeholder="https://github.com/username/repository"
            icon={Github}
            value={submissionForm.githubLink}
            onChange={(e) =>
              setSubmissionForm({ ...submissionForm, githubLink: e.target.value })
            }
          />

          <Input
            label="Project / Live Demo URL (optional)"
            name="projectLink"
            placeholder="https://your-demo-url.dev"
            icon={ExternalLink}
            value={submissionForm.projectLink}
            onChange={(e) =>
              setSubmissionForm({ ...submissionForm, projectLink: e.target.value })
            }
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Work Description & Summary <span className="text-danger">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Explain how you solved the requirements, key features implemented, and any notes for the reviewer..."
              value={submissionForm.description}
              onChange={(e) =>
                setSubmissionForm({ ...submissionForm, description: e.target.value })
              }
              className="block w-full rounded-xl border border-surface-border p-3 text-xs text-appText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={submitting}
            >
              Submit for Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InternTasks;
