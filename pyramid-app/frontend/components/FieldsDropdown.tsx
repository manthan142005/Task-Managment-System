'use client';

import { useEffect, useRef, useState } from 'react';

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export const DEFAULT_FIELDS: FieldVisibility = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
};

const FIELD_LABELS: { key: keyof FieldVisibility; label: string }[] = [
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'labels', label: 'Labels' },
  { key: 'status', label: 'Status' },
  { key: 'reporter', label: 'Reporter' },
];

export default function FieldsDropdown({
  fields,
  onChange,
}: {
  fields: FieldVisibility;
  onChange: (f: FieldVisibility) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm border border-border rounded-md px-3 py-1.5 hover:bg-surface-muted flex items-center gap-1.5"
      >
        <ColumnsIcon /> Fields
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 bg-surface border border-border rounded-md shadow-lg w-40 py-1">
          {FIELD_LABELS.map((f) => (
            <label
              key={f.key}
              className="flex items-center justify-between px-3 py-1.5 text-sm hover:bg-surface-muted cursor-pointer"
            >
              {f.label}
              <input
                type="checkbox"
                checked={fields[f.key]}
                onChange={(e) => onChange({ ...fields, [f.key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ColumnsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1" y="2" width="14" height="12" rx="1.5" />
      <line x1="6" y1="2" x2="6" y2="14" />
      <line x1="10.5" y1="2" x2="10.5" y2="14" />
    </svg>
  );
}
