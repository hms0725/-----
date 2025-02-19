import { useMemo, useState } from "react";
import styled from "styled-components";
import { openNewWindow } from "../../../utils/common";
import { IYoutube } from "../../../api/youtube";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import Pagination from "../../../components/web/Pagination";

const YoutubeWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
`;

const Title = styled.div`
  color: #444;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const ChannelList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;

  @media ${MEDIA_DESKTOP} {
    gap: 16px;
  }
`;

const CardItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
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

const TextWrapper = styled.div`
  width: 100%;
  height: 26px;
  display: flex;
  margin-top: 5px;
  align-items: flex-start;
`;

const Text = styled.div`
  position: relative;
  color: #444;
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
const ITEMS_PER_PAGE = 4;
const YoutubeList = ({ list }: { list: IYoutube[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [list, currentPage]);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  if (list.length === 0) {
    return null;
  }

  return (
    <YoutubeWrapper>
      <Title>최신 포커 영상</Title>
      <ChannelList>
        {paginatedList.map((item) => (
          <CardItemWrapper
            key={item.id}
            onClick={() => openNewWindow(item.url)}
          >
            <ThumbnailWrapper>
              <Thumbnail src={item.thumbnailUrl} alt={item.title} />
            </ThumbnailWrapper>
            <TextWrapper>
              <Text title={item.title}>{item.title}</Text>
            </TextWrapper>
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
    </YoutubeWrapper>
  );
};

export default YoutubeList;
