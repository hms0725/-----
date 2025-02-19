import { PubType, TimerInfoState } from "../api/types";
import styled, { css } from "styled-components";
import { memo } from "react";
import { useMemo } from "react";
import { isPremiumAndVIP } from "../utils/common";

interface StoreMarkerProps {
  selected?: boolean;
  pubType?: PubType;
  buyInFrom?: number | null;
  buyInTo?: number | null;
  name?: string;
  timer?: TimerInfoState;
}
interface WrapperProps {
  pubType?: PubType;
  isSelected?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: #fff;
  padding: 5px 10px;
  transform: translateX(-50%);
  position: relative;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25));

  ${(props) =>
    isPremiumAndVIP(props.pubType) &&
    css`
      background: linear-gradient(180deg, #6a39f5 0%, #a180fe 100%), #7546f7;
    `}

  &::before {
    position: absolute;
    width: 7px;
    height: 6px;
    left: 50%;
    bottom: 1px;
    transform: translate(-50%, 100%);
    content: " ";
    ${(props) =>
      isPremiumAndVIP(props.pubType)
        ? css`
            background-image: url(/image-web/premium_map_marker_arrow.svg);
          `
        : css`
            background-image: url(/image-web/map_marker_arrow.svg);
          `}

    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  > .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    > .time {
      position: absolute;
      width: max-content;
      left: 50%;
      transform: translateX(-50%);
      top: -16px;
      background: red;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px 10px;

      font-family: Pretendard;
      font-size: 9px;
      font-weight: 600;
      line-height: 11px;
      color: rgba(255, 255, 255, 1);
    }

    > img {
      width: ${(props) =>
        props.isSelected
          ? css`
          18px
        `
          : "16px"};
      height: ${(props) =>
        props.isSelected
          ? css`
          18px
        `
          : "16px"};
    }

    > span {
      color: #000;
      font-family: Pretendard;
      font-size: ${(props) =>
        props.isSelected
          ? css`
          13px
        `
          : "11px"};
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      ${(props) =>
        isPremiumAndVIP(props.pubType) &&
        css`
          color: #fff;
        `}
    }
  }

  > .title {
    display: none;
    text-align: center;
    max-width: 82px;
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    white-space: nowrap;
  }

  &.marker-expanded {
    transform: translate(-50%, -12px);

    > .content {
      > span {
        color: var(--Black-300, #808080);
        font-size: 10px;
        font-weight: 600;
      }
    }

    > .title {
      display: block;
    }
  }
`;

const StoreMarker = memo(function StoreMarker({
  selected,
  pubType,
  buyInFrom,
  buyInTo,
  name,
  timer,
}: StoreMarkerProps) {
  const pubTypeIcon = useMemo(() => {
    switch (pubType) {
      case "PREMIUM":
        return "/image-web/store/map-premium.svg";
      case "VIP":
        return "/image-web/store/map-premium.svg";
      case "NORMAL":
        return "/image-web/store/store_normal.png";
      default:
        return "/image-web/store/store_normal.png";
    }
  }, [pubType]);

  return (
    <Wrapper
      className={"marker-collapsed"}
      pubType={pubType}
      isSelected={selected}
    >
      <div className="content">
        {isPremiumAndVIP(pubType) && timer && (
          <div className="time">
            {timer.currentLevel.type === "BREAK"
              ? "BREAK"
              : `${timer.currentLevel.level}LV 진행중`}
          </div>
        )}
        <img src={pubTypeIcon} />
        <span>{name}</span>
      </div>
    </Wrapper>
  );
});

export default StoreMarker;
