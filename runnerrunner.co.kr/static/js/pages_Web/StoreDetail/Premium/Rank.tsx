import { useEffect, useRef, useState } from "react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { Restaurant } from "../../../../api/types";
import {
  MenuInfoWrapper,
  Overlay,
  RankPopup,
  RankWrapper,
} from "./styles/Rank";
import { getRanking, RankingRes } from "../../../../api/member";
import { useParams } from "react-router";

const MenuInfo = () => {
  const [list, setList] = useState<RankingRes[]>([]);
  const { id } = useParams<{ id: string }>();
  const [isInfoPopup, setIsInfoPopup] = useState<boolean>(false);
  const [myRank, setMyRank] = useState<number | null>(null);

  const [blurredItems, setBlurredItems] = useState<number[]>([]);
  const rankRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);

  const [parentWidth, setParentWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const getList = async () => {
    try {
      const res = await getRanking(+id);

      setList(res.rankings);
      setMyRank(res.myRank);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const updateParentWidth = () => {
    if (parentRef.current) {
      setParentWidth(parentRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateParentWidth();
    window.addEventListener("resize", updateParentWidth);

    return () => {
      window.removeEventListener("resize", updateParentWidth);
    };
  }, []);

  useEffect(() => {
    // IntersectionObserver : 화면에 보이는 것들 감지
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIndices((prevVisibleIndices) => {
          let newVisibleIndices = [...prevVisibleIndices];
          // entries : 화면에 잡힌 것들, isIntersecting : 화면에 잡혔는지 안 잡혔는지
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute("data-index"));
            if (entry.isIntersecting && !newVisibleIndices.includes(index)) {
              newVisibleIndices.push(index);
            } else {
              newVisibleIndices = newVisibleIndices.filter((i) => i !== index);
            }
          });

          if (myRank !== null) {
            if (
              (!newVisibleIndices.slice(-1).includes(myRank) && // 내 순위가 보이는 인덱스의 마지막에 포함되지 않음
                !newVisibleIndices.slice(0, 3).includes(myRank) && // 내 순위가 보이는 인덱스의 0~1에 포함되지 않음
                newVisibleIndices.includes(myRank)) || // 내 순위가 보이는 인덱스에 존재
              newVisibleIndices.length < 7 // 보이는 인덱스의 크기가 7보다 작음
            ) {
              setIsFixed(false); // 고정 해제 (내 순위 안 보임)
            } else {
              setIsFixed(true);
            }

            const lastIndex = newVisibleIndices.length - 1;
            const secondLastIndex = lastIndex - 1;

            if (newVisibleIndices.slice(0, 2).includes(myRank)) {
              if (
                newVisibleIndices[lastIndex] <
                newVisibleIndices[secondLastIndex]
              ) {
                setIsPass(false); // 위로 스크롤하고 내 순위 지나감 -> 아래로 고정
              } else {
                setIsPass(true); // 아래로 스크롤하고 내 순위 지나감 -> 위로 고정
              }
            }
          }

          const max = Math.max(...newVisibleIndices); // 배열의 가장 큰 값
          const maxIndex = newVisibleIndices.indexOf(max); // 큰 값의 인덱스

          if (newVisibleIndices.length > 8) {
            // 만약 보이는 인덱스의 배열이 8 초과라면, rank의 마지막 index값 가져와서 보이는 배열의 마지막 인덱스가
            setBlurredItems(
              newVisibleIndices.slice(Math.max(0, maxIndex - 3), maxIndex + 1)
            );
          }
          if (newVisibleIndices.slice(-1)[0] === 49) {
            setBlurredItems([]);
          }

          return newVisibleIndices;
        });
      },
      { threshold: 0.1 } // 10% 이상 보일 때 작동
    );

    rankRefs.current.forEach((ref) => ref && observer.observe(ref)); // ref가 화면에 보일 때 위의 콜백 함수 작동

    return () => {
      rankRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [rankRefs]);

  const rank = [
    { name: "BRONZE", value: "1~300" },
    { name: "SILVER", value: "301~700" },
    { name: "GOLD", value: "701~1500" },
    { name: "DIAMOND", value: "1501~" },
    { name: "MASTER", value: "3500P 초과 중 상위 5인" },
  ];

  const mainPoint = [
    { rank: "1등", point: 50 },
    { rank: "2등", point: 50 },
    { rank: "3등", point: 50 },
    { rank: "4등", point: 50 },
    { rank: "5등", point: 50 },
    { rank: "6~10등", point: 50 },
  ];

  const sidePoint = [
    { rank: "1등", point: 20 },
    { rank: "2등", point: 15 },
    { rank: "3등", point: 10 },
  ];

  return (
    <>
      <MenuInfoWrapper>
        <div className="recommended">
          <div className="title-row">
            <div className="title">랭킹</div>
            <div className="info-box" onClick={() => setIsInfoPopup(true)}>
              랭킹 안내
            </div>
          </div>
          <div className="menu-list">
            {Array.isArray(list) && list.length > 0 ? (
              <RankWrapper
                ref={parentRef}
                isFixed={isFixed}
                isPass={isPass}
                width={parentWidth}
              >
                {list.map((item, index) => (
                  <>
                    {index + 1 === myRank && (
                      <div data-index={index} className="rank-box my-rank">
                        <div className="box">
                          <div className="rank">{myRank}위</div>
                          <div className="name">{item.nickname}</div>
                        </div>
                        <div className="box">
                          <div className="icon">
                            <img
                              src={`/image-web/rank/${item.tier}.png`}
                              alt={`${item.tier}`}
                            />
                            <span>{item.tier}</span>
                          </div>
                          <div className="score">
                            <span>{item.points} </span>점
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      key={index}
                      ref={(el) => (rankRefs.current[index] = el)}
                      data-index={index}
                      className={`rank-box ${
                        item.rank === myRank ? "border" : ""
                      } ${blurredItems.includes(index) ? "blur" : ""}`}
                    >
                      <div className="box">
                        <div className="rank">{item.rank}위</div>
                        <div className="name">{item.nickname}</div>
                      </div>
                      <div className="box">
                        <div className="icon">
                          <img
                            src={`/image-web/rank/${item.tier}.png`}
                            alt={`${item.tier}`}
                          />
                          <span>{item.tier}</span>
                        </div>
                        <div className="score">
                          <span>{item.points} </span>점
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </RankWrapper>
            ) : (
              <div className="no-menu">랭킹이 존재하지 않습니다.</div>
            )}
          </div>
        </div>
      </MenuInfoWrapper>
      {isInfoPopup && (
        <RankPopup>
          <div className="header">
            <div className="title">랭킹 안내</div>
            <div className="back" onClick={() => setIsInfoPopup(false)}>
              <img src="/image-web/X.svg" alt="close" />
            </div>
          </div>
          <div className="rank-box">
            {rank.map((item, index) => (
              <div className={`rank i${index}`}>
                <div className="left">
                  <img
                    src={`/image-web/rank/${item.name}.png`}
                    alt={`${item.name}`}
                  />
                  <div className={`name ${index === 4 ? "master" : ""}`}>
                    {item.name}
                  </div>
                </div>
                {index === 4 ? (
                  <div className="value">{item.value}</div>
                ) : (
                  <div className="value">
                    {item.value}
                    <br />
                    <span>P</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="info-box">
            <div className="title">랭킹 포인트 획득 방법</div>
            <div className="info">
              <div className="sub-title">메인 토너먼트</div>
              <div className="rank">
                {mainPoint.map((item, index) => (
                  <div className="box" key={index}>
                    <div>{item.rank}</div>
                    <div className="point">{item.point} P</div>
                  </div>
                ))}
              </div>
              <div className="sub-title">사이드 토너먼트</div>
              <div className="rank">
                {sidePoint.map((item, index) => (
                  <div className="box" key={index}>
                    <div>{item.rank}</div>
                    <div className="point">{item.point} P</div>
                  </div>
                ))}
              </div>
              <div className="sub-title">참여 토너먼트</div>
              <div className="point">싯인 / 리엔트리 / 애드온 각 +1P</div>
            </div>
          </div>
        </RankPopup>
      )}
      {isInfoPopup && <Overlay />}
    </>
  );
};
export default MenuInfo;
