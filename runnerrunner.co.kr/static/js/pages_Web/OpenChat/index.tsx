import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { openNewWindow } from "../../../utils/common";
import { useState } from "react";
import { OpenChatLabels } from "../../../utils/constants";
const EventWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: relative;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  max-width: 500px;
  z-index: 10;
  background: #b0c6dc;
  transition: all 0.5s ease-in-out;

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
    gap: 8px;

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  overflow: auto;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: #b0c6dc;
  transition: all 0.5s ease-in-out;

  > .map {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    padding: 45px 58px 10px 56px;
    > img {
      width: 100%;
    }

    .runner-open-button {
      position: absolute;
      bottom: 11px;
      right: 16px;
      width: 134px;
      height: 30px;
      padding: 9px 12px 9px 12px;
      border-radius: 15px;
      background: rgba(246, 222, 0, 1);
      font-family: Pretendard;
      font-size: 12px;
      font-weight: 600;
      line-height: 14.32px;
      text-align: left;
    }
  }

  > .open-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    height: 48px;
    text-align: center;
    border-radius: 8px;
    padding: 0px 16px;
    font-weight: 600;
    background-color: #f6de00;
    > img {
      margin-right: 8px;
    }
  }
`;
const OpenChatSelectWrapper = styled.div`
  position: relative;
  max-width: 500px;
  left: 50%;
  height: 192px;
  border-radius: 8px;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
`;
const OpenChatTitleWrapper = styled.h4`
  left: 16px;
  top: 16px;
  position: relative;
`;

const SelectorWrapper = styled.div`
  position: absolute;
  left: 16px;
  bottom: 20px;
  display: flex;
  flex-wrap: wrap;

  gap: 2%;
  z-index: 11;
  width: calc(100% - 32px);
  > .location {
    width: 23.5%;
    height: 30px;
    margin-bottom: 6px;
    cursor: pointer;
    flex-shrink: 0;
    color: #d9d9d9;
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    padding: 7px 0px;
    border-radius: 15px;
    border: 1px solid #d9d9d9;
    background: white;
  }
`;

const SeoulWrapper = styled.div`
  position: absolute;
  left: 38%;
  top: 18%;
  width: 5%;
  height: 7%;
`;

const InChonWrapper = styled.div`
  position: absolute;
  left: 33%;
  top: 18%;
  width: 9%;
  height: 9%;
`;

const KyungKiDoWrapper = styled.div`
  position: absolute;
  left: 30%;
  top: 0px;
  width: 20%;
  height: 34%;
`;

const KangWonDoWrapper = styled.div`
  position: absolute;
  right: 20%;
  top: 0px;
  width: 30%;
  height: 33%;
`;

const JunRaDoWrapper = styled.div`
  position: absolute;
  left: 20%;
  bottom: 15%;
  width: 32%;
  height: 34%;
`;

const BuSanWrapper = styled.div`
  position: absolute;
  right: 20%;
  bottom: 20%;
  width: 28%;
  height: 24%;
`;

const DaeGuWrapper = styled.div`
  position: absolute;
  right: 18%;
  bottom: 44%;
  width: 30%;
  height: 23%;
`;

const ChwoongChungDoWrapper = styled.div`
  position: absolute;
  left: 22%;
  bottom: 49%;
  width: 30%;
  height: 18%;
`;

const DaeJoenWrapper = styled.div`
  position: absolute;
  left: 42%;
  top: 40%;
  width: 10%;
  height: 8%;
`;

const JaeJooDoWrapper = styled.div`
  position: absolute;
  left: 20%;
  bottom: 5%;
  width: 17%;
  height: 10%;
`;

const OpenChatList = () => {
  const history = useHistory();

  const [selectedOpenChatLabel, selectOpenChatLabel] = useState(
    OpenChatLabels[0]
  );

  return (
    <EventWrapper scrollLock={false}>
      <div className="header">
        <div
          className="close"
          onClick={() => {
            history.push("/");
          }}
        >
          <img
            src="/image-web/Icon/Back.svg"
            id="오픈톡 뒤로가기"
            alt="close"
          />
        </div>
        <div className="title">지역별 오픈채팅</div>
      </div>
      <ContentWrapper>
        <div className="map" id="맵 이미지">
          <JaeJooDoWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[9]);
            }}
          ></JaeJooDoWrapper>
          <KyungKiDoWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[1]);
            }}
          ></KyungKiDoWrapper>
          <InChonWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[2]);
            }}
          ></InChonWrapper>
          <SeoulWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[0]);
            }}
          ></SeoulWrapper>
          <KangWonDoWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[3]);
            }}
          ></KangWonDoWrapper>
          <JunRaDoWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[4]);
            }}
          ></JunRaDoWrapper>
          <BuSanWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[5]);
            }}
          ></BuSanWrapper>
          <DaeGuWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[6]);
            }}
          ></DaeGuWrapper>
          <ChwoongChungDoWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[7]);
            }}
          ></ChwoongChungDoWrapper>
          <DaeJoenWrapper
            onClick={() => {
              selectOpenChatLabel(OpenChatLabels[8]);
            }}
          ></DaeJoenWrapper>
          <img src={selectedOpenChatLabel.image} alt="맵이미지" />
          <div
            className="runner-open-button"
            id="입장버튼"
            onClick={() => {
              openNewWindow("https://open.kakao.com/o/gCoBPh4f");
            }}
          >
            러너러너 공식 오픈채팅
          </div>
        </div>

        <OpenChatSelectWrapper>
          <OpenChatTitleWrapper>
            실시간 지역별
            <br />
            홀덤펍/토너먼트 대회정보를 확인해보세요!
          </OpenChatTitleWrapper>
          <SelectorWrapper>
            {OpenChatLabels.map((item, i) => {
              return (
                <div
                  style={{
                    color:
                      selectedOpenChatLabel === item
                        ? item.textColor
                        : "#d9d9d9",
                    backgroundColor:
                      selectedOpenChatLabel === item
                        ? item.backgroundColor
                        : "white",
                  }}
                  className={
                    "location " +
                    (selectedOpenChatLabel === item ? "selected" : "")
                  }
                  key={i}
                  onClick={() => {
                    selectOpenChatLabel(item);
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </SelectorWrapper>
        </OpenChatSelectWrapper>
        <div
          className="open-button"
          id="입장버튼"
          onClick={() => {
            openNewWindow(selectedOpenChatLabel.url);
          }}
        >
          <img src="/image-web/openChat/OpenChat=입장.svg"></img>
          오픈채팅 입장하기
        </div>
      </ContentWrapper>
    </EventWrapper>
  );
};

export default OpenChatList;
