import { useEffect, useState } from "react";
import {
  getNewsCategory,
  getNews,
  NewsResponse,
  NewsCategory,
} from "../../../api/news";
import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { useHistory } from "react-router-dom";
import HotNews from "./HotNews";
import NormalNews from "./News";

const NewsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  @media ${MEDIA_DESKTOP} {
    position: static;
    height: auto;
    max-width: 1060px;
    margin: 0 auto;
    padding: 40px 0;
  }
`;

const Content = styled.div`
  padding: 0 12px 56px;

  @media ${MEDIA_DESKTOP} {
    padding: 0 16px 56px;
  }
`;

const ReadMoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  position: relative;
`;

const Line = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #ccc;
  z-index: 1;
`;

const ReadMoreButton = styled.button`
  position: relative;
  background-color: white;
  font-size: 13px;
  font-weight: bold;
  padding: 7px 10px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s, color 0.3s;
  @media ${MEDIA_DESKTOP} {
    font-size: 16px;
  }
`;

const News = () => {
  const [hotNewsList, setHotNewsList] = useState<NewsResponse[]>([]);
  const [newsList, setNewsList] = useState<NewsResponse[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);

  const [selectCategory, setSelectCategory] = useState<NewsCategory | null>(
    null
  );

  const size = 10;
  const history = useHistory();

  const getNewList = async () => {
    const allNews = await getNews(currentPage, size, 2, selectCategory?.id);
    if (newsList.length > 0) {
      setNewsList((prevNewsList) => [...prevNewsList, ...allNews.news]);
      setHotNewsList(allNews.hotNews);
      return;
    }
    setHotNewsList(allNews.hotNews);
    setNewsList(allNews.news);
    setCount(allNews.totalElements);
  };

  const getNewsCategories = async () => {
    const categories = await getNewsCategory();
    setCategories(categories);
  };

  useEffect(() => {
    getNewList();
  }, [currentPage]);

  useEffect(() => {
    getNewsCategories();
  }, []);
  return (
    <NewsWrapper>
      <Content>
        <HotNews list={hotNewsList} />
        <NormalNews list={newsList} />
        {count > newsList.length && (
          <ReadMoreContainer>
            <Line />
            <ReadMoreButton onClick={() => setCurrentPage(currentPage + 1)}>
              더보기
            </ReadMoreButton>
          </ReadMoreContainer>
        )}
      </Content>
    </NewsWrapper>
  );
};
export default News;
