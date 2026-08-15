import Link from "next/link";
import type { ReactNode } from "react";

type SettingsShellProps = {
  active: string;
  children: ReactNode;
};

export function SettingsShell({
  active,
  children,
}: SettingsShellProps) {
  const items = [
    { key: "profile", label: "Profile", href: "/settings/profile" },
    { key: "theme", label: "Theme", href: "/settings/theme" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto grid grid-cols-[160px_1fr] gap-8">
      <div>
        <Link
          href="/tasks"
          className="text-sm text-ink-muted hover:underline block mb-4"
        >
          ← Back to app
        </Link>

        <nav className="space-y-0.5">
          {items.map((i) => (
            <Link
              key={i.key}
              href={i.href}
              className={`block px-2 py-1.5 rounded-md text-sm ${
                active === i.key
                  ? "bg-accent-soft text-accent font-medium"
                  : "hover:bg-surface-muted"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  );
}