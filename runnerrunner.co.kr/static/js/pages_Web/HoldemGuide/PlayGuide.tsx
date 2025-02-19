import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";

const DefaultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 30px;
  padding: 30px 16px 80px;
  @media ${MEDIA_DESKTOP} {
    padding: 30px 35px;
  }
  > .wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 30px;
    @media ${MEDIA_DESKTOP} {
      flex-direction: row;
    }
    > .description {
      text-align: left;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 18.2px */
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        font-size: 14px;
      }
    }

    > .photo-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 4px;
      @media ${MEDIA_DESKTOP} {
        width: 480px;
        flex-shrink: 0;
      }
      > img {
        width: 50%;
        border-radius: 8px;

        flex: 1;
        aspect-ratio: 162/210;
      }
    }

    > .photo {
      object-fit: contain;
      border-radius: 8px;
      width: 100%;
      aspect-ratio: 328/156;
      object-fit: contain;
      @media ${MEDIA_DESKTOP} {
        width: 480px;
        flex-shrink: 0;
      }
    }
    > .photo2 {
      object-fit: contain;
      border-radius: 8px;
      width: 100%;
      aspect-ratio: 328/156;
      object-fit: contain;
      @media ${MEDIA_DESKTOP} {
        width: 480px;
        flex-shrink: 0;
      }
    }
  }
`;
const PlayGuide = () => {
  return (
    <DefaultWrapper>
      <div className="wrapper">
        <div className="description">
          텍사스 홀덤은, 2장의 핸드 카드와 5장의 커뮤니티 카드를 조합하는
          게임입니다. 2장의 핸드 카드는 오로지 본인만 확인이 가능하며 5장의
          커뮤니티 카드는 모든 플레이어가 공유를 하게 됩니다. 총 7장의 카드를
          조합하여 가장 높은 족보를 형성한 사람이 이기는 게임입니다.
        </div>
        <img src="/image-web/guide/image_1.png" className="photo" />
      </div>
      <div className="wrapper">
        <div className="description">
          그래서 저희 러너러너에서는 텍사스 홀덤 기본 족보와 카드 핸드 랭킹을
          한눈에 알아보기 쉽게 정리해 보았습니다. 홀덤 족보에 관한 자주
          물어보시는 질문과 홀덤 족보 암기를 잘하는 팁을 공유 드립니다.
        </div>
        <div className="photo-row">
          <img src="/image-web/guide/image_2.png" className="photo" />
          <img src="/image-web/guide/image_3.png" className="photo2" />
        </div>
      </div>
    </DefaultWrapper>
  );
};

export default PlayGuide;
