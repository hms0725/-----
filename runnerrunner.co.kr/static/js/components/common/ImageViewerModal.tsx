import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  touch-action: none; /* 브라우저 기본 터치 동작 방지 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  color: white;
  border-radius: 9999px;
  transition: background-color 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
  }
`;

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const ZoomInfo = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 60;
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    bottom: 8px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media (pointer: fine) {
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
`;

interface StyledImageProps {
  $x: number;
  $y: number;
  $scale: number;
  $isLoading: boolean;
  $transition: boolean;
}

const StyledImage = styled.img<StyledImageProps>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(
      calc(-50% + ${(props) => props.$x}px),
      calc(-50% + ${(props) => props.$y}px)
    )
    scale(${(props) => props.$scale});
  transition: ${(props) =>
    props.$transition ? "transform 0.2s, opacity 0.3s" : "opacity 0.3s"};
  opacity: ${(props) => (props.$isLoading ? 0 : 1)};
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const ImageViewerModal = ({
  isOpen,
  onClose,
  imageUrl,
}: ImageViewerModalProps) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [useTransition, setUseTransition] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistance = useRef<number | null>(null);
  const lastTouchDistance = useRef<number | null>(null);

  // 이미지 로드 완료 시 처리
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    if (imageRef.current && containerRef.current) {
      const imgWidth = imageRef.current.naturalWidth;
      const imgHeight = imageRef.current.naturalHeight;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const widthRatio = containerWidth / imgWidth;
      const heightRatio = containerHeight / imgHeight;

      const initialScale = Math.min(widthRatio, heightRatio);
      setScale(initialScale);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(0.5, scale + delta), 5);

      if (scale !== newScale) {
        const scaleDiff = newScale - scale;
        const newX = position.x - ((x - rect.width / 2) * scaleDiff) / scale;
        const newY = position.y - ((y - rect.height / 2) * scaleDiff) / scale;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    };

    // wheel 이벤트 리스너를 non-passive로 설정
    container.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelEvent);
    };
  }, [isOpen, scale, position]);

  // 터치 시작
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialTouchDistance.current = distance;
        lastTouchDistance.current = distance;
        setUseTransition(false);
      } else if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
        setUseTransition(true);
      }
    },
    [position]
  );

  // 터치 이동
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDistance.current !== null) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastTouchDistance.current !== null) {
          const delta = distance - lastTouchDistance.current;
          const newScale = Math.min(Math.max(0.5, scale + delta * 0.01), 5);

          if (containerRef.current && scale !== newScale) {
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = (touch1.clientX + touch2.clientX) / 2;
            const centerY = (touch1.clientY + touch2.clientY) / 2;
            const x = centerX - rect.left;
            const y = centerY - rect.top;
            const scaleDiff = newScale - scale;

            // 부드러운 확대/축소를 위한 위치 조정
            const newX =
              position.x - ((x - rect.width / 2) * scaleDiff) / scale;
            const newY =
              position.y - ((y - rect.height / 2) * scaleDiff) / scale;

            setScale(newScale);
            setPosition({ x: newX, y: newY });
          }
        }
        lastTouchDistance.current = distance;
      } else if (e.touches.length === 1 && isDragging) {
        const newX = e.touches[0].clientX - dragStart.x;
        const newY = e.touches[0].clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
      }
    },
    [isDragging, scale, position, dragStart]
  );

  // 터치 종료
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    initialTouchDistance.current = null;
    lastTouchDistance.current = null;
    setUseTransition(true);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (scale === 1) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setScale(2);
        setPosition({
          x: -(x - rect.width / 2),
          y: -(y - rect.height / 2),
        });
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    },
    [scale]
  );

  // 마우스 이벤트
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>

      <ImageContainer
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <StyledImage
          ref={imageRef}
          src={imageUrl}
          alt="확대된 이미지"
          draggable={false}
          onLoad={handleImageLoad}
          $x={position.x}
          $y={position.y}
          $scale={scale}
          $isLoading={isLoading}
          $transition={useTransition}
        />
      </ImageContainer>

      <ZoomInfo>{Math.round(scale * 100)}%</ZoomInfo>
    </ModalOverlay>
  );
};

export default ImageViewerModal;
