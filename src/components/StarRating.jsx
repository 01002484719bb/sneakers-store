import { Star } from "lucide-react";

export default function StarRating({ rating, reviews, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold">{rating}</span>
      {reviews !== undefined && (
        <span className="text-xs text-stone-500">({reviews})</span>
      )}
    </div>
  );
}