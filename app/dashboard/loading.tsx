export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 py-8 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-xl bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
      </div>
      <div className="h-64 rounded-xl bg-muted" />
    </div>
  );
}
