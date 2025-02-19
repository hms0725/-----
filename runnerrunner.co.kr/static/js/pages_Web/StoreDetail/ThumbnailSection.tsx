// components/ThumbnailSection.tsx
import React from "react";
import styled from "styled-components";
import { EMPTY_IMAGE } from "../../../utils/common";

const ThumbnailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 30%;

  > .main {
    height: 100%;
    width: calc(75% - 2px);
    background: gray;
    object-fit: cover;
    max-width: 100%;
  }

  > .sub-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 25%;

    > .sub-wrapper {
      position: relative;
      width: 100%;
      flex: 1;
      overflow: hidden;

      .sub {
        width: 100%;
        height: 100%;
        background: gray;
        object-fit: cover;
      }

      .more {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: -0.24px;
        pointer-events: none;

        > img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
`;

interface ThumbnailSectionProps {
  images: Array<{ imageUrl: string }>;
  onImageClick: (index: number) => void;
}

const ThumbnailSection: React.FC<ThumbnailSectionProps> = ({
  images,
  onImageClick,
}) => {
  return (
    <ThumbnailWrapper>
      <img
        alt="main"
        className="main"
        src={
          images[0]
            ? images[0].imageUrl
            : "https://dfesoodpx4jgd.cloudfront.net/cafe/default.png"
        }
        onClick={() => onImageClick(0)}
      />
      {images && images.length > 1 && (
        <div className="sub-list">
          {[1, 2, 3].map((i) => (
            <div className="sub-wrapper" key={i}>
              <img
                alt="sub"
                className="sub"
                src={images[i] ? images[i].imageUrl : EMPTY_IMAGE}
                onClick={images[i] ? () => onImageClick(i) : undefined}
              />
              {i === 3 && images.length > 4 && (
                <div className="more">
                  <img src="/image-web/Icon/Photo.svg" />+{images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ThumbnailWrapper>
  );
};

export default ThumbnailSection;
