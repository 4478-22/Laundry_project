import { CircleAlert as AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-error-50 text-error-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
          </div>
        </div>
        <p className="mt-3 text-sm text-neutral-500">{message}</p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-error-600 px-6 py-3.5 font-semibold text-white shadow-card transition-all active:scale-[0.98] hover:bg-error-700">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
