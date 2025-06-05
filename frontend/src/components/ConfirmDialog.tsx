import { Dialog, DialogPanel, DialogTitle  } from '@headlessui/react';

type ConfirmDialogProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

export function ConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded shadow-md max-w-sm w-full">
          <DialogTitle  className="text-lg font-bold">{title}</DialogTitle >
          <div className="mt-2 text-sm text-gray-700">{message}</div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
