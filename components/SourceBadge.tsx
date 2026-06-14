import { ExternalLink } from "lucide-react";
import { getSourceRefs } from "@/features/biology/content";

export function SourceBadge({ sourceRefIds }: { sourceRefIds: string[] }) {
  const refs = getSourceRefs(sourceRefIds);

  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((ref) => (
        <a
          key={ref.id}
          href={ref.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:border-moss hover:text-moss"
          title={ref.locator}
        >
          {ref.label}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
