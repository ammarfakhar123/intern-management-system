import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  itemName,
  confirmText = 'Delete',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-xl font-black text-slate-900">{title}</h3>

        <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed">
          {message}
        </p>

        {itemName && (
          <div className="mt-3 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 break-all">
            "{itemName}"
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="flex-1 font-bold border-slate-300 text-slate-700"
          >
            Cancel
          </Button>

          <Button
            variant={confirmVariant}
            size="md"
            onClick={onConfirm}
            loading={loading}
            className="flex-1 font-bold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
