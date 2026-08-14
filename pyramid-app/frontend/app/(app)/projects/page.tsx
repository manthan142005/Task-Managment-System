'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import PriorityBadge from '@/components/PriorityBadge';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProject, setAddingProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setProjects(await api.projects());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      await api.createProject({ title: newTitle.trim() });
      setNewTitle('');
      setAddingProject(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Projects</h1>
        <button
          onClick={() => setAddingProject(true)}
          className="bg-ink text-surface text-sm px-3 py-1.5 rounded-md font-medium"
        >
          + Add Project
        </button>
      </div>

      {/* Inline add-project modal */}
      {addingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleAddProject}
            className="bg-surface border border-border rounded-lg p-5 shadow-xl w-full max-w-sm"
          >
            <p className="text-sm font-medium mb-3">New Project</p>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project title…"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-accent mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setAddingProject(false); setNewTitle(''); }}
                className="text-sm border border-border px-3 py-1.5 rounded-md hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !newTitle.trim()}
                className="text-sm bg-ink text-surface px-3 py-1.5 rounded-md disabled:opacity-60"
              >
                {saving ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px] px-3 py-2 text-xs font-medium text-ink-muted bg-surface-muted border-b border-border">
            <span>Project</span>
            <span>Priority</span>
            <span>Lead</span>
            <span>Due Date</span>
          </div>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="grid grid-cols-[1fr_100px_120px_100px] items-center px-3 py-2.5 text-sm hover:bg-surface-muted border-b border-border last:border-b-0"
            >
              <span>{p.title} <span className="text-ink-muted text-xs">· {p._count?.tasks ?? 0} tasks</span></span>
              <PriorityBadge priority={p.priority} />
              <span className="text-ink-muted text-xs">{p.lead?.fullName || '—'}</span>
              <span className="text-ink-muted text-xs">{p.dueDate ? format(new Date(p.dueDate), 'd MMM yyyy') : '—'}</span>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-ink-muted py-10 text-center">No projects yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
