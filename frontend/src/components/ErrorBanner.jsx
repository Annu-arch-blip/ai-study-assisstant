const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border-2 border-dashed border-[var(--color-red-pen)]/50 bg-[var(--color-red-pen-bg)] px-4 py-3 text-sm text-[var(--color-red-pen)]">
      <span className="font-[var(--font-marker)] text-lg leading-none">!</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorBanner;