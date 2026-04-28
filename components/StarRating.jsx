import React, { useState } from "react";

const StarRating = ({ value = 0, onChange, size = "text-2xl", readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${size} cursor-pointer transition-transform ${
            readonly ? "cursor-default" : "hover:scale-125"
          } ${
            (hover || value) >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
