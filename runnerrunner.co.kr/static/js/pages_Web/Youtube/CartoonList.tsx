import styled from "styled-components";
import { openNewWindow } from "../../../utils/common";
import { IYoutube, IYoutubeChannel } from "../../../api/youtube";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/web/Pagination";

const CartoonWrapper = styled.div`
  width: 100%;
  height: 430px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
  > .pagination-row {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 25px;
    padding-bottom: 10px;
    @media ${MEDIA_DESKTOP} {
      width: 100%;
      border-top: 1px solid #b7b7b7;
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
      border: 1px solid var(--Purple-100, #f0eaff);
      background: #fff;
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */

      > svg {
        width: 20px;
        height: 20px;
      }
    }

    > .button.selected {
      border: 1px solid var(--Purple-300, #6436e7);
      color: var(--Purple-300, #6436e7);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 142.857% */
    }

    > .button.disabled {
      opacity: 0.2;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;

const Title = styled.div`
  color: #444;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  margin-bottom: 16px;
`;

const ChannelList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;

  @media ${MEDIA_DESKTOP} {
    gap: 16px;
  }
`;

const CardItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  position: relative;

  > .overlay {
    width: 100%;
    height: 26px;
    display: flex;
    margin-top: 5px;
    align-items: flex-start;
  }
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; // 16:9 비율 유지
  position: relative;
  overflow: hidden;
  border-radius: 8px;
`;

const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Text = styled.div`
  position: relative;
  color: rgb(68, 68, 68);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: -0.24px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;

  @media ${MEDIA_DESKTOP} {
    font-size: 14px;
    letter-spacing: -0.28px;
  }
`;
const TabList = styled.div`
  display: flex;
  width: 100%;
`;
const TabWarapper = styled.div`
  border-radius: 15px;
  padding: 9px 12px;
  margin-right: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  border-style: solid;
  border-width: 1px;
  border-color: #b7b7b7;
  &.current {
    background-color: #6436e7;
    border-style: none;
    color: white;
    > div {
      color: white;
    }
  }
`;
const TabName = styled.div`
  color: #444;
  padding-left: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.24px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
`;

const TabImageWarapper = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 35px;
`;

const ITEM_PER_PAGE = 4;

const CartoonList: React.FC<{ list: IYoutube[] }> = ({ list }) => {
  const [channelList, setChannelList] = useState<IYoutubeChannel[]>([]);
  const [currentList, setCurrentList] = useState<IYoutube[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginatedList = useMemo(() => {
    const start = ITEM_PER_PAGE * (currentPage - 1);
    const end = start + ITEM_PER_PAGE;
    return currentList.slice(start, end);
  }, [currentList, currentPage]);

  const totalPages = Math.ceil(currentList.length / ITEM_PER_PAGE);

  useEffect(() => {
    if (list.length === 0) return;
    setCurrentList(
      list.filter((cartoon) => cartoon.youtubeChannel.id === currentChannelId)
    );
  }, [list, currentChannelId]);

  useEffect(() => {
    const uniqueChannels = Array.from(
      new Set(list.map((item) => JSON.stringify(item.youtubeChannel)))
    ).map((strChannel) => JSON.parse(strChannel) as IYoutubeChannel);

    setChannelList(uniqueChannels);
    if (uniqueChannels.length > 0) {
      setCurrentChannelId(uniqueChannels[0].id);
    }
  }, [list]);

  if (list.length === 0) return null;

  return (
    <CartoonWrapper>
      <Title>포커 만화</Title>
      <TabList>
        {channelList.map((item) => (
          <TabWarapper
            key={item.id}
            onClick={() => {
              setCurrentChannelId(item.id);
              setCurrentPage(1); // 채널 변경 시 페이지 초기화
            }}
            className={currentChannelId === item.id ? "current" : ""}
          >
            <TabImageWarapper src={item?.profileUrl} alt={item?.name} />
            <TabName title={item?.name}>{item?.name}</TabName>
          </TabWarapper>
        ))}
      </TabList>
      <ChannelList>
        {paginatedList.map((item) => (
          <CardItemWrapper
            key={item.id}
            onClick={() => openNewWindow(item.url)}
          >
            <ThumbnailWrapper>
              <Thumbnail src={item.thumbnailUrl} alt={item.title} />
            </ThumbnailWrapper>
            <div className="overlay">
              <Text title={item.title}> {item.title}</Text>
            </div>
          </CardItemWrapper>
        ))}
      </ChannelList>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </CartoonWrapper>
  );
};

export default CartoonList;
