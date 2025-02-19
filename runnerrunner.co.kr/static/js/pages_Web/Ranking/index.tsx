import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import RankingPointSheet from "../../../components/web/RankingPointSheet";
import {runnerRankingList, totalRunnerRankingList, UserRank} from "../../../api/tournament";
import {enqueueSnackbar} from "notistack";
import moment, {Moment} from "moment";
import {useSetRecoilState} from "recoil";
import {loadingState} from "../../../recoil/app";
import useScreenOrientation, { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import useQueryParams from "../../../hooks/useQueryParams";

const RankingWrapper = styled.div<{
  scrollLock: boolean
}>`
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
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${MEDIA_DESKTOP} {
    position: static;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 1060px;
    max-height: unset;
    padding: 40px 0;
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

    }
  }

  ${p => p.scrollLock ? `
      overflow-y: hidden;
  ` : `
     overflow-y: scroll;
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
    justify-content: flex-start;
    padding: 0 20px;
    z-index: 11;
    background: white;
    gap: 8px;
    @media ${MEDIA_DESKTOP}{
      display: none;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      color: ${p => p.theme.color.black400};
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
      color: var(--Black-200, #B7B7B7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }


`

const RankBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  > .title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      color: var(--Black-400, #444);
      flex-direction: row;
      justify-content: flex-start;
      gap: 16px;
      font-family: Pretendard;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .sub {
      display: none;
      @media ${MEDIA_DESKTOP} {
        display: flex;
        cursor: pointer;
      }
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;

      > img {
        width: 16px;
        height: 16px;
      }

      > span {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }

  > .menu-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    @media ${MEDIA_DESKTOP} {
      justify-content: flex-start;
      gap: 24px;
      margin-top: 30px;
      padding: 0 0 16px;
      border-bottom: 2px solid var(--Gray-100, #F0F0F0);
      margin-bottom: 40px;
    }

    > .menu {
      position: relative;
      cursor: pointer;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-200, #B7B7B7);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    > .menu.selected {
      color: var(--Black-400, #444);
      transform: none;
      writing-mode: horizontal-tb;
      text-orientation: mixed;
      display: flex; /* Safari 호환성 문제 해결을 위해 추가 */
      align-items: center; /* Safari 호환성 문제 해결을 위해 추가 */

      > .line {
        position: absolute;
        width: 100%;
        bottom: -18px;
        height: 2px;
        background: #444;
      }
    }
  }
`
const PCRankBar = styled.div`
  display: none;
  flex-direction: row;
  border-radius: 8px;
  border: 1px solid var(--Black-200, #B7B7B7);
  width: 100%;
  padding: 8px 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  @media ${MEDIA_DESKTOP} {
    display: flex;
  }
  >.arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 28px;
    height: 28px;
  }
  >.arrow.left {
    transform: rotate(180deg);
  }
  >.info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    >.title {
      color: var(--Purple-300, #6436E7);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    >.date {
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`
const MainRank = styled.div`
  width: 100%;
  height: 420px;
  position: relative;
  @media ${MEDIA_DESKTOP} {
    height: 320px;
  }

  > .background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 0;
    object-fit: cover;
    @media ${MEDIA_DESKTOP} {
      border-radius: 20px;
      height: 320px;
      bottom: 0;
    }
  }

  > .rank-bar {
    position: absolute;
    width: 300px;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    z-index: 1;
    border-radius: 8px;
    background: var(--Purple-100, #F0EAFF);
    color: var(--Purple-300, #6436E7);
    text-align: center;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }

  > .rank-bar.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
    > .arrow {
      cursor: pointer;
      border-radius: 4px;
      background: #FFF;
      padding: 4px;

      > svg {
        width: 20px;
        height: 20px;
      }
    }

    > .arrow.left {
      transform: rotate(180deg);
    }

    > .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;

      > .title {
        padding: 4px;
        color: #FFF;
        text-align: center;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        border-radius: 4px;
        background: var(--Purple-300, #6436E7);
      }

      > .date {
        color: var(--Purple-300, #6436E7);
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }

  > .prize-row {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 18px;
  @media ${MEDIA_DESKTOP} {
    gap: 120px;
  }
    > .prize {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      > .title {
        color: #FFF;
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        @media ${MEDIA_DESKTOP} {
          color: #FFF;
          text-align: center;
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      > .point {
        margin-top: 4px;
        color: var(--Purple-100, #F0EAFF);
        text-align: center;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        @media ${MEDIA_DESKTOP} {
          position: absolute;
          margin-top: 0px;
          color: var(--Purple-100, #F0EAFF);
          text-align: center;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          bottom: 20px;
        }
      }

      > .circle {
        margin-top: 12px;
        width: 80px;
        height: 80px;
        background: gray;
        border: 2px solid white;
        border-radius: 50%;
        @media ${MEDIA_DESKTOP} {
          width: 88px;
          height: 88px;
        }
      }

      > .line {
        margin-top: 8px;
        width: 80px;
        object-fit: contain;
        @media ${MEDIA_DESKTOP} {
          width: 180px;
        }
      }
    }
  }
`
const Arrow = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <path d="M7.5 15.5L12.5 10.5L7.5 5.5" stroke="#8359F7" stroke-width="1.25" stroke-linecap="round"
          stroke-linejoin="round"/>
  </svg>
}
const ListWrapper = styled.div`
  width: 100%;
  padding: 20px 16px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > .empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;

    > img {
      margin-top: 80px;
      width: 180px;
      object-fit: contain;
    }

    > .empty-text {
      width: 100%;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .header {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .item {
      color: var(--Black-200, #B7B7B7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-200, #B7B7B7);
        text-align: center;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
    >.item.no {
        @media ${MEDIA_DESKTOP} {
          color: var(--Black-200, #B7B7B7);
          text-align: center;
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          height: unset;
          background: unset;
          border-radius: unset;
        }
    }
  }

  .item.no {
    text-align: center;
    width: 40px;
    flex-shrink: 0;
    @media ${MEDIA_DESKTOP} {
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--Black-300, #808080);
      text-align: center;
      leading-trim: both;
      text-edge: cap;
      font-family: "yg-jalnan";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      border-radius: 20px;
      background: var(--Black-100, #F0F0F0);
    }
  }

  .item.nickname {
    text-align: center;
    width: 120px;
    flex-shrink: 0;
  }

  .item.point {
    text-align: center;
    width: 72px;
    flex-shrink: 0;
  }

  > .inner {
    flex-grow: 1;
    margin-top: 10px;
    width: 100%;
    max-height: calc(100% - 1px);
    overflow-y: scroll;

    > .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 7px;

      > .no-data {
        font-size: 12px;
        width: 100%;
        text-align: center;
        padding: 20px;
        color: #b7b7b7;
      }
    }
  }

  > .pagination-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 25px;
    padding-bottom: 10px;
    @media ${MEDIA_DESKTOP} {
      border-top: 1px solid #b7b7b7;
      width: ;
    }
    > .button {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid var(--Purple-100, #F0EAFF);
      background: #FFF;
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-400, #444);
        border: none;
      }

      > svg {
        width: 20px;
        height: 20px;
      }
    }

    > .button.selected {
      border: 1px solid var(--Purple-300, #6436E7);
      color: var(--Purple-300, #6436E7);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 142.857% */
      @media ${MEDIA_DESKTOP} {
        border: none;
      }
    }

    > .button.disabled {
      opacity: 0.2;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`
const HistoryItemWrapper = styled.div`
  padding: 4px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media ${MEDIA_DESKTOP} {
    padding: 12px;
    border-top: 1px solid var(--Gray-100, #F0F0F0);
  }
  > .item {
    color: var(--Black-300, #808080);
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`
const LeftArrow = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="#444444" strokeWidth="1.25" strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
}
const RightArrow = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="#444444" strokeWidth="1.25" strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
}

