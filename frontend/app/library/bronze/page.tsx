import Link from "next/link";

/**
 * Static Bronze problem data.
 * In Task B we'll move this to a shared data/problems.ts file.
 * For now, inline is fine to get the page working.
 */
const BRONZE_PROBLEMS = [
  {
    id: "sample-1",
    title: "Sample Problem 1",
    subtitle: "Learn the full Model-Before-Code workflow on one example.",
    tags: ["Simulation", "Ad-hoc"],
    steps: 5,
  },
];

/**
 * Bronze Library — lists all Bronze-level problems with metadata.
 * Each card links to /session/bronze/[id] to start the guided session.
 */
export default function BronzeLibraryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Bronze</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Pick a problem. Algo-Coach will guide your reasoning before you code.
      </p>

      <div className="grid gap-4">
        {BRONZE_PROBLEMS.map((problem) => (
          <div
            key={problem.id}
            className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-start justify-between gap-4"
          >
            <div>
              <h2 className="text-lg font-semibold">{problem.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {problem.subtitle}
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {problem.steps} steps
                </span>
              </div>
            </div>

            <Link
              href={`/session/bronze/${problem.id}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
            >
              Start Session
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/library"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          &larr; All Divisions
        </Link>
      </div>
    </div>
  );
}
