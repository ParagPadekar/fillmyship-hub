
import { Star as StarIcon } from "lucide-react";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    color?: string;
}

const StarRating = ({
    rating,
    maxRating = 5,
    size = 16,
    color = "text-yellow-400"
}: StarRatingProps) => {
    const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

    return (
        <div className="flex">
            {stars.map((star) => (
                <StarIcon
                    key={star}
                    size={size}
                    className={`${star <= rating ? color : "text-gray-300"}`}
                    fill={star <= rating ? "currentColor" : "none"}
                />
            ))}
        </div>
    );
};

export default StarRating;
