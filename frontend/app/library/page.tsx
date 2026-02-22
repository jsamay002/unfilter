import Link from "next/link";

const DIVISIONS = [
  {
    slug: "bronze",
    label: "Bronze",
    description: "Fundamentals: simulation, sorting, ad-hoc reasoning.",
    ready: true,
  },
  {
    slug: "silver",
    label: "Silver",
    description: "Binary search, prefix sums, DFS/BFS, greedy.",
    ready: false,
  },
  {
    slug: "gold",
    label: "Gold",
    description: "DP, segment trees, advanced graph algorithms.",
    ready: false,
  },
];

/**
 * Library page — division selector.
 * Users pick a USACO division, then see that division's problem list.
 */
export default function LibraryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Problem Library</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Choose a division to browse problems.
      </p>

      <div className="grid gap-4">
        {DIVISIONS.map((div) => (
          <div
            key={div.slug}
            className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{div.label}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {div.description}
              </p>
            </div>

            {div.ready ? (
              <Link
                href={`/library/${div.slug}`}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium whitespace-nowrap"
              >
                Browse
              </Link>
            ) : (
              <span className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed whitespace-nowrap">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
