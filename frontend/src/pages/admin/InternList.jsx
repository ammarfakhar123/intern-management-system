import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import API from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const InternList = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedIntern, setSelectedIntern] = useState(null);
  const [internDetails, setInternDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Frontend Engineering',
    joiningDate: '',
    endDate: '',
    status: 'Active',
  });

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (departmentFilter) params.department = departmentFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/interns', { params });
      setInterns(res.data);
    } catch (error) {
      toast.error('Failed to load interns list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInterns();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, departmentFilter, statusFilter]);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: 'Frontend Engineering',
      joiningDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'Active',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (intern) => {
    setSelectedIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      password: '', // leave empty to keep existing
      phone: intern.phone || '',
      department: intern.department || 'Frontend Engineering',
      joiningDate: intern.joiningDate ? intern.joiningDate.split('T')[0] : '',
      endDate: intern.endDate ? intern.endDate.split('T')[0] : '',
      status: intern.status || 'Active',
    });
    setIsEditModalOpen(true);
  };

  const openDetailModal = async (intern) => {
    setSelectedIntern(intern);
    setIsDetailModalOpen(true);
    try {
      setLoadingDetails(true);
      const res = await API.get(`/interns/${intern._id}`);
      setInternDetails(res.data);
    } catch (error) {
      toast.error('Failed to load intern details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const openDeleteDialog = (intern) => {
    setSelectedIntern(intern);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post('/interns', formData);
      toast.success('Intern account created successfully!');
      setIsAddModalOpen(false);
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create intern');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.put(`/interns/${selectedIntern._id}`, formData);
      toast.success('Intern details updated!');
      setIsEditModalOpen(false);
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update intern');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await API.delete(`/interns/${selectedIntern._id}`);
      toast.success('Intern deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchInterns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete intern');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Intern Name & Email',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-appText block text-xs">{row.name}</span>
            <span className="text-[11px] text-appText-muted flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => (
        <span className="font-medium text-slate-700">{row.department}</span>
      ),
    },
    {
      header: 'Joining Date',
      render: (row) => (
        <span className="text-appText-muted">
          {new Date(row.joiningDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Progress',
      className: 'w-44',
      render: (row) => (
        <div className="w-36">
          <ProgressBar
            progress={row.progress || 0}
            showLabel={true}
            size="sm"
            showStats={true}
            completed={row.completedTasks || 0}
            total={row.totalTasks || 0}
          />
        </div>
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
            onClick={() => openDetailModal(row)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-indigo-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            title="Edit Intern"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteDialog(row)}
            title="Delete Intern"
            className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Intern Directory
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage intern accounts, view department assignments, and track task completion.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={openAddModal}
          className="text-xs font-bold shrink-0"
        >
          Add New Intern
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-soft flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by name, email, or department..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: '', label: 'All Departments' },
              { value: 'Frontend Engineering', label: 'Frontend Engineering' },
              { value: 'Backend Engineering', label: 'Backend Engineering' },
              { value: 'Full-Stack Development', label: 'Full-Stack Development' },
              { value: 'UI/UX Design', label: 'UI/UX Design' },
              { value: 'Data Science', label: 'Data Science' },
            ]}
          />
        </div>

        <div className="w-full md:w-44">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </div>
      </div>

      {/* Interns DataTable */}
      <DataTable
        columns={columns}
        data={interns}
        loading={loading}
        emptyTitle="No interns found"
        emptyDescription="No interns match your search or filter criteria. Try adjusting filters or add a new intern."
      />

      {/* Modal: Add Intern */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Intern"
        subtitle="Create an intern profile with login credentials and department assignment."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Alex Morgan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="alex.morgan@internpulse.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              required
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Completed']}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              Add Intern
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Intern */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Intern Profile"
        subtitle="Update intern contact information, department, or status."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="New Password (optional)"
            name="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              required
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Completed']}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsEditModalOpen(false)}
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

      {/* Modal: Intern Details View */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Intern Overview & Progress"
        subtitle={selectedIntern?.name}
        maxWidth="max-w-2xl"
      >
        {loadingDetails ? (
          <LoadingSpinner label="Fetching intern records..." />
        ) : (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-base">
                  {selectedIntern?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-appText">
                    {selectedIntern?.name}
                  </h4>
                  <p className="text-xs text-appText-muted">
                    {selectedIntern?.email} • {selectedIntern?.phone || 'No phone'}
                  </p>
                  <p className="text-xs font-medium text-primary mt-0.5">
                    {selectedIntern?.department}
                  </p>
                </div>
              </div>

              <StatusBadge status={selectedIntern?.status} size="sm" />
            </div>

            {/* Calculated Progress Section */}
            <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-appText uppercase tracking-wider">
                  Overall Completion Progress
                </span>
                <span className="text-base font-extrabold text-primary">
                  {internDetails?.stats?.progress || 0}%
                </span>
              </div>
              <ProgressBar
                progress={internDetails?.stats?.progress || 0}
                showLabel={false}
                size="md"
              />
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-appText-muted block text-[10px]">Total</span>
                  <span className="font-bold text-appText">{internDetails?.stats?.totalTasks || 0}</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <span className="text-emerald-700 block text-[10px]">Completed</span>
                  <span className="font-bold text-emerald-700">{internDetails?.stats?.completedTasks || 0}</span>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 block text-[10px]">Submitted</span>
                  <span className="font-bold text-purple-700">{internDetails?.stats?.submittedTasks || 0}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <span className="text-amber-700 block text-[10px]">Pending</span>
                  <span className="font-bold text-amber-700">{internDetails?.stats?.pendingTasks || 0}</span>
                </div>
              </div>
            </div>

            {/* Tasks list */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Assigned Tasks ({internDetails?.tasks?.length || 0})
              </h5>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {internDetails?.tasks?.length > 0 ? (
                  internDetails.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 bg-white rounded-xl border border-surface-border flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-3">
                        <span className="font-bold text-appText block truncate">
                          {task.title}
                        </span>
                        <span className="text-[11px] text-appText-muted">
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
                  <p className="text-xs text-appText-muted text-center py-4">
                    No tasks currently assigned to this intern.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Intern Account"
        message="Are you sure you want to delete this intern? This will also remove their assigned tasks and submission records permanently."
        itemName={selectedIntern?.name}
        confirmText="Yes, Delete Intern"
        loading={submitting}
      />
    </div>
  );
};

export default InternList;
