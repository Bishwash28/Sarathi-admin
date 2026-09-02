export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--color-accent-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
