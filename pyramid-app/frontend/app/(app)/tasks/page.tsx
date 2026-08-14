'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Task, TaskStatus, STATUS_LABEL } from '@/lib/types';
import TaskRow from '@/components/TaskRow';
import StatusColumn from '@/components/StatusColumn';
import FieldsDropdown, { DEFAULT_FIELDS, FieldVisibility } from '@/components/FieldsDropdown';

const STATUSES: TaskStatus[] = ['TODO', 'DOING', 'ON_HOLD', 'COMPLETED'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [fields, setFields] = useState<FieldVisibility>(DEFAULT_FIELDS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Inline add-task modal state
  const [addingStatus, setAddingStatus] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function load(q?: string) {
    setLoading(true);
    try {
      const data = await api.tasks(q ? { search: q } : {});
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  // Bug 6 fix: load immediately on mount, then debounce only subsequent search changes.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      load();
      return;
    }
    const t = setTimeout(() => load(search), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], ON_HOLD: [], COMPLETED: [] };
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  // Bug 1 fix: open inline modal instead of prompt()
  function openAddTask(status: TaskStatus) {
    setAddingStatus(status);
    setNewTitle('');
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !addingStatus) return;
    setSaving(true);
    try {
      await api.createTask({ title: newTitle.trim(), status: addingStatus });
      setAddingStatus(null);
      setNewTitle('');
      load(search || undefined);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-md bg-surface w-44 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <FieldsDropdown fields={fields} onChange={setFields} />
          <div className="flex border border-border rounded-md overflow-hidden text-sm">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 ${view === 'list' ? 'bg-accent text-accent-fg' : 'bg-surface'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1.5 ${view === 'board' ? 'bg-accent text-accent-fg' : 'bg-surface'}`}
            >
              Board
            </button>
          </div>
          <button
            onClick={() => openAddTask('TODO')}
            className="bg-ink text-surface text-sm px-3 py-1.5 rounded-md font-medium"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Inline add-task modal */}
      {addingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleAddTask}
            className="bg-surface border border-border rounded-lg p-5 shadow-xl w-full max-w-sm"
          >
            <p className="text-sm font-medium mb-3">
              New task — <span className="text-ink-muted">{STATUS_LABEL[addingStatus]}</span>
            </p>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title…"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-accent mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAddingStatus(null)}
                className="text-sm border border-border px-3 py-1.5 rounded-md hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !newTitle.trim()}
                className="text-sm bg-ink text-surface px-3 py-1.5 rounded-md disabled:opacity-60"
              >
                {saving ? 'Adding…' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading tasks…</p>
      ) : view === 'list' ? (
        <div className="space-y-4">
          {STATUSES.map((status) =>
            grouped[status].length === 0 ? null : (
              <div key={status} className="bg-surface border border-border rounded-md overflow-hidden">
                <div className="px-3 py-2 text-sm font-medium bg-surface-muted border-b border-border">
                  {STATUS_LABEL[status]} · {grouped[status].length}
                </div>
                {grouped[status].map((t) => (
                  <TaskRow key={t.id} task={t} fields={fields} />
                ))}
                <button
                  onClick={() => openAddTask(status)}
                  className="w-full text-left text-sm text-ink-muted hover:text-ink px-3 py-2"
                >
                  + Add Task
                </button>
              </div>
            ),
          )}
          {tasks.length === 0 && (
            <p className="text-sm text-ink-muted py-10 text-center">
              No tasks yet. Create your first one to get started.
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {STATUSES.map((status) => (
            <StatusColumn key={status} status={status} tasks={grouped[status]} onAddTask={openAddTask} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <circle cx="7" cy="7" r="5.2" />
      <line x1="11" y1="11" x2="14.5" y2="14.5" />
    </svg>
  );
}
