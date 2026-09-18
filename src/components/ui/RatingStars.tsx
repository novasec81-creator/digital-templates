import { Star } from "lucide-react";

export function RatingStars({
  rating,
  count,
  size = "h-4 w-4",
}: {
  rating: number;
  count?: number;
  size?: string;
}) {
  if (rating <= 0) return null;
  return (
    <div className="flex items-center gap-1" aria-label={`Note moyenne : ${rating.toFixed(1)} sur 5`}>
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${size} ${
              i <= Math.round(rating) ? "text-amber-400" : "text-gray-300"
            }`}
            fill="currentColor"
          />
        ))}
      </span>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)}
        {typeof count === "number" && count > 0 ? ` (${count})` : ""}
      </span>
    </div>
  );
}