interface RankingProps {
  onClose?: () => void;
}

enum RankPeriod {
  ALL,
  SEASON,
  MONTHLY,
  WEEKLY,
  DAILY
}

const HISTORY_ITEM_PER_PAGE = 10;
const RankingPage = ({onClose}: RankingProps) => {
  const orientation = useScreenOrientation()
  const history = useHistory();
  const [selectedMenu, setSelectedMenu] = useState<RankPeriod>(RankPeriod.ALL);
  const [showRankingSheet, setShowRankingSheet] = useState(false)
  const [data, setData] = useState<{
    totalCount: number,
    data: any[]
  }>({
    totalCount: 222,
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(10);
  const [list, setList] = useState<UserRank[]>([]);

  const [dateTitle, setDateTitle] = useState<string>('');
  const [dateText, setDateText] = useState<string>('');
  const [startDate, setStartDate] = useState<Moment>();
  const [endDate, setEndDate] = useState<Moment>();
  const [season, setSeason] = useState<number>(0);

  const query = useQueryParams();
  const setLoading = useSetRecoilState(loadingState);

  const paginatedList = useMemo(() => {
    const start = HISTORY_ITEM_PER_PAGE * (currentPage - 1);
    const end = start + HISTORY_ITEM_PER_PAGE;
    return list.slice(start, end);
  }, [list, currentPage]);

  useEffect(() => {
    const tab = query.get('t');
    if (tab === 'season') {
      setSelectedMenu(1)
    } else if (tab === 'daily') {
      setSelectedMenu(4);
    }
  }, []);

  useEffect(() => {
    if (selectedMenu === RankPeriod.ALL) {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    } else if (selectedMenu === RankPeriod.SEASON) {
      const season = getSeasonByDate(moment());
      const {start, end} = getSeasonPeriod(season);
      setSeason(season);
      setStartDate(start);
      setEndDate(end);
      return;
    }

    let start = moment();
    let end = moment();
    if (selectedMenu === RankPeriod.MONTHLY) {
      start = start.startOf('month');
      end = end.endOf('month');
    } else if (selectedMenu === RankPeriod.WEEKLY) {
      start = start.startOf('week');
      end = end.endOf('week');
    }
    setStartDate(start);
    setEndDate(end);
  }, [selectedMenu]);

  useEffect(() => {
    setLoading(true);

    if (!startDate || !endDate) {
      setDateTitle('');
      setDateText('');

      totalRunnerRankingList().then((list) => {
        setList(list);
      }).catch((e: any) => {
        enqueueSnackbar(e.message, {variant: 'error'});
      }).finally(() => {
        setLoading(false);
      })
    } else {
      if (selectedMenu === RankPeriod.SEASON) {
        setDateTitle('시즌 ' + season);
      } else if (selectedMenu === RankPeriod.MONTHLY) {
        setDateTitle(`${startDate.year()}년 ${startDate.month() + 1}월`);
      } else if (selectedMenu === RankPeriod.WEEKLY) {
        setDateTitle(`${startDate.year()}년 ${startDate.month() + 1}월 ${Math.ceil((startDate.date() + 1) / 7)}주차`);
      }

      if (selectedMenu === RankPeriod.DAILY) {
        setDateTitle('');
        setDateText(startDate.format('YYYY/MM/DD'));
      } else {
        setDateText(startDate.format('YYYY/MM/DD') + ' ~ ' + endDate.format('YYYY/MM/DD'));
      }

      runnerRankingList({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      }).then((list) => {
        setList(list)
      }).catch((e: any) => {
        enqueueSnackbar(e.message, {variant: 'error'});
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [season, startDate, endDate]);

  useEffect(() => {
    const innerTotalCount = data.totalCount;
    const arr = [];
    const maxPage = Math.ceil(innerTotalCount / HISTORY_ITEM_PER_PAGE);
    let innerStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    let innerEndPage = Math.min(innerStartPage + 4, maxPage);
    if(orientation === 'landscape'){
      innerStartPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
      innerEndPage = Math.min(innerStartPage + 9, maxPage);
    }

    setStartPage(innerStartPage);
    setEndPage(innerEndPage);
    //페이지는 최대 10개까지
    for (let i = innerStartPage; i <= innerEndPage; i++) {
      arr.push(i);
    }
    setPageArray(arr);
    setHasNextPage(innerEndPage < maxPage);
    setHasPrevPage(innerStartPage > 1);
  }, [currentPage, data.totalCount, orientation]);
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (history.length > 1) {
        history.goBack();
      } else {
        history.push('/')
      }
    }
  }

  const handleDate = (sign: 1 | -1) => {
    if (selectedMenu === RankPeriod.SEASON) {
      const selectedSeason = season + sign;
      if (selectedSeason < 1) {
        return;
      }
      const {start, end} = getSeasonPeriod(selectedSeason);
      // 변경하려는 시즌이 미래의 시즌이면 변경 취소
      if (start.isAfter(moment())) {
        return;
      }
      setStartDate(start.clone());
      setEndDate(end.clone());
      setSeason(selectedSeason)
      return;
    }

    const d = moment(startDate?.clone())
    if (selectedMenu === RankPeriod.MONTHLY) {
      d.add(sign * 1, 'month')
      setStartDate(d.clone().startOf('month'));
      setEndDate(d.clone().endOf('month'));
    } else if (selectedMenu === RankPeriod.WEEKLY) {
      d.add(sign * 1, 'week')
      setStartDate(d.clone().startOf('week'));
      setEndDate(d.clone().endOf('week'));
    } else if (selectedMenu === RankPeriod.DAILY) {
      d.add(sign * 1, 'day')
      setStartDate(d.clone());
      setEndDate(d.clone());
    }
  }

  return <>
    <RankingPointSheet showRankingSheet={showRankingSheet} setShowRankingSheet={setShowRankingSheet}/>
    <RankingWrapper scrollLock={false}>
      <div className="header">
        <div className="close" onClick={handleClose}>
          <img src="/image-web/Icon/Back.svg" alt="close"/>
        </div>
        <div className="title">러너 랭킹</div>
        <div className='button' onClick={() => setShowRankingSheet(true)}>랭킹 점수 안내</div>
      </div>
      <div className='inner'>

        <RankBox>
          <div className='title'>
            낮 2시, 밤 8시 데일리 토너먼트 랭킹 <div className='sub' onClick={() => setShowRankingSheet(true)}><img src='/image-web/Icon/Info/small.svg'/><span>랭킹 점수 안내</span></div>
          </div>
          <div className='menu-row'>
            <div className={'menu ' + (selectedMenu === RankPeriod.ALL ? 'selected' : '')}
                 onClick={() => setSelectedMenu(0)}>통합
              <div className='line'/>
            </div>
            <div className={'menu ' + (selectedMenu === RankPeriod.SEASON ? 'selected' : '')}
                 onClick={() => setSelectedMenu(1)}>시즌
              <div className='line'/>
            </div>
            <div className={'menu ' + (selectedMenu === RankPeriod.MONTHLY ? 'selected' : '')}
                 onClick={() => setSelectedMenu(2)}>월간
              <div className='line'/>
            </div>
            <div className={'menu ' + (selectedMenu === RankPeriod.WEEKLY ? 'selected' : '')}
                 onClick={() => setSelectedMenu(3)}>주간
              <div className='line'/>
            </div>
            <div className={'menu ' + (selectedMenu === RankPeriod.DAILY ? 'selected' : '')}
                 onClick={() => setSelectedMenu(4)}>일별
              <div className='line'/>
            </div>
          </div>
            {
              selectedMenu !== RankPeriod.ALL &&
              <PCRankBar>
                <div className='arrow left' onClick={() => handleDate(-1)}><Arrow/></div>
                <div className='info'>
                  {
                    dateTitle && (
                      <div className='title'>{dateTitle}</div>
                    )
                  }
                  <div className='date'>{dateText}</div>
                </div>
                <div className='arrow' onClick={() => handleDate(1)}><Arrow/></div>
              </PCRankBar>
            }
          <MainRank>
            <img src='/image-web/rank/background.png' className='background'/>
            {
              selectedMenu === RankPeriod.ALL ?
                <div className='rank-bar'>통합 누적 랭킹</div> :
                <div className='rank-bar flex'>
                  <div className='arrow left' onClick={() => handleDate(-1)}><Arrow/></div>
                  <div className='info'>
                    {
                      dateTitle && (
                        <div className='title'>{dateTitle}</div>
                      )
                    }
                    <div className='date'>{dateText}</div>
                  </div>
                  <div className='arrow' onClick={() => handleDate(1)}><Arrow/></div>
                </div>
            }

            <div className='prize-row'>
              <div className='prize'>
                {
                  list[1] && <>
                    <div className='title'>{list[1].nickname}</div>
                    <div className='point'>{list[1].point.toLocaleString()} 포인트</div>
                    <div className='circle'/>
                  </>
                }
                <img className='line' src={`/image-web/rank/rank_2${orientation === 'landscape' ?'_pc' : ''}.png`}/>
              </div>
              <div className='prize'>
                {
                  list[0] && <>
                    <div className='title'>{list[0].nickname}</div>
                    <div className='point'>{list[0].point.toLocaleString()} 포인트</div>
                    <div className='circle'/>
                  </>
                }
                <img className='line' src={`/image-web/rank/rank_1${orientation === 'landscape' ? '_pc' : ''}.png`}/>
              </div>
              <div className='prize'>
                {
                  list[2] && <>
                    <div className='title'>{list[2].nickname}</div>
                    <div className='point'>{list[2].point.toLocaleString()} 포인트</div>
                    <div className='circle'/>
                  </>
                }
                <img className='line' src={`/image-web/rank/rank_3${orientation === 'landscape' ? '_pc' : ''}.png`}/>
              </div>
            </div>
          </MainRank>
        </RankBox>
        <ListWrapper>
          <div className='header'>
            <div className='item no'>순위</div>
            <div className='item nickname'>닉네임</div>
            <div className='item point'>랭킹 포인트</div>
          </div>
          <div className='inner'>
            <div className='list'>
              {paginatedList.length > 0 ? (
                paginatedList.map((item, i) => {
                  return <HistoryItemWrapper key={i}>
                    <div className='item no'>{item.rank}</div>
                    <div className='item nickname'>{item.nickname}</div>
                    <div className='item point'>{item.point.toLocaleString()}</div>
                  </HistoryItemWrapper>
                })) : (
                  <div className="no-data">데이터 준비 중 입니다.</div>
                )
              }
            </div>
          </div>
          <div className='pagination-row'>
            <div className={'button ' + (!hasPrevPage ? 'disabled' : '')}
                 onClick={() => setCurrentPage(startPage - 1)}>
              <LeftArrow/>
            </div>
            {
              //5개씩 페이징
              pageArray.map((_, i) => {
                return <div key={i} className={'button ' + (
                  currentPage === _ ? 'selected' : ''
                )}
                            onClick={() => setCurrentPage(_)}
                >
                  {_}
                </div>
              })
            }
            <div
              className={'button ' + (!hasNextPage ? 'disabled' : '')}
              onClick={() => setCurrentPage(endPage + 1)}>
              <RightArrow/>
            </div>
          </div>
        </ListWrapper>
      </div>
    </RankingWrapper>
  </>
}

const getSeasonPeriod = (season: number): {
  start: Moment,
  end: Moment
} => {
  if (season <= 1) {
    // 시즌 1 = 23/11/22 ~ 24/03/31
    return {
      start: moment('2023-11-22 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
      end: moment('2024-03-31 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
    }
  } else {
    const multiplier = season - 2;
    const s2Start = moment('2024-04-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
    const start = s2Start.clone().add(3 * multiplier, 'month').startOf('month');
    const end = start.clone().add(2, 'month').endOf('month');

    return {
      start: start,
      end: end,
    }
  }
}

const getSeasonByDate = (input: Moment) => {
  const firstSeasonPeriod = getSeasonPeriod(1);
  if (input.isBetween(firstSeasonPeriod.start, firstSeasonPeriod.end)) {
    return 1;
  }
  const secondSeasonPeriod = getSeasonPeriod(2);
  const diff = input.diff(secondSeasonPeriod.start, 'months');
  return Math.floor(diff / 3) + 2;
}


export default RankingPage;
