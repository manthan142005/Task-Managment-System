'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Task } from '@/lib/types';
import PriorityBadge from './PriorityBadge';
import { FieldVisibility } from './FieldsDropdown';

export default function TaskRow({ task, fields }: { task: Task; fields: FieldVisibility }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="grid items-center gap-3 px-3 py-2.5 text-sm hover:bg-surface-muted border-b border-border last:border-b-0"
      style={{ gridTemplateColumns: '1fr 110px 90px 100px 32px' }}
    >
      <span className="truncate">{task.title}</span>
      {fields.priority ? <PriorityBadge priority={task.priority} /> : <span />}
      {fields.members ? <MembersAvatars task={task} /> : <span />}
      {fields.dueDate ? (
        <span className="text-ink-muted text-xs">
          {task.dueDate ? format(new Date(task.dueDate), 'd MMM yyyy') : '—'}
        </span>
      ) : (
        <span />
      )}
      <button
        onClick={(e) => e.preventDefault()}
        className="text-ink-muted hover:text-ink justify-self-end"
        aria-label="Task actions"
      >
        ···
      </button>
    </Link>
  );
}

function MembersAvatars({ task }: { task: Task }) {
  if (!task.members?.length) {
    return <span className="w-5 h-5 rounded-full border border-dashed border-border" />;
  }
  return (
    <div className="flex -space-x-1.5">
      {task.members.slice(0, 3).map((m) => (
        <div
          key={m.userId}
          title={m.user?.fullName}
          className="w-5 h-5 rounded-full bg-accent text-accent-fg text-[10px] flex items-center justify-center border border-surface font-medium"
        >
          {(m.user?.fullName || '?')[0]}
        </div>
      ))}
    </div>
  );
}
