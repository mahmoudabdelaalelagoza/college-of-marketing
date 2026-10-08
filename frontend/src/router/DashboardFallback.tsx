/**
 * Loading state for the code-split dashboard routes.
 *
 * Kept in its own module so `config.tsx` only exports route objects, which is
 * required for React Fast Refresh to work in development.
 */
export default function DashboardFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background-100"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-foreground-600">Loading the dashboard&hellip;</p>
    </div>
  );
}