import Link from "next/link";

/**
 * Legacy /bronze route — redirects users to the canonical /library/bronze path.
 * Kept for backward compatibility with bookmarks / saved links.
 */
export default function BronzeLegacy() {
  return (
    <div>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        This page has moved.
      </p>
      <Link
        href="/library/bronze"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Go to Bronze Library &rarr;
      </Link>
    </div>
  );
}
