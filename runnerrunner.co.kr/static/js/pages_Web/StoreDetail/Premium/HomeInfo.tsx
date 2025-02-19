import styled from "styled-components";
import { InfoBoxWrapper } from "../../../../components/common/InfoBoxWrapper";
import { RefObject, useContext } from "react";
import { getFacilityContent } from "../../../../utils/constants";
import { StoreContext } from "../StoreContext";

const HomeInfoBox = styled(InfoBoxWrapper)`
  > .service-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 12px;
    justify-items: center;
    justify-content: center;

    > .item {
      width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
      gap: 8px;

      img {
        width: 32px;
        height: 32px;
      }

      > span {
        color: var(--Black-400, #444);
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }

  > .info-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;

    > .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      > img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }

      > span {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > .bold {
        color: var(--Black-400, #444);
        font-weight: 600;
      }
    }
  }

  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--Black-100, #f0f0f0);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;

    > img {
      width: 20px;
      height: 20px;
    }
  }
`;

interface InfoBoxProps {
  boxRef: RefObject<HTMLDivElement>;
}

const HomeInfo = ({ boxRef }: InfoBoxProps) => {
  const { data } = useContext(StoreContext);

  return (
    <HomeInfoBox ref={boxRef}>
      <div className="service-list">
        {data.facilities.map((item, index) => {
          const facility = getFacilityContent(item.type);
          if (!facility) {
            return null;
          }

          return (
            <div className="item" key={index}>
              <img
                alt="item"
                src={`/image-web/store/Detail/Property%201=${facility.img}.svg`}
              />
              <span>{facility.title}</span>
            </div>
          );
        })}
      </div>
    </HomeInfoBox>
  );
};
export default HomeInfo;
