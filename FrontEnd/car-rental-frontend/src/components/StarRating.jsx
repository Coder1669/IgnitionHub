import React, { useState } from "react";

const StarRating = ({ rating, onRatingChange, editable = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (editable) setHoverRating(index);
  };
  const handleMouseLeave = () => {
    if (editable) setHoverRating(0);
  };
  const handleClick = (index) => {
    if (editable) onRatingChange(index);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hoverRating || rating) >= i;
        return (
          <svg
            key={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
            xmlns="http://www.w3.org/2000/svg"
            fill={filled ? "gold" : "none"}
            viewBox="0 0 24 24"
            stroke="gold"
            className={`w-6 h-6 cursor-${editable ? "pointer" : "default"} transition-colors`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.973 2.887a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.973-2.887a1 1 0 00-1.175 0l-3.973 2.887c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.09 10.1c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z"
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
