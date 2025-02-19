import React from "react";
import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../hooks/useScreenOrientation";

const PaginationWrapper = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  gap: 0px 8px;

  @media ${MEDIA_DESKTOP} {
    width: 100%;
    border-top: 1px solid #b7b7b7;
  }
`;

const Button = styled.div<{
  selected?: boolean;
  disabled?: boolean;
  size?: number;
}>`
  cursor: pointer;
  width: ${(props) => (props.size ? props.size : 32)}px;
  height: ${(props) => (props.size ? props.size : 32)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--Purple-100, #f0eaff);
  background: #fff;
  color: var(--Black-400, #444);
  text-align: center;
  font-family: Pretendard;
  font-size: ${(props) => (props.size ? 10 : 14)}px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  ${(props) =>
    props.selected &&
    `
    border: 1px solid var(--Purple-300, #6436e7);
    color: var(--Purple-300, #6436e7);
    font-weight: 700;
  `}

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.2;
    cursor: not-allowed;
    pointer-events: none;
  `}

  > svg {
    width: 20px;
    height: 20px;
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size,
}) => {
  const pageNumbers = [];
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationWrapper>
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <LeftArrow />
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          selected={currentPage === number}
          onClick={() => onPageChange(number)}
          size={size}
        >
          {number}
        </Button>
      ))}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <RightArrow />
      </Button>
    </PaginationWrapper>
  );
};

const LeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="#444444"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="#444444"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Pagination;
