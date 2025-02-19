import React from "react";
import styled from "styled-components";

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .star {
    font-size: 14px;
    color: gray;
    position: relative;

    &.filled {
      color: red;
    }

    &.half-filled::before {
      content: "★";
      color: red;
      position: absolute;
      left: 0;
      width: 50%;
      overflow: hidden;
    }
  }
`;

interface StarDisplayProps {
  rating: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating }) => {
  const starClass = (index: number) => {
    if (index <= rating) {
      return "star filled";
    }
    if (index === Math.ceil(rating) && rating % 1 !== 0) {
      return "star half-filled";
    }
    return "star";
  };

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span key={index} className={starClass(ratingValue)}>
            ★
          </span>
        );
      })}
    </StarContainer>
  );
};

export default StarDisplay;
