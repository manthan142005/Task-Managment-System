'use client';

import { Task, TaskStatus, STATUS_LABEL } from '@/lib/types';
import TaskCard from './TaskCard';

export default function StatusColumn({
  status,
  tasks,
  onAddTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}) {
  return (
    <div className="w-72 shrink-0 bg-surface-muted rounded-md p-2 flex flex-col max-h-full">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-sm font-medium flex items-center gap-1.5">
          <span aria-hidden>⠿</span> {STATUS_LABEL[status]}
        </span>
        <span className="text-xs text-ink-muted">{tasks.length}</span>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
      <button
        onClick={() => onAddTask(status)}
        className="text-sm text-ink-muted hover:text-ink text-left px-1 pt-2"
      >
        + Add Task
      </button>
    </div>
  );
}
