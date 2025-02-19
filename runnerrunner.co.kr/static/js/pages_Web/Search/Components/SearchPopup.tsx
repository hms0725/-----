import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import "rc-slider/assets/index.css";
import { Cafe } from "../../../../api/types";
import { PubSearchParams } from "../../../../api/cafe";
import { debounce, DebouncedFunc } from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { isPremiumAndVIP } from "../../../../utils/common";

const SearchFilterWrapper = styled.div<{
  scrollLock: boolean;
  header: boolean;
}>`
  position: absolute;
  top: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  height: 100svh;
  overscroll-behavior: none;
  z-index: 133;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${(p) =>
    !p.header &&
    `
    padding-top: 48px;
  `};

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
      > .no-result {
        width: 100%;
        height: calc(100vh - 170px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > img {
          width: 180px;
        }
      }
    }

    > .content.search-result {
      padding: 20px 16px;
      flex-grow: 1;
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
    gap: 13px;
    outline: none;

    > .input-wrapper {
      flex-grow: 1;
      background: var(--Black-100, #f0f0f0);
      border-radius: 15px;
      position: relative;

      > .close {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 12px;
        cursor: pointer;
      }

      > input {
        width: 100%;
        padding: 10px 12px;
        border: none;
        text-align: left;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        background: transparent;
        border-radius: 15px;

        &::placeholder {
          color: var(--Black-200, #b7b7b7);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          border-radius: 8px;
        }

        &:focus {
          outline: none;
          border: 1px solid #000;
        }
      }
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
const RecentlySearchWordWrapper = styled(DefaultInfoWrapper)`
  > .list {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;

    > .item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;

      > .word {
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > img {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
    }
  }
`;
const SearchResultWrapper = styled(DefaultInfoWrapper)`
  flex-grow: 1;

  > .list {
    width: 100%;
    flex-grow: 1;
    max-height: calc(100vh - 48px - 80px);
    overflow-y: scroll;

    > .inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      > .item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;
        padding: 12px 0;
        border-bottom: 1px solid var(--Black-100, #f0f0f0);

        &:first-child {
          padding-top: 0;
        }

        &:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        > .title-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          color: var(--Black-500, #202020);
          text-align: center;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;

          > img {
            margin-left: 8px;
            height: 16px;
            width: 16px;
          }
        }

        > .address {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }
    }
  }
`;

interface SearchFilterProps {
  onSearchText?: (params: PubSearchParams) => Promise<Cafe[]>;
  onClickResult?: (cafe: Cafe) => void;
  onClose: () => void;
}

const SearchFilter = ({
  onSearchText,
  onClickResult,
  onClose,
}: SearchFilterProps) => {
  const history = useHistory();
  const location = useLocation<{ mode?: string }>();

  const [hasText, setHasText] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Cafe[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("recentSearch") || "[]");
      setRecents(list);
    } catch (e) {
      localStorage.setItem("recentSearch", "[]");
    }
  }, []);

  const handleChangeText = useCallback(
    debounce((e: any) => {
      const q = e.target.value.trim();
      setText(q);
      if (q.length < 2) {
        setHasText(false);
        setSearchResults([]);
        return;
      }

      setHasText(true);
      if (onSearchText) {
        // 검색 결과는 handleSearch 내부의 processSearchResults에서 처리되므로
        // 여기서는 에러 처리만 합니다
        onSearchText({ q: q.trim() })
          .then((list) => {
            setSearchResults(list);
          })
          .catch((e) => {
            console.error("Error in search:", e);
            setSearchResults([]); // 에러 발생시 결과 비우기
          });
      }
    }, 200),
    []
  );

  const removeRecent = (v: string) => {
    const idx = recents.findIndex((x) => x === v);
    const newRecents = [...recents];
    newRecents.splice(idx, 1);
    localStorage.setItem("recentSearch", JSON.stringify(newRecents));
    setRecents(newRecents);
  };

  const handleClickRecent = useCallback(
    (v: string) => {
      if (inputRef.current) {
        inputRef.current.value = v;
        handleChangeText({ target: { value: v } });
      }
    },
    [handleChangeText]
  );

  const handleClickResult = useCallback(
    (cafe: Cafe) => {
      if (inputRef.current) {
        const q = inputRef.current.value;
        if (!recents.includes(q)) {
          const newRecents = [q, ...recents];
          localStorage.setItem("recentSearch", JSON.stringify(newRecents));
          setRecents(newRecents);
        }
      }

      onClickResult && onClickResult(cafe);
      onClose && onClose();
    },
    [recents, onClickResult, onClose]
  );

  const handleClose = () => {
    if (location.state?.mode === "query") {
      history.replace("/");
    }
    setTimeout(() => {
      onClose && onClose();
    }, 100);
  };

  return (
    <>
      <SearchFilterWrapper scrollLock={false} header={!onSearchText}>
        {onSearchText && (
          <div className="header">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="검색어를 입력해주세요"
                onInput={handleChangeText}
                autoFocus
              />
              {hasText && (
                <img
                  className="close"
                  src="/image-web/search/Delete/small.svg"
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.value = "";
                      setHasText(false);
                    }
                  }}
                />
              )}
            </div>
            <div className="button" onClick={handleClose}>
              취소
            </div>
          </div>
        )}

        <div className="inner">
          <div className={"content " + (hasText ? "search-result" : "")}>
            {hasText ? (
              searchResults.length > 0 ? (
                <SearchResultWrapper>
                  <div className="title">검색 결과</div>
                  <div className="list">
                    <div className="inner">
                      {searchResults.map((v, i) => {
                        const parts = v.cafeName.split(
                          new RegExp(`(${text})`, "gi")
                        );
                        return (
                          <div
                            className="item"
                            key={i}
                            onClick={() => handleClickResult(v)}
                          >
                            <div className="title-row">
                              {parts.map((part, index) =>
                                part.toLowerCase() === text.toLowerCase() ? (
                                  <span
                                    key={index}
                                    style={{
                                      color: "var(--Purple-300, #6436E7)",
                                    }}
                                  >
                                    {part}
                                  </span>
                                ) : (
                                  <span key={index}>{part}</span>
                                )
                              )}
                              {isPremiumAndVIP(v.pubType) && (
                                <img
                                  alt="premium mark"
                                  className="premium"
                                  src="/image-web/store/premium.png"
                                />
                              )}
                            </div>
                            <div className="address">
                              {v.newAddress} {v.detailAddress}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </SearchResultWrapper>
              ) : (
                <div className="no-result">
                  <img src="/image-web/search/no_search.png" />
                </div>
              )
            ) : (
              <>
                {onSearchText && text.length < 2 && (
                  <RecentlySearchWordWrapper>
                    <div className="title">최근 검색어</div>
                    <div className="list">
                      {recents.length === 0 && (
                        <small>최근 검색어가 없습니다.</small>
                      )}
                      {recents.map((item) => (
                        <div className="item" key={item}>
                          <div
                            className="word"
                            onClick={() => handleClickRecent(item)}
                          >
                            {item}
                          </div>
                          <img
                            src="/image-web/search/Delete/small.svg"
                            alt="delete"
                            onClick={() => removeRecent(item)}
                          />
                        </div>
                      ))}
                    </div>
                  </RecentlySearchWordWrapper>
                )}
              </>
            )}
          </div>
        </div>
      </SearchFilterWrapper>
    </>
  );
};

export default SearchFilter;
