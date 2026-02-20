"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      <span className="text-4xl mb-3">{icon}</span>
      <h2 className="font-display text-lg font-semibold text-sand-800">
        {title}
      </h2>
      <p className="mt-1 text-sm text-sand-500 max-w-xs">{description}</p>
    </div>
  );
}
