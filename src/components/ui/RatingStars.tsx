import { Star } from "lucide-react";

export default function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-[var(--color-text-primary)]">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
    </span>
  );
}
