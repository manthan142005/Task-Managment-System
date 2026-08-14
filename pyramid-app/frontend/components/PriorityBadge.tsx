import { Priority, PRIORITY_LABEL } from '@/lib/types';

const CLASS: Record<Priority, string> = {
  URGENT: 'priority-urgent',
  HIGH: 'priority-high',
  MEDIUM: 'priority-medium',
  LOW: 'priority-low',
  NO_PRIORITY: 'priority-none',
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'NO_PRIORITY') {
    return <span className="text-xs text-ink-muted">·</span>;
  }
  return (
    <span className={`text-xs font-medium inline-flex items-center gap-1 ${CLASS[priority]}`}>
      <BarsIcon /> {PRIORITY_LABEL[priority]}
    </span>
  );
}

function BarsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="9" width="3" height="5" rx="0.5" />
      <rect x="6.5" y="6" width="3" height="8" rx="0.5" />
      <rect x="12" y="2" width="3" height="12" rx="0.5" />
    </svg>
  );
}
