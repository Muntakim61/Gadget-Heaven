const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-subtle bg-surface px-6 py-16 text-center">
    {Icon && (
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
        <Icon size={24} />
      </span>
    )}
    <p className="text-lg font-medium text-content">{title}</p>
    {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
