import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Area } from "../../../api/area";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DropdownButton = styled.div<{ isOpen?: boolean }>`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid
    ${(props) =>
      props.isOpen
        ? "var(--Purple-300, #6436E7)"
        : "var(--Black-200, #E0E0E0)"};
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  > span {
    color: #808080;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > img {
    width: 24px;
    height: 24px;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.2s ease-in-out;
  }
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  width: calc(100% - 48px);
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 4px;
  border: 1px solid var(--Black-200, #e0e0e0);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  > .option {
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
      background: var(--Black-100, #f0f0f0);
    }

    > span {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;

interface LocationSelectProps {
  label: string;
  options: Area[];
  value?: Area;
  onChange: (area: Area) => void;
  placeholder?: string;
}

const LocationSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
}: LocationSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (area: Area) => {
    onChange(area);
    setIsOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`#${label}-dropdown`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper id={`${label}-dropdown`}>
      <DropdownButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{value ? value.name : placeholder}</span>
        <img src="/image-web/store/Arrow%20down.svg" alt="arrow" />
      </DropdownButton>
      <DropdownContent isOpen={isOpen}>
        {options.map((option) => (
          <div
            key={option.id}
            className="option"
            onClick={() => handleSelect(option)}
          >
            <span>{option.name}</span>
          </div>
        ))}
      </DropdownContent>
    </Wrapper>
  );
};

export default LocationSelect;
