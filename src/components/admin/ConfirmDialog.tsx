"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-lg border border-charcoal-700 bg-charcoal-900 p-6">
        <h3 className="mb-2 font-serif text-lg text-cream-50">{title}</h3>
        <p className="mb-6 text-sm text-charcoal-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-charcoal-700 px-4 py-2 text-sm text-charcoal-300 hover:bg-charcoal-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
