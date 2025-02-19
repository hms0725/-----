import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Area, areaCitiesWithCafeCount } from "../../../../api/area";
import { enqueueSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 106;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &.visible {
    opacity: 1;
  }
`;

const LocationFilterWrapper = styled.div<{
  scrollLock: boolean;
  visible: boolean;
}>`
  position: absolute;
  top: 100%;
  width: 100%;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  height: 50svh;
  margin-bottom: 70px;
  overscroll-behavior: none;
  z-index: 107;
  background: white;
  transition: all 0.3s ease-in-out;
  padding-top: 48px;
  border-radius: 12px 12px 0px 0px;
  padding-bottom: 69px;
  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `}

  ${(p) =>
    p.visible &&
    `
    transform: translateX(-50%) translateY(-100%);
  `}
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
    border-bottom: 1px solid var(--Black-100, #f0f0f0);
    border-radius: 12px 12px 0px 0px;

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
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      cursor: pointer;
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;
const DefaultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: calc(100%);
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
  max-width: 100%;
  padding-left: 106px;

  > .index-list {
    position: fixed;
    left: 0;
    top: 48px;
    width: 106px;
    flex-shrink: 0;
    height: calc(100% - 117px);
    background: var(--Black-100, #f0f0f0);
    overflow-y: scroll;

    > .inner {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;

      > .item {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > .item.selected {
        background: var(--Purple-100, #f0eaff);
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }

  > .content {
    flex-grow: 1;
    height: 100%;
    padding: 0;
    overflow-y: scroll;

    > .inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;

      > .item {
        height: 40px;
        width: 100%;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 4px 16px;

        > span {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }

        > img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;

interface LocationFilterProps {
  provinces: Area[];
  cities: Area[];
  onClose: () => void;
  onSelected: (province: Area, city: Area) => void;
}

const LocationFilter = ({
  provinces,
  onClose,
  onSelected,
}: LocationFilterProps) => {
  const [selectedProvince, setSelectedProvince] = useState<Area>();
  const [cities, setCities] = useState<Area[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // 서울 기본 선택
  useEffect(() => {
    if (provinces.length > 0) {
      setSelectedProvince(provinces[0]);
    }
  }, [provinces]);

  useEffect(() => {
    if (selectedProvince) {
      areaCitiesWithCafeCount({ id: selectedProvince.id })
        .then((list) => {
          setCities(list);
        })
        .catch((e: any) => {
          enqueueSnackbar(e.message, { variant: "error" });
        });
    }
  }, [selectedProvince]);

  const handleClickCity = useCallback(
    (city: Area) => {
      if (selectedProvince) {
        onSelected(selectedProvince, city);
      }
    },
    [selectedProvince, onSelected]
  );

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      <Overlay className={visible ? "visible" : ""} onClick={handleClose} />
      <LocationFilterWrapper scrollLock={false} visible={visible}>
        <div className="header">
          <div className="close" onClick={handleClose}>
            <img src="/image-web/Holdem%20Now/Icon/Close.svg" />
          </div>
          <div className="title">지역</div>
        </div>
        <DefaultWrapper>
          <div className="index-list">
            <div className="inner">
              {provinces.map((v) => {
                return (
                  <div
                    key={v.id}
                    className={
                      "item " +
                      (selectedProvince?.id === v.id ? "selected" : "")
                    }
                    onClick={() => setSelectedProvince(v)}
                  >
                    {v.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="content">
            <div className="inner">
              {cities
                .filter((x) => x.provinceId === selectedProvince?.id)
                .map((v) => {
                  return (
                    <div
                      className="item"
                      key={v.id}
                      onClick={() => handleClickCity(v)}
                    >
                      <span>
                        {v.name} ({v.cafeCount || 0})
                      </span>
                      <img
                        className="arrow"
                        src="/image-web/Icon/Arrow-right.svg"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </DefaultWrapper>
      </LocationFilterWrapper>
    </>
  );
};

export default LocationFilter;
