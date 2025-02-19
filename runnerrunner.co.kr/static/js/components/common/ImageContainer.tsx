import styled from "styled-components";
import React from "react";

// Props 타입 정의
interface AspectRatioContainerProps {
  ratio: number;
}

const AspectRatioContainer = styled.div<AspectRatioContainerProps>`
  width: 100%;
  position: relative;

  &::before {
    content: "";
    display: block;
    padding-top: ${(props) => (1 / props.ratio) * 100}%;
  }
`;

const ResponsiveImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 컴포넌트 props 타입 정의
interface ImageContainerProps {
  src: string;
  alt: string;
  ratio?: number;
}

const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  ratio = 1,
}) => (
  <AspectRatioContainer ratio={ratio}>
    <ResponsiveImage src={src} alt={alt} loading="lazy" />
  </AspectRatioContainer>
);

export default ImageContainer;
