import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMajorTournamentList,
  getMinorTournamentList,
  TournamentScheduleItemInterface,
} from "../../../api/tournament";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import moment from "moment";
import { PubSortTypeLabels } from "../../../utils/constants";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { scheduleState } from "../../../recoil/schedule";

const TournamentScheduleWrapper = styled.div<{ scrollLock: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 102px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
     overflow-y: scroll;
  `}
  @media ${MEDIA_DESKTOP} {
    position: static;
    inset: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 1060px;
    max-height: unset;
    padding: 40px 0;
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
    justify-content: flex-start;
    padding: 0 20px;
    z-index: 11;
    background: white;
    gap: 8px;
    @media ${MEDIA_DESKTOP} {
      width: 100%;
      transform: unset;
      max-width: unset;
      position: static;
      bottom: unset;
      right: unset;
      left: unset;
      top: unset;
      transform: unset;
      height: unset;
      padding: 0;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .title {
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      padding: 0 16px 56px;
      @media ${MEDIA_DESKTOP} {
        padding: 0 10px 10px 0;
      }
    }
  }
`;
const FilterWrapper = styled.div<{ isMobile: boolean }>`
  position: fixed;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  gap: 12px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  z-index: 11;
  @media ${MEDIA_DESKTOP} {
    position: static;
    max-width: unset;
    inset: unset;
    transform: unset;
    box-shadow: unset;
    margin-top: 16px;
    padding: 0;
    margin-bottom: 20px;
  }

  ${(p) =>
    p.isMobile
      ? `
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  `
      : `
    display: none;
    @media ${MEDIA_DESKTOP} {
      display: flex;
    }
  `}
  > .type-row {
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      padding: 0;
    }

    > .type-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;

      > .type {
        width: fit-content;
        color: ${(p) => p.theme.color.purple300};
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding: 7px 12px;
        border-radius: 15px;
        border: 1px solid ${(p) => p.theme.color.purple300};
        background: white;
      }

      > .type.selected {
        color: #fff;
        background: ${(p) => p.theme.color.purple300};
      }
    }

    > .sort-wrapper {
      position: relative;
      padding: 7px 8px 7px 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border-radius: 15px;
      border: 1px solid ${(p) => p.theme.color.black200};
      color: ${(p) => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      > .sort-popup {
        width: max-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 36px;
        z-index: 105;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);

        > .item {
          width: 100%;
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          border: 1px solid var(--Black-100, #f0f0f0);
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }

        > .item.selected {
          color: #fff;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          background: var(--Purple-300, #6436e7);
        }
      }
    }
  }

  > .filter-row {
    overflow: hidden;
    padding-left: 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    > .item {
      white-space: nowrap;
      padding: 7px 12px;
      color: ${(p) => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      border-radius: 15px;
      background: ${(p) => p.theme.color.black100};
    }
  }
`;
const MenuWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px 0 0;
  margin-bottom: 20px;
  @media ${MEDIA_DESKTOP} {
    justify-content: flex-start;
    position: relative;
    margin-bottom: 0;
    > .line {
      z-index: -1;
      bottom: 0;
      position: absolute;
      width: 100%;
      height: 2px;
      background: #f0f0f0;
    }
  }

  > .menu {
    cursor: pointer;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      padding: 0 0 16px;
    }
  }

  > .menu.selected {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    border-bottom: 2px solid var(--Black-400, #444);
  }
`;
const ScheduleItem = styled.div`
  width: 100%;

  > .mobile-wrapper {
    width: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    padding: 16px;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }

    > .time {
      padding: 8px 0;
      text-align: center;
      width: 100%;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      border-radius: 8px;
      background: var(--Purple-100, #f0eaff);
    }

    > .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 16px;

      > .horizontal-bar {
        width: 100%;
        height: 1px;
        background: var(--Black-200, #b7b7b7);
      }

      > .tournament-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 12px;

        > .row {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          > .title {
            color: var(--Black-400, #444);
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.28px;
          }

          > .value {
            color: var(--Black-400, #444);
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.28px;
          }
        }
      }

      > .extra-info {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;

        > .item {
          padding: 12px 16px;
          border-radius: 8px;
          background: var(--Black-100, #f0f0f0);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;

          > .title {
            color: var(--Black-500, #202020);
            text-align: center;
            font-family: Pretendard;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; /* 18.2px */
            letter-spacing: -0.26px;
          }

          > .value {
            color: var(--Black-400, #444);
            text-align: center;
            font-family: Pretendard;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 140%; /* 22.4px */
            letter-spacing: -0.32px;
          }
        }
      }

      > .store-info {
        cursor: pointer;
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        gap: 12px;

        > .arrow {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
        }

        > .thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: gray;
          flex-shrink: 0;
        }

        > .info-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 6px;
          width: calc(100% - 72px);

          > .badge {
            padding: 4px 6px;
            color: var(--Purple-300, #6436e7);
            font-family: Pretendard;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            border-radius: 16.667px;
            border: 1px solid var(--Purple-100, #f0eaff);
          }

          > .title {
            margin-top: 2px;
            color: var(--Black-400, #444);
            font-family: Pretendard;
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.32px;
            width: calc(100% - 30px);
            max-width: calc(100% - 30px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          > .store-name {
            color: var(--Black-300, #808080);
            font-family: Pretendard;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.26px;
          }

          > .date {
            color: var(--Black-300, #808080);
            font-family: Pretendard;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.26px;
          }
        }
      }
    }
  }

  > .pc-wrapper {
    cursor: pointer;
    display: none;
    @media ${MEDIA_DESKTOP} {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
      overflow: hidden;
      height: 200px;
    }

    > .thumbnail {
      width: 200px;
      height: 200px;
    }

    > .info-wrapper {
      padding: 16px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
      height: 100%;

      > .info-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 12px;

        > .top-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;

          > .badge {
            color: var(--Purple-300, #6436e7);
            text-align: justify;
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            padding: 4px 6px;
            border-radius: 16.667px;
            border: 1px solid var(--Purple-100, #f0eaff);
          }
        }

        > .wrapepr {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 6px;

          > .title {
            width: 249px;
            color: var(--Black-400, #444);
            // text-align: justify;
            font-family: Pretendard;
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.4px;
          }

          > .desc {
            color: var(--Black-300, #808080);
            text-align: justify;
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.28px;
          }
        }
      }

      > .price-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 12px 16px;
        border-radius: 12px;
        background: var(--Black-100, #f0f0f0);
        gap: 8px;
        > .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 4px;
          > .title {
            color: var(--Black-500, #202020);
            text-align: justify;
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; /* 19.6px */
            letter-spacing: -0.28px;
          }
          > .value {
            color: var(--Black-400, #444);
            text-align: justify;
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            letter-spacing: -0.28px;
          }
        }
      }

      > .game-info-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 12px;
        > .time {
          width: 264px;
          padding: 8px 0;
          text-align: center;
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
          border-radius: 8px;
          background: var(--Purple-100, #f0eaff);
        }
        > .tournament-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 8px;
          > .row {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            > .title {
              flex-shrink: 0;
              color: var(--Black-500, #202020);
              text-align: justify;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 140%; /* 19.6px */
              letter-spacing: -0.28px;
            }
            > .value {
              flex-shrink: 0;
              color: var(--Black-400, #444);
              text-align: justify;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
              line-height: normal;
              letter-spacing: -0.28px;
            }
          }
        }
      }

      > .line {
        width: 1px;
        height: 100%;
        background: #b7b7b7;
      }
    }
  }
`;

interface TournamentScheduleProps {
  onClose?: () => void;
}

const TournamentSchedulePage = ({ onClose }: TournamentScheduleProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const history = useHistory();
  const [selectedMenu, setSelectedMenu] = useState("major");
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showSelectedYear, setShowSelectedYear] = useState(false);
  const [showSelectedMonth, setShowSelectedMonth] = useState(false);
  const [listData, setListData] = useState<TournamentScheduleItemInterface[]>(
    []
  );
  const [schedule, setSchedule] = useRecoilState(scheduleState);
  useEffect(() => {
    const today = moment();
    setSelectedYear(today.year());
    if (schedule !== 0) {
      setSelectedMonth(schedule);
    } else {
      setSelectedMonth(today.month() + 1);
    }
  }, []);
  useEffect(() => {
    if (selectedMonth !== 0) {
      if (selectedMenu === "major") {
        setLoading(true);
        getMajorTournamentList({
          year: selectedYear,
          month: selectedMonth,
        })
          .then((res) => {
            setListData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (selectedMenu === "minor") {
        setLoading(true);
        getMinorTournamentList({
          year: selectedYear,
          month: selectedMonth,
        })
          .then((res) => {
            setListData(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [selectedMenu, selectedYear, selectedMonth]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (history.length > 1) {
        history.goBack();
      } else {
        history.push("/");
      }
    }
  };
  return (
    <>
      <TournamentScheduleWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={handleClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">토너먼트 스케줄</div>
        </div>
        <FilterWrapper isMobile={true}>
          <div className="type-row">
            <div
              className="sort-wrapper"
              onClick={() => setShowSelectedYear(!showSelectedYear)}
            >
              <span>{selectedYear}년</span>
              <img src="/image-web/Icon/Arrow%20down.svg" />
              {showSelectedYear && (
                <div className="sort-popup">
                  {Array.from({ length: 5 }).map((v, i) => {
                    return (
                      <div
                        className={
                          "item " +
                          (selectedYear === moment().year() + (i - 2)
                            ? "selected"
                            : "")
                        }
                        key={i}
                        onClick={() =>
                          setSelectedYear(moment().year() + (i - 2))
                        }
                      >
                        {moment().year() + (i - 2)}년
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className="sort-wrapper"
              onClick={() => setShowSelectedMonth(!showSelectedMonth)}
            >
              <span>{selectedMonth}월</span>
              <img src="/image-web/Icon/Arrow%20down.svg" />
              {showSelectedMonth && (
                <div className="sort-popup">
                  {Array.from({ length: 12 }).map((v, i) => {
                    return (
                      <div
                        className={
                          "item " + (selectedMonth === i + 1 ? "selected" : "")
                        }
                        key={i}
                        onClick={() => {
                          setSelectedMonth(i + 1);
                          setSchedule(i + 1);
                        }}
                      >
                        {i + 1}월
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </FilterWrapper>
        <div className="inner">
          <MenuWrapper>
            <div
              className={"menu " + (selectedMenu === "major" ? "selected" : "")}
              onClick={() => setSelectedMenu("major")}
            >
              메이저 토너먼트 정보
            </div>
            <div
              className={"menu " + (selectedMenu === "minor" ? "selected" : "")}
              onClick={() => setSelectedMenu("minor")}
            >
              마이너 토너먼트 정보
            </div>
            <div className="line" />
          </MenuWrapper>
          <FilterWrapper isMobile={false}>
            <div className="type-row">
              <div
                className="sort-wrapper"
                onClick={() => setShowSelectedYear(!showSelectedYear)}
              >
                <span>{selectedYear}년</span>
                <img src="/image-web/Icon/Arrow%20down.svg" />
                {showSelectedYear && (
                  <div className="sort-popup">
                    {Array.from({ length: 5 }).map((v, i) => {
                      return (
                        <div
                          className={
                            "item " +
                            (selectedYear === moment().year() + (i - 2)
                              ? "selected"
                              : "")
                          }
                          key={i}
                          onClick={() =>
                            setSelectedYear(moment().year() + (i - 2))
                          }
                        >
                          {moment().year() + (i - 2)}년
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                className="sort-wrapper"
                onClick={() => setShowSelectedMonth(!showSelectedMonth)}
              >
                <span>{selectedMonth}월</span>
                <img src="/image-web/Icon/Arrow%20down.svg" />
                {showSelectedMonth && (
                  <div className="sort-popup">
                    {Array.from({ length: 12 }).map((v, i) => {
                      return (
                        <div
                          className={
                            "item " +
                            (selectedMonth === i + 1 ? "selected" : "")
                          }
                          key={i}
                          onClick={() => {
                            setSelectedMonth(i + 1);
                            setSchedule(i + 1);
                          }}
                        >
                          {i + 1}월
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </FilterWrapper>
          <div className="list">
            {listData.map((item, i) => {
              let gameStatus = "";
              if (moment(item.startAt).isAfter(moment())) {
                gameStatus = "예정";
              } else if (moment(item.endAt).isBefore(moment())) {
                gameStatus = "종료";
              } else {
                gameStatus = "진행중";
              }
              return (
                <ScheduleItem
                  key={i}
                  onClick={() => {
                    history.push(
                      `/tournament/detail/${selectedMenu}/${item.id}`
                    );
                  }}
                >
                  <div className="mobile-wrapper">
                    <div className="time">
                      {moment(item.endAt).isBefore(moment())
                        ? "마감"
                        : `마감까지 남은 시간: ${moment(item.endAt).diff(
                            moment(),
                            "days"
                          )}일 ${
                            moment(item.endAt).diff(moment(), "hours") % 24
                          }시간 ${
                            moment(item.endAt).diff(moment(), "minutes") % 60
                          }분`}
                    </div>
                    <div className="info">
                      <div className="store-info">
                        <img src={item.image} className="thumbnail" />
                        <div className="info-wrapper">
                          <div className="badge">{gameStatus}</div>
                          <div className="title">{item.title}</div>
                          <div className="store-name">{item.place}</div>
                          <div className="date">
                            {moment(item.startAt).format("YY/MM/DD HH:mm")} ~{" "}
                            {moment(item.endAt).format("YY/MM/DD HH:mm")}
                          </div>
                        </div>
                        <img
                          className="arrow"
                          src="/image-web/Icon/Arrow-right.svg"
                        />
                      </div>
                      {/* <div className="horizontal-bar" />
                      <div className="tournament-info">
                        <div className="row">
                          <div className="title">바이인</div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="141"
                            height="1"
                            viewBox="0 0 141 1"
                            fill="none"
                          >
                            <path
                              d="M0.5 0.5H140.5"
                              stroke="#B7B7B7"
                              stroke-linecap="round"
                              stroke-dasharray="0.1 4"
                            />
                          </svg>
                          <div className="value">
                            {(item.entry ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="row">
                          <div className="title">블라인드 레벨업 시간</div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="141"
                            height="1"
                            viewBox="0 0 141 1"
                            fill="none"
                          >
                            <path
                              d="M0.5 0.5H140.5"
                              stroke="#B7B7B7"
                              stroke-linecap="round"
                              stroke-dasharray="0.1 4"
                            />
                          </svg>
                          <div className="value">
                            {item.blindLevelUpTime ?? 0}분
                          </div>
                        </div>
                        <div className="row">
                          <div className="title">등록 마감</div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="141"
                            height="1"
                            viewBox="0 0 141 1"
                            fill="none"
                          >
                            <path
                              d="M0.5 0.5H140.5"
                              stroke="#B7B7B7"
                              stroke-linecap="round"
                              stroke-dasharray="0.1 4"
                            />
                          </svg>
                          <div className="value">
                            Lv {item.registerLimit ?? 0}
                          </div>
                        </div>
                        <div className="row">
                          <div className="title">현재 블라인드 레벨</div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="141"
                            height="1"
                            viewBox="0 0 141 1"
                            fill="none"
                          >
                            <path
                              d="M0.5 0.5H140.5"
                              stroke="#B7B7B7"
                              stroke-linecap="round"
                              stroke-dasharray="0.1 4"
                            />
                          </svg>
                          <div className="value">
                            Lv {item.currentBlindLevel ?? 0}
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="extra-info">
                        <div className="item">
                          <div className="title">스타팅/리바이인 (칩)</div>
                          <div className="value">
                            {(item.starting ?? 0).toLocaleString()}/
                            {(item.reEntry ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">플레이어/바이인</div>
                          <div className="value">
                            {item.player ?? 0}/{item.entry ?? 0}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">총 스택</div>
                          <div className="value">
                            {(item.totalStack ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">평균 스택</div>
                          <div className="value">
                            {(item.averageStack ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="pc-wrapper">
                    <img src={item.image} className="thumbnail" />
                    <div className="info-wrapper">
                      <div className="info-box">
                        <div className="top-row">
                          <div className="badge">{gameStatus}</div>
                        </div>
                        <div className="wrapepr">
                          <div className="title">{item.title}</div>
                          <div className="desc">{item.place}</div>
                          <div className="desc">
                            {moment(item.startAt).format(
                              "YYYY년 MM월 DD일 HH:mm"
                            )}{" "}
                            ~ {moment(item.endAt).format("M월 DD일 HH:mm")}
                          </div>
                        </div>
                      </div>
                      {/* <div className="price-box">
                        <div className="item">
                          <div className="title">스타팅/리바이인 (칩)</div>
                          <div className="value">
                            {(item.starting ?? 0).toLocaleString()}/
                            {(item.reEntry ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">플레이어/바이인</div>
                          <div className="value">
                            {(item.player ?? 0).toLocaleString()}/
                            {(item.entry ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">총 스택</div>
                          <div className="value">
                            {(item.totalStack ?? 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="item">
                          <div className="title">평균 스택</div>
                          <div className="value">
                            {(item.averageStack ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div> */}
                      <div className="line" />
                      <div className="game-info-box">
                        <div className="time">
                          {moment(item.endAt).isBefore(moment())
                            ? "마감"
                            : `마감까지 남은 시간: ${moment(item.endAt).diff(
                                moment(),
                                "days"
                              )}일 ${
                                moment(item.endAt).diff(moment(), "hours") % 24
                              }시간 ${
                                moment(item.endAt).diff(moment(), "minutes") %
                                60
                              }분`}
                        </div>
                        {/* <div className="tournament-info">
                          <div className="row">
                            <div className="title">바이인</div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="141"
                              height="1"
                              viewBox="0 0 141 1"
                              fill="none"
                            >
                              <path
                                d="M0.5 0.5H140.5"
                                stroke="#B7B7B7"
                                stroke-linecap="round"
                                stroke-dasharray="0.1 4"
                              />
                            </svg>
                            <div className="value">
                              {(item.entry ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="row">
                            <div className="title">블라인드 레벨업 시간</div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="141"
                              height="1"
                              viewBox="0 0 141 1"
                              fill="none"
                            >
                              <path
                                d="M0.5 0.5H140.5"
                                stroke="#B7B7B7"
                                stroke-linecap="round"
                                stroke-dasharray="0.1 4"
                              />
                            </svg>
                            <div className="value">
                              {item.blindLevelUpTime ?? 0}분
                            </div>
                          </div>
                          <div className="row">
                            <div className="title">등록 마감</div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="141"
                              height="1"
                              viewBox="0 0 141 1"
                              fill="none"
                            >
                              <path
                                d="M0.5 0.5H140.5"
                                stroke="#B7B7B7"
                                stroke-linecap="round"
                                stroke-dasharray="0.1 4"
                              />
                            </svg>
                            <div className="value">
                              Lv {item.registerLimit ?? 0}
                            </div>
                          </div>
                          <div className="row">
                            <div className="title">현재 블라인드 레벨</div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="141"
                              height="1"
                              viewBox="0 0 141 1"
                              fill="none"
                            >
                              <path
                                d="M0.5 0.5H140.5"
                                stroke="#B7B7B7"
                                stroke-linecap="round"
                                stroke-dasharray="0.1 4"
                              />
                            </svg>
                            <div className="value">
                              Lv {item.currentBlindLevel ?? 0}
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </ScheduleItem>
              );
            })}
          </div>
        </div>
      </TournamentScheduleWrapper>
    </>
  );
};

export default TournamentSchedulePage;
