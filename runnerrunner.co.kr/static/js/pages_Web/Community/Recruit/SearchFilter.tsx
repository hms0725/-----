import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { JobSearchParams, RecruitState } from "../../../../api/job";
import { Area } from "../../../../api/area";
import { shortProvinceName } from "../../../../utils/common";

const SearchFilterWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 12;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

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
      padding: 20px 16px 220px;
      gap: 40px;
    }
  }

  > .floating-button-wrapper {
    background: white;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 30px 24px 48px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

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
      color: var(--Black-200, #b7b7b7);
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
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
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
const LocationInfoWrapper = styled(DefaultInfoWrapper)`
  > .box {
    padding: 8px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;

    > .item-row {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;

      > .item {
        cursor: pointer;
        padding: 9px 16px;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        border-radius: 8px;
        border: 1px solid var(--Black-300, #808080);
        background: white;
        text-align: center;
      }

      > .item.selected {
        padding: 8.5px 15.5px;
        background: var(--Purple-100, #f0eaff);
        color: var(--Purple-300, #6436e7);
        border: 1.5px solid var(--Purple-300, #6436e7);
      }
    }
  }
`;
const RecruitStatusInfoWrapper = styled(DefaultInfoWrapper)`
  > .box {
    padding: 8px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;

    > .item-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      > .item {
        cursor: pointer;
        padding: 9px 16px;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        border-radius: 8px;
        border: 1px solid var(--Black-300, #808080);
        background: white;
      }

      > .item.selected {
        padding: 8.5px 15.5px;
        background: var(--Purple-100, #f0eaff);
        color: var(--Purple-300, #6436e7);
        border: 1.5px solid var(--Purple-300, #6436e7);
      }
    }
  }
`;
const RangeInfoWrapper = styled(DefaultInfoWrapper)`
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
  }
`;

interface SearchFilterProps {
  provinces: Area[];
  filter: JobSearchParams;
  onApplyFilter: (params: JobSearchParams) => void;
  onClose: () => void;
}

const SearchFilter = ({
  provinces,
  filter,
  onApplyFilter,
  onClose,
}: SearchFilterProps) => {
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RecruitState[]>([]);
  const [priceValue, setPriceValue] = useState<{
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  }>({
    min: 9680,
    max: 100000,
    selectedMin: 9680,
    selectedMax: 100000,
  });
  const [locationValue, setLocationValue] = useState<{
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  }>({
    min: 0,
    max: 100,
    selectedMin: 0,
    selectedMax: 100,
  });

  useEffect(() => {
    if (filter.provinces && filter.provinces.length > 0) {
      setSelectedProvinceIds(filter.provinces);
    }

    if (filter.stateType && filter.stateType.length > 0) {
      setSelectedStatus(filter.stateType);
    }

    setPriceValue((v) => {
      const newVal = { ...v };
      newVal.selectedMin = filter.minHourlyPay || v.min;
      newVal.selectedMax = filter.maxHourlyPay || v.max;
      return newVal;
    });

    setLocationValue((v) => {
      const newVal = { ...v };
      newVal.selectedMin = filter.fromDistance || v.min;
      newVal.selectedMax = filter.toDistance || v.max;
      return newVal;
    });
  }, [filter]);

  const handleApplyFilter = () => {
    const params: JobSearchParams = {};

    if (selectedProvinceIds.length > 0) {
      params.provinces = selectedProvinceIds;
    }

    if (selectedStatus.length > 0) {
      params.stateType = selectedStatus;
    }

    if (
      priceValue.min !== priceValue.selectedMin ||
      priceValue.max !== priceValue.selectedMax
    ) {
      params.minHourlyPay = priceValue.selectedMin;
      params.maxHourlyPay = priceValue.selectedMax;
    }

    if (
      locationValue.min !== locationValue.selectedMin ||
      locationValue.max !== locationValue.selectedMax
    ) {
      params.fromDistance = locationValue.selectedMin;
      params.toDistance = locationValue.selectedMax;
    }

    onApplyFilter(params);
    onClose();
  };

  const toggleProvince = (id: number) => {
    const idx = selectedProvinceIds.findIndex((v) => v === id);
    if (idx === -1) {
      setSelectedProvinceIds([...selectedProvinceIds, id]);
    } else {
      const newVal = [...selectedProvinceIds];
      newVal.splice(idx, 1);
      setSelectedProvinceIds(newVal);
    }
  };

  const toggleStatus = (status: RecruitState) => {
    const idx = selectedStatus.indexOf(status);
    if (idx === -1) {
      setSelectedStatus([...selectedStatus, status]);
    } else {
      const newVal = [...selectedStatus];
      newVal.splice(idx, 1);
      setSelectedStatus(newVal);
    }
  };

  const handleReset = useCallback(() => {
    setSelectedProvinceIds([]);
    setSelectedStatus([]);
    setPriceValue((v) => ({ ...v, selectedMin: v.min, selectedMax: v.max }));
    setLocationValue((v) => ({ ...v, selectedMin: v.min, selectedMax: v.max }));
  }, []);

  return (
    <>
      <SearchFilterWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">상세 필터</div>
          <div className="button" onClick={handleReset}>
            초기화
          </div>
        </div>
        <div className="inner">
          <div className="content">
            <LocationInfoWrapper>
              <div className="title">지역</div>
              <div className="box">
                <div className="item-row">
                  <div
                    className={`item ${
                      selectedProvinceIds.length === 0 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedProvinceIds([])}
                  >
                    전체
                  </div>
                  {provinces.map((v, i) => {
                    const name = shortProvinceName(v.name);
                    const isSelected =
                      selectedProvinceIds.findIndex((id) => id === v.id) !== -1;
                    return (
                      <div
                        key={i}
                        className={"item " + (isSelected ? "selected" : "")}
                        onClick={() => toggleProvince(v.id)}
                      >
                        {name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </LocationInfoWrapper>
            <RecruitStatusInfoWrapper>
              <div className="title">채용상태</div>
              <div className="box">
                <div className="item-row">
                  <div
                    className={`item ${
                      selectedStatus.length === 0 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedStatus([])}
                  >
                    전체
                  </div>
                  {(["EMPLOYING", "DONE"] as RecruitState[]).map((v) => {
                    return (
                      <div
                        key={v}
                        className={
                          "item " +
                          (selectedStatus.includes(v) ? "selected" : "")
                        }
                        onClick={() => toggleStatus(v)}
                      >
                        {v === "EMPLOYING" ? "채용중" : "채용완료"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </RecruitStatusInfoWrapper>
            <RangeInfoWrapper>
              <div className="title">시급</div>
              <div className="box">
                <div className="price">
                  {priceValue.min === priceValue.selectedMin &&
                  priceValue.max === priceValue.selectedMax ? (
                    <div className="disabled">상관없음</div>
                  ) : (
                    <>
                      {priceValue.selectedMin.toLocaleString()}원~
                      {priceValue.selectedMax.toLocaleString()}원
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
                    min={priceValue.min}
                    max={priceValue.max}
                    range={true}
                    allowCross={false}
                    defaultValue={[
                      priceValue.selectedMin,
                      priceValue.selectedMax,
                    ]}
                    value={[priceValue.selectedMin, priceValue.selectedMax]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        const adjustedMin =
                          value[0] >= 10000
                            ? Math.ceil(value[0] / 1000) * 1000
                            : value[0];

                        const adjustedMax =
                          value[1] >= 10000
                            ? Math.ceil(value[1] / 1000) * 1000
                            : value[1];

                        setPriceValue({
                          ...priceValue,
                          selectedMin: adjustedMin,
                          selectedMax: adjustedMax,
                        });
                      }
                    }}
                    step={
                      priceValue.selectedMin >= 10000 ||
                      priceValue.selectedMax >= 10000
                        ? 1000
                        : 100
                    }
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
              </div>
            </RangeInfoWrapper>
            <RangeInfoWrapper>
              <div className="title">거리</div>
              <div className="box">
                <div className="price">
                  {locationValue.min === locationValue.selectedMin &&
                  locationValue.max === locationValue.selectedMax ? (
                    <div className="disabled">상관없음</div>
                  ) : (
                    <>
                      {locationValue.selectedMin.toLocaleString()}km~
                      {locationValue.selectedMax.toLocaleString()}km
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
                    min={locationValue.min}
                    max={locationValue.max}
                    range={true}
                    allowCross={false}
                    defaultValue={[
                      locationValue.selectedMin,
                      locationValue.selectedMax,
                    ]}
                    value={[
                      locationValue.selectedMin,
                      locationValue.selectedMax,
                    ]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setLocationValue({
                          ...locationValue,
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
              </div>
            </RangeInfoWrapper>
          </div>
        </div>
        <div className="floating-button-wrapper">
          <div className="button" onClick={handleApplyFilter}>
            적용하기
          </div>
        </div>
      </SearchFilterWrapper>
    </>
  );
};

export default SearchFilter;
