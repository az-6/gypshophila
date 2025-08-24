import React from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showLabel = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const StarIcon = ({ filled, index }: { filled: boolean; index: number }) => (
    <svg
      className={`${sizeClasses[size]} ${
        filled ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  if (interactive && onRatingChange) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onRatingChange(starValue)}
              className={`${
                buttonSizeClasses[size]
              } flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 transform ${
                starValue <= rating
                  ? "text-yellow-400 bg-yellow-50 border-2 border-yellow-200"
                  : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-200"
              }`}
            >
              <StarIcon filled={starValue <= rating} index={index} />
            </button>
          );
        })}
        {showLabel && (
          <span className="ml-2 text-sm text-gray-600 font-medium">
            Rating yang dipilih: {rating}/{maxRating}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => (
        <StarIcon key={index} filled={index < rating} index={index} />
      ))}
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
