'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { Task, Priority, TaskStatus, PRIORITY_LABEL, STATUS_LABEL } from '@/lib/types';
import PriorityBadge from '@/components/PriorityBadge';

const PRIORITIES: Priority[] = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES: TaskStatus[] = ['TODO', 'DOING', 'ON_HOLD', 'COMPLETED'];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState('');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  async function load() {
    const data = await api.task(id);
    setTask(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Click-outside handler for priority dropdown
  useEffect(() => {
    if (!priorityOpen) return;
    function handle(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [priorityOpen]);

  // Click-outside handler for status dropdown
  useEffect(() => {
    if (!statusOpen) return;
    function handle(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [statusOpen]);

  async function updatePriority(priority: Priority) {
    setPriorityOpen(false);
    await api.updateTask(id, { priority });
    load();
  }

  async function updateStatus(status: TaskStatus) {
    setStatusOpen(false);
    await api.updateTask(id, { status });
    load();
  }

  async function postComment() {
    if (!comment.trim()) return;
    await api.addComment(id, comment.trim());
    setComment('');
    load();
  }

  if (!task) return <div className="p-6 text-sm text-ink-muted">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* Main column */}
      <div className="bg-surface border border-border rounded-md p-5">
        <h1 className="text-xl font-semibold mb-2">{task.title}</h1>
        {task.description && <p className="text-sm text-ink-muted mb-5">{task.description}</p>}

        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {task.labels.map((l) => (
              <span key={l.id} className="text-xs bg-surface-muted rounded px-2 py-0.5">
                {l.name}
              </span>
            ))}
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Subtasks</p>
            <div className="border border-border rounded-md overflow-hidden">
              <div className="grid grid-cols-[1fr_90px_100px] bg-surface-muted text-xs font-medium px-3 py-2">
                <span>Task</span>
                <span>Priority</span>
                <span>Due Date</span>
              </div>
              {task.subtasks.map((s) => (
                <div key={s.id} className="grid grid-cols-[1fr_90px_100px] px-3 py-2 text-sm border-t border-border">
                  <span>{s.title}</span>
                  <PriorityBadge priority={s.priority} />
                  <span className="text-ink-muted text-xs">
                    {s.dueDate ? format(new Date(s.dueDate), 'd MMM yyyy') : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <p className="text-sm font-medium mb-2">Comments</p>
          <div className="space-y-3 mb-4">
            {task.comments?.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-accent text-accent-fg text-xs flex items-center justify-center shrink-0 font-medium">
                  {(c.user.fullName || '?')[0]}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{c.user.fullName}</span>{' '}
                    <span className="text-ink-muted text-xs">
                      {format(new Date(c.createdAt), 'd MMM, HH:mm')}
                    </span>
                  </p>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            ))}
            {(!task.comments || task.comments.length === 0) && (
              <p className="text-sm text-ink-muted">No comments yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
              placeholder="Add a comment…"
              className="flex-1 text-sm border border-border rounded-md px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button onClick={postComment} className="text-sm bg-ink text-surface px-3 py-2 rounded-md">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar: Details + Updates */}
      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-sm font-medium mb-3">Details</p>

          <DetailRow label="Status">
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setStatusOpen((v) => !v)}
                className="text-sm hover:underline"
              >
                {STATUS_LABEL[task.status]}
              </button>
              {statusOpen && (
                <Dropdown>
                  {STATUSES.map((s) => (
                    <DropdownItem key={s} onClick={() => updateStatus(s)} selected={s === task.status}>
                      {STATUS_LABEL[s]}
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
            </div>
          </DetailRow>

          <DetailRow label="Priority">
            <div className="relative" ref={priorityRef}>
              <button onClick={() => setPriorityOpen((v) => !v)}>
                <PriorityBadge priority={task.priority} />
              </button>
              {priorityOpen && (
                <Dropdown>
                  {PRIORITIES.map((p) => (
                    <DropdownItem key={p} onClick={() => updatePriority(p)} selected={p === task.priority}>
                      {PRIORITY_LABEL[p]}
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
            </div>
          </DetailRow>

          <DetailRow label="Members">
            <div className="flex -space-x-1.5">
              {task.members.length === 0 && <span className="text-sm text-ink-muted">Add members</span>}
              {task.members.map((m) => (
                <div
                  key={m.userId}
                  className="w-6 h-6 rounded-full bg-accent text-accent-fg text-xs flex items-center justify-center border border-surface font-medium"
                >
                  {(m.user.fullName || '?')[0]}
                </div>
              ))}
            </div>
          </DetailRow>

          <DetailRow label="Due Date">
            <span className="text-sm">{task.dueDate ? format(new Date(task.dueDate), 'd MMM yyyy') : '—'}</span>
          </DetailRow>

          <DetailRow label="Reporter">
            <span className="text-sm">{task.reporter?.fullName || '—'}</span>
          </DetailRow>
        </div>

        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-sm font-medium mb-3">Updates</p>
          <div className="space-y-2">
            {task.activities?.map((a) => (
              <p key={a.id} className="text-xs text-ink-muted">
                <span className="font-medium text-ink">{a.user.fullName}</span> {a.action}
                {a.oldValue && a.newValue ? ` from ${a.oldValue} to ${a.newValue}` : ''}
              </p>
            ))}
            {(!task.activities || task.activities.length === 0) && (
              <p className="text-xs text-ink-muted">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-0 top-6 z-20 bg-surface border border-border rounded-md shadow-lg w-36 py-1">
      {children}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-surface-muted"
    >
      {children}
      {selected && <span>✓</span>}
    </button>
  );
}
