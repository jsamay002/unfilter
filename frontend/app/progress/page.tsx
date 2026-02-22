/**
 * Progress page — placeholder for tracking stats.
 * Will read from localStorage to show: sessions completed, streaks,
 * weak-area heatmap, and division roadmap progress.
 */
export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Progress</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Track your reasoning sessions and identify areas to improve.
      </p>
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
        Coming soon — session stats and progress tracking.
      </div>
    </div>
  );
}
