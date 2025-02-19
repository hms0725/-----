import React, { useState } from "react";
import styled from "styled-components";

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .star {
    font-size: 2rem;
    color: gray;
    cursor: pointer;
    position: relative;

    &.filled {
      color: gold;
    }

    &.half-filled::before {
      content: "★";
      color: gold;
      position: absolute;
      left: 0;
      width: 50%;
      overflow: hidden;
    }
  }
`;

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  const handleRatingChange = (index: number) => {
    onRatingChange(index);
  };

  const starClass = (index: number) => {
    if (index <= (hover || rating)) {
      return "star filled";
    }
    if (index === Math.ceil(hover || rating) && (hover || rating) % 1 !== 0) {
      return "star half-filled";
    }
    return "star";
  };

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={starClass(ratingValue)}
            onClick={() => handleRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(rating)}
          >
            ★
          </span>
        );
      })}
    </StarContainer>
  );
};

export default StarRating;
