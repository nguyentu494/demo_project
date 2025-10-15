export default function Loading() {
  return (
    <main className="p-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"
          />
        ))}
      </div>
      <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </main>
  );
}
