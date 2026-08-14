'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Project, Task, TaskStatus } from '@/lib/types';
import TaskRow from '@/components/TaskRow';
import { DEFAULT_FIELDS } from '@/components/FieldsDropdown';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [proj, t] = await Promise.all([api.project(id), api.tasks({ projectId: id })]);
      setProject(proj);
      setTasks(t);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setSaving(true);
    try {
      await api.createTask({ title: newTaskTitle.trim(), projectId: id, status: 'TODO' as TaskStatus });
      setNewTaskTitle('');
      setAddingTask(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-1.5 text-sm text-ink-muted mb-3">
        <Link href="/projects" className="hover:underline">Projects</Link>
        <span>›</span>
        <span className="text-ink">{project?.title || '…'}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">{project?.title}</h1>
        <button
          onClick={() => setAddingTask(true)}
          className="bg-ink text-surface text-sm px-3 py-1.5 rounded-md font-medium"
        >
          + Add Task
        </button>
      </div>

      {/* Inline add-task form */}
      {addingTask && (
        <form onSubmit={handleAddTask} className="mb-4 flex gap-2">
          <input
            autoFocus
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title…"
            className="flex-1 text-sm border border-border rounded-md px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={saving || !newTaskTitle.trim()}
            className="text-sm bg-ink text-surface px-3 py-2 rounded-md disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => { setAddingTask(false); setNewTaskTitle(''); }}
            className="text-sm border border-border px-3 py-2 rounded-md hover:bg-surface-muted"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        {loading ? (
          <p className="text-sm text-ink-muted py-10 text-center">Loading tasks…</p>
        ) : (
          <>
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} fields={DEFAULT_FIELDS} />
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-ink-muted py-10 text-center">No tasks in this project yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
