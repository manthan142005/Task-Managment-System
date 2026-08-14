'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Task } from '@/lib/types';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block bg-surface border border-border rounded-md p-3 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <span className="text-ink-muted text-xs shrink-0">···</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        {(task.reporter || task.members?.length > 0) && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-accent text-accent-fg text-[10px] flex items-center justify-center font-medium">
              {(task.reporter?.fullName || task.members?.[0]?.user?.fullName || '?')[0]}
            </div>
          </div>
        )}
        {task.dueDate && (
          <span className="text-xs bg-red-50 text-red-600 rounded px-1.5 py-0.5">
            {format(new Date(task.dueDate), 'd MMM')}
          </span>
        )}
      </div>
      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.slice(0, 2).map((l) => (
            <span key={l.id} className="text-[10px] bg-surface-muted text-ink-muted rounded px-1.5 py-0.5">
              {l.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
