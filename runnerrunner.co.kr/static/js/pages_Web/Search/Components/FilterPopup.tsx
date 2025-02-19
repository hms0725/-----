import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { PubSearchParams } from "../../../../api/cafe";
import usePubSearchFilter from "../../../../hooks/usePubSearchFilter";

const SearchFilterWrapper = styled.div<{
  scrollLock: boolean;
  header: boolean;
}>`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  height: 100svh;
  overscroll-behavior: none;
  z-index: 1101;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 50px;

  ${(p) =>
    p.scrollLock
      ? `
    overflow-y: hidden;
  `
      : `
    overflow-y: scroll;
  `}

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 20px 16px 110px;
      gap: 40px;
    }

    > .content.search-result {
      padding: 20px 16px;
      flex-grow: 1;
    }
  }

  > .header {
    top: 0;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;
    background: white;
    > .clear {
      color: var(--Black-200, #b7b7b7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      cursor: pointer;
      color: var(--Black-400, #444);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }
`;
const DefaultInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  gap: 16px;

  > .title {
    width: 100%;
    text-align: left;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  > .sub-title {
    width: 100%;
    text-align: left;
    margin-top: 8px;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const RangeInfoWrapper = styled(DefaultInfoWrapper)`
  > .floating-button-wrapper {
    background: white;
    padding: 30px 8px 0px;
    width: 100%;

    > .button {
      cursor: pointer;
      width: 100%;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
      text-align: center;
      padding: 15px 0;
      background: var(--Purple-300, #6436e7);
    }
    > .button:active {
      background: #502bb5;
    }
  }
  > .box {
    padding: 8px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;

    > .price {
      width: 100%;
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;

      > .disabled {
        color: var(--Black-200, #b7b7b7);
      }
    }

    > .rc-slider-wrapper {
      width: calc(100% - 32px);
    }

    > .range-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > .text {
        color: var(--Black-200, #b7b7b7);
        text-align: right;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
`;

interface SearchFilterProps {
  currentFilter: PubSearchParams;
  onApplyFilter?: (params: PubSearchParams) => void;
  onClose: () => void;
}

const FilterPopup = ({
  currentFilter,
  onApplyFilter,
  onClose,
}: SearchFilterProps) => {
  const [buyInPrice, setBuyInPrice] = useState<{
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  }>({
    min: 1,
    max: 100,
    selectedMin: currentFilter.buyInFrom || 1,
    selectedMax: currentFilter.buyInTo || 100,
  });
  const [prizeValue, setPrizeValue] = useState<{
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  }>({
    min: 50,
    max: 100,
    selectedMin: currentFilter.prizeFrom || 50,
    selectedMax: currentFilter.prizeTo || 100,
  });

  const [blindValue, setBlindValue] = useState<{
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  }>({
    min: 1,
    max: 30,
    selectedMin: currentFilter.blindUpFrom || 1,
    selectedMax: currentFilter.blindUpTo || 30,
  });
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { filter, togglePubType, toggleGameType } =
    usePubSearchFilter(currentFilter);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("recentSearch") || "[]");
      setRecents(list);
    } catch (e) {
      localStorage.setItem("recentSearch", "[]");
    }
  }, []);

  const clearFilter = () => {
    togglePubType("");
    toggleGameType("");
    setBuyInPrice({
      ...buyInPrice,
      selectedMax: buyInPrice.max,
      selectedMin: buyInPrice.min,
    });
    setBlindValue({
      ...blindValue,
      selectedMax: blindValue.max,
      selectedMin: blindValue.min,
    });
    setPrizeValue({
      ...prizeValue,
      selectedMax: prizeValue.max,
      selectedMin: prizeValue.min,
    });
  };

  const handleConfirm = () => {
    const params: PubSearchParams = {};

    if (filter.pubTypes) {
      params.pubTypes = filter.pubTypes;
    }
    if (filter.gameTypes) {
      params.gameTypes = filter.gameTypes;
    }

    if (filter.sort) {
      params.sort = filter.sort;
    }

    if (
      buyInPrice.selectedMin !== buyInPrice.min ||
      buyInPrice.selectedMax !== buyInPrice.max
    ) {
      params.buyInFrom = buyInPrice.selectedMin;
      params.buyInTo = buyInPrice.selectedMax;
    }
    if (
      blindValue.selectedMin !== blindValue.min ||
      blindValue.selectedMax !== blindValue.max
    ) {
      params.blindUpFrom = blindValue.selectedMin;
      params.blindUpTo = blindValue.selectedMax;
    }
    if (
      prizeValue.selectedMin !== prizeValue.min ||
      prizeValue.selectedMax !== prizeValue.max
    ) {
      params.prizeFrom = prizeValue.selectedMin;
      params.prizeTo = prizeValue.selectedMax;
    }

    if (onApplyFilter) {
      onApplyFilter(params);
      onClose();
    }
  };

  return (
    <>
      <SearchFilterWrapper scrollLock={false} header={true}>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Holdem%20Now/Icon/Close.svg" />
          </div>
          <div className="title">상세 필터</div>
          <div className="clear" onClick={() => clearFilter()}>
            초기화
          </div>
        </div>
        <div className="inner">
          <div className={"content"}>
            <RangeInfoWrapper>
              <div className="title">바이인 금액</div>
              <div className="box">
                <div className="price">
                  {buyInPrice.min === buyInPrice.selectedMin &&
                  buyInPrice.max === buyInPrice.selectedMax ? (
                    <div className="disabled">상관없음</div>
                  ) : (
                    <>
                      {buyInPrice.selectedMin.toLocaleString()}만~
                      {buyInPrice.selectedMax.toLocaleString()}만
                    </>
                  )}
                </div>
                <div className="rc-slider-wrapper">
                  <div
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  />
                  <Slider
                    min={buyInPrice.min}
                    max={buyInPrice.max}
                    range={true}
                    allowCross={false}
                    defaultValue={[
                      buyInPrice.selectedMin,
                      buyInPrice.selectedMax,
                    ]}
                    value={[buyInPrice.selectedMin, buyInPrice.selectedMax]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setBuyInPrice({
                          ...buyInPrice,
                          selectedMin: value[0],
                          selectedMax: value[1],
                        });
                      }
                    }}
                    trackStyle={{
                      backgroundColor: "#6436E7",
                      height: 4,
                    }}
                    handleStyle={{
                      borderWidth: 1.5,
                      borderColor: "#6436E7",
                      height: 26,
                      width: 26,
                      marginLeft: 0,
                      marginTop: -12,
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
                      opacity: 1,
                    }}
                    activeDotStyle={{
                      boxShadow: "none",
                    }}
                  />
                </div>
                <div className="range-row">
                  <div className="text">
                    {buyInPrice.min.toLocaleString()}만
                  </div>
                  <div className="text">
                    {(buyInPrice.max / 2).toLocaleString()}만
                  </div>
                  <div className="text">
                    {buyInPrice.max.toLocaleString()}만
                  </div>
                </div>
              </div>
            </RangeInfoWrapper>
            <RangeInfoWrapper>
              <div className="title">블라인드 업 타임</div>
              <div className="box">
                <div className="price">
                  {blindValue.min === blindValue.selectedMin &&
                  blindValue.max === blindValue.selectedMax ? (
                    <div className="disabled">상관없음</div>
                  ) : (
                    <>
                      {blindValue.selectedMin.toLocaleString()}분~
                      {blindValue.selectedMax.toLocaleString()}분
                    </>
                  )}
                </div>
                <div className="rc-slider-wrapper">
                  <div
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  />
                  <Slider
                    min={blindValue.min}
                    max={blindValue.max}
                    range={true}
                    allowCross={false}
                    defaultValue={[
                      blindValue.selectedMin,
                      blindValue.selectedMax,
                    ]}
                    value={[blindValue.selectedMin, blindValue.selectedMax]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setBlindValue({
                          ...blindValue,
                          selectedMin: value[0],
                          selectedMax: value[1],
                        });
                      }
                    }}
                    trackStyle={{
                      backgroundColor: "#6436E7",
                      height: 4,
                    }}
                    handleStyle={{
                      borderWidth: 1.5,
                      borderColor: "#6436E7",
                      height: 26,
                      width: 26,
                      marginLeft: 0,
                      marginTop: -12,
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
                      opacity: 1,
                    }}
                    activeDotStyle={{
                      boxShadow: "none",
                    }}
                  />
                </div>
                <div className="range-row">
                  <div className="text">
                    {blindValue.min.toLocaleString()}분
                  </div>
                  <div className="text">
                    {(blindValue.max / 2).toLocaleString()}분
                  </div>
                  <div className="text">
                    {blindValue.max.toLocaleString()}분
                  </div>
                </div>
              </div>
            </RangeInfoWrapper>
            <RangeInfoWrapper>
              <div className="title">프라이즈</div>
              <div className="box">
                <div className="price">
                  {prizeValue.min === prizeValue.selectedMin &&
                  prizeValue.max === prizeValue.selectedMax ? (
                    <div className="disabled">상관없음</div>
                  ) : (
                    <>
                      {prizeValue.selectedMin.toLocaleString()}%~
                      {prizeValue.selectedMax.toLocaleString()}%
                    </>
                  )}
                </div>
                <div className="rc-slider-wrapper">
                  <div
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                    }}
                  />
                  <Slider
                    min={prizeValue.min}
                    max={prizeValue.max}
                    range={true}
                    allowCross={false}
                    defaultValue={[
                      prizeValue.selectedMin,
                      prizeValue.selectedMax,
                    ]}
                    value={[prizeValue.selectedMin, prizeValue.selectedMax]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setPrizeValue({
                          ...prizeValue,
                          selectedMin: value[0],
                          selectedMax: value[1],
                        });
                      }
                    }}
                    trackStyle={{
                      backgroundColor: "#6436E7",
                      height: 4,
                    }}
                    handleStyle={{
                      borderWidth: 1.5,
                      borderColor: "#6436E7",
                      height: 26,
                      width: 26,
                      marginLeft: 0,
                      marginTop: -12,
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
                      opacity: 1,
                    }}
                    activeDotStyle={{
                      boxShadow: "none",
                    }}
                  />
                </div>
                <div className="range-row">
                  <div className="text">{prizeValue.min.toLocaleString()}%</div>
                  <div className="text">
                    {prizeValue.min + (prizeValue.max - prizeValue.min) / 2}%
                  </div>
                  <div className="text">{prizeValue.max.toLocaleString()}%</div>
                </div>
              </div>
              <div className="floating-button-wrapper">
                <div className="button" onClick={handleConfirm}>
                  검색
                </div>
              </div>
            </RangeInfoWrapper>
          </div>
        </div>
      </SearchFilterWrapper>
    </>
  );
};

export default FilterPopup;
