import styled from "styled-components";
import {MEDIA_DESKTOP} from "../../../hooks/useScreenOrientation";

const DefaultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;

  > .inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 30px;
    padding: 30px 16px 80px;

    > .description {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 18.2px */
      letter-spacing: -0.26px;
    }

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .box {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      @media ${MEDIA_DESKTOP} {
        flex-direction: row;
        justify-content: space-between;
        gap: 30px;
      }
      >.info-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 12px;
        > .title {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 140%; /* 19.6px */
          letter-spacing: -0.28px;
        }

        > .description {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 18.2px */
          letter-spacing: -0.26px;
          margin-top: 12px;
        }
      }

      > .example {
        margin-top: 20px;
        width: 100%;
        object-fit: contain;
        @media ${MEDIA_DESKTOP} {
          width: 480px;
          margin-top: 0;
        }
      }

      > .hand {
        width: 100%;
        object-fit: contain;

        &:last-child {
          margin-top: 12px;
        }
        @media ${MEDIA_DESKTOP} {
          width: 480px;
          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

`
const Ranking = () => {
  return <DefaultWrapper>
    <div className='inner'>
      <div className='description'>
        텍사스 홀덤 사용법 및 메뉴얼이라 불리우는 족보가 있습니다.
      </div>
      <div className='title'>
        1. 족보
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            1) 로얄플러시 (Royal flush)
          </div>
          <div className='description'>
            카드문양이 동일한 5장의 카드가 10,J,Q,K,A의 숫자로 이루어진 패.<br/>홀덤게임에서 가장 강한 족보임으로 게임을 참여하는 플레이어 평생의 게임 중 한번도 얻기 어려운 확률의 족보
            구성입니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20146.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            2) 스트레이트 플러쉬 (Straight flush)
          </div>
          <div className='description'>
            카드문양이 같은 5장의 카드가 숫자로 이루어진 패. 동일한 문양의 이어지는 숫자가 5장의 카드로 이루어진 홀덤의
            상위족보입니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            3) 포 카드 (Four card)
          </div>
          <div className='description'>
            5장의 구성 카드 중 동일한 숫자로 4장의 카드가 이루어진 패. 동일한 포 카드 상황에서는 에이스로 이루어진 포카드가 가장 강한패이며, 숫자 2로 구성된 포 카드가 가장 약한 패 입니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-1.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            4) 풀 하우스 (Full house)
          </div>
          <div className='description'>
            5장의 구성의 카드 중 동일한 카드의 숫자가 3장으로 가득찬 패. 동일한 풀 하우스 상황에서는 트리플을 구성한 숫자 중 높은
            플레이어가 승리합니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-2.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            5) 플러쉬 (Flush)
          </div>
          <div className='description'>
            동일한 문양을 가진 5장의 카드 패.
            플레이어가 승리합니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-3.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            6) 스트레이트 (Straight)
          </div>
          <div className='description'>
            카드의 숫자가 연속되어 5장의 카드로 나열된 패.<br/>동일한 스트레이트 상황에서는 A,K,Q,J,10으로 이루어진
            (로열 스트레이트)의 구성이 가장 강하며,이것을 A탑이라 칭합니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-4.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            7) 트리플 (Triple)
          </div>
          <div className='description'>
            5장의 카드 구성 중 동일한 숫자의 카드가 3장일 경우의 패.<br/>동일한 트리플 상황에서는 트리플을 구성하는 숫자 중 가장 높은 숫자를 가진 플레이어가 승리합니다. A 트리플이 가장 강하고
            2
            트리플이 가장 약합니다. 같은 7트리플인 상황에는 나머지 2장의 카드 중 숫자가 높은 플레이어가 이깁니다. 하지만 5장의 카드의 숫자가 모두 동일 할 경우 게임은 무승부가 됩니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-5.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            8) 투페어 (Two Pair)
          </div>
          <div className='description'>
            5장의 카드 중 동일한 숫자의 구성이 2장 2장인 경우의 패.<br/>동일한 투페어 인 상황은 탑 페어가 더 높은 플레이어가 이기게 됩니다. 탑 페어가 동일한 경우, 작은 페어가 큰 사람이
            승리합니다.<br/>탑
            페어와 작은 페어가 동일한 경우, 다음 숫자가 큰 플레이어가 이깁니다. 5장의 카드 숫자 역시 모두 동일한 경우 게임은 무승부로 판결됩니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-6.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            9) 원페어 (One Pair)
          </div>
          <div className='description'>
            5장의 카드의 구성 중 같은 카드가 2장인 경우의 패.<br/>두명의 플레이어가 모두 원페어인 상황에는 페어의 숫자가 더 높은 플레이어가 승리하게 됩니다. 동일한 원 페어를 가진 경우, 다음 큰
            숫자를
            차례대로 비교하여 승패를 결정 짓습니다. 하지만 5장의 모든 카드의 숫자가 동일한 경우 무승부로 종료됩니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-7.png'/>
      </div>
      <div className='box'>
        <div className='info-wrapper'>
          <div className='title'>
            10) 하이카드 (High Card)
          </div>
          <div className='description'>
            5장의 카드 중 페어가 존재하지 않는 패의 구성.<br/>가장 큰 숫자를 소유한 플레이어가 이기게 됩니다. 탑 숫자가 동일하다면 나머지의 카드 그리고 숫자의 크기로 승부합니다.<br/>하지만
            5장의
            카드 숫자가 모두 동일 시 이 또한 무승부로 처리가 됩니다.
          </div>
        </div>
        <img className='example' src='/image-web/guide/image%20147-8.png'/>
      </div>
      <div className='title'>
        2. 핸드랭킹
      </div>
      <div className='box'>
        <img src='/image-web/guide/hand_1.png' className='hand'/>
        <img src='/image-web/guide/hand_2.png' className='hand'/>
      </div>
    </div>
  </DefaultWrapper>
}

export default Ranking;
