import Sheet from "react-modal-sheet";
import styled from "styled-components";
import useScreenOrientation, { MEDIA_DESKTOP } from '../../hooks/useScreenOrientation';

const InfoModal = styled.div`
  width: 100vw;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  padding: 30px 24px 60px 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px 12px 0px 0px;
  background: #FFF;
  @media ${MEDIA_DESKTOP} {
    max-width: 100%;
  }
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .title {
      color: ${p => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 28px */
    }

    > .content {

      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > .description {
        margin-top: 12px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;

        > div {
          width: 100%;
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 140%; /* 19.6px */
          text-align: left;
        }

        > div.bold {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

      }

      > .prize-wrapper {
        margin-top: 32px;
        padding: 20px 16px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border-radius: 12px;
        border: 1px solid var(--Black-100, #F0F0F0);
        background: #FFF;

        > .title {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        > .prize-list {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 8px;

          > .row {
            padding: 4px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            > .item {
              width: 120px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              color: var(--Black-300, #808080);
              text-align: center;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }

            > .item.header {
              color: var(--Black-200, #B7B7B7);
              text-align: center;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
          }
        }
      }
    }

  }

  > .button-row {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > .button {
      flex: 1;
      height: 48px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: ${p => p.theme.color.purple300};
      color: #FFF;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }

    > .button:active {
      background: #502bb5;
    }

    > .button.cancel {
      color: ${p => p.theme.color.purple300};
      background: none;
    }
  }
`

const StyledSheetBackdrop = styled(Sheet.Backdrop)`
  @media ${MEDIA_DESKTOP} {
    background-color: unset !important;
  }
`;

interface RankingPointSheetProps {
  showRankingSheet: boolean;
  setShowRankingSheet: (show: boolean) => void;

}

const RankingPointSheet = (
  {
    showRankingSheet,
    setShowRankingSheet
  }: RankingPointSheetProps
) => {
  const orientation = useScreenOrientation();
  return <Sheet
    style={{
      width: '100%',
      maxWidth: orientation === 'landscape' ? 1060: 500,
      left: '50%',
      transform: 'translateX(-50%)'
    }} isOpen={showRankingSheet}
    onClose={() => setShowRankingSheet(false)}
    disableDrag={true}
    detent={'content-height'}
  >
    <Sheet.Container style={{
      maxWidth: orientation === 'landscape' ? 1060: 500,
    }}>
      <Sheet.Content>
        <InfoModal>
          <div className='inner'>
            <div className='title'>랭킹 점수 안내</div>
            <div className='content'>
              <div className='description'>
                <div>매일 열리는 토너먼트에서 10등 이내에 들면 아래와 같이 랭킹 점수를 획득하게 됩니다.</div>
                <div className='bold'>랭킹 점수란?</div>
                <div>러너에서 진행되는 모든 토너먼트에서 획득할 수 있는 점수입니다. 랭킹 점수는 순위에 따라 차등으로 지급되고, 분기별로 순위에 따라 다양한 혜택을 제공하려 하고 있습니다.
                </div>
              </div>
              <div className='prize-wrapper'>
                <div className='title'>순위별 보상 지급표</div>
                <div className='prize-list'>
                  <div className='row'>
                    <div className='item header'>순위</div>
                    <div className='item header'>랭킹점수</div>
                  </div>
                  {
                    Array.from({length: 10}).map((_, index) => {
                      return <div className='row' key={index}>
                        <div className='item'>{index + 1}위</div>
                        <div className='item'>{10 - index}</div>
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='button-row'>
            <div className='button' onClick={() => setShowRankingSheet(false)}>확인</div>
          </div>
        </InfoModal>
      </Sheet.Content>
    </Sheet.Container>
    <StyledSheetBackdrop onTap={() => setShowRankingSheet(false)} />
  </Sheet>
}
export default RankingPointSheet;
