import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";

const ErrorRetry = ({ title = "Something went wrong", message, onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-3 rounded-2xl border border-subtle bg-surface px-6 py-16 text-center"
  >
    <span className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
      <WarningCircle size={24} />
    </span>
    <p className="text-lg font-medium text-content">{title}</p>
    {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
      >
        <ArrowClockwise size={16} />
        Try again
      </button>
    )}
  </div>
);

export default ErrorRetry;
