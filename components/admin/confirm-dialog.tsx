"use client";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg p-6 bg-[var(--admin-bg)] border border-[var(--admin-accent-soft)]"
        style={{ color: "var(--admin-foreground)" }}
      >
        <h2 className="text-base font-semibold mb-2">{title}</h2>
        <p className="text-sm text-[var(--admin-foreground)]/70 mb-6 whitespace-pre-line">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="font-mono text-xs px-4 py-2 rounded-md text-[var(--admin-foreground)]/60 hover:text-[var(--admin-foreground)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`font-mono text-xs px-4 py-2 rounded-md transition-opacity hover:opacity-90 ${
              danger ? "bg-red-600 text-white" : "bg-[var(--admin-accent)] text-[var(--admin-bg)]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}