import Sheet from "react-modal-sheet";
import styled from "styled-components";


const VerificationModal = styled.div`
  width: 100vw;
  max-width: 480px;
  display: flex;
  padding: 30px 24px 60px 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px 12px 0px 0px;
  background: #FFF;

  > .title {
    color: ${p => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
  }

  > .description {
    margin-top: 12px;
    color: ${p => p.theme.color.black300};
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
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

function CertAskSheet
({
   show,
   onSkip,
   onContinue,
 }: {
  show: boolean
  onSkip: () => void
  onContinue: () => void
}) {
  return <Sheet
    style={{
      width: '100%',
      maxWidth: 500,
      left: '50%',
      transform: 'translateX(-50%)'
    }}
    isOpen={show}
    onClose={() => {
    }}
    disableDrag={true}
    detent={'content-height'}
  >
    <Sheet.Container style={{
      maxWidth: 500,
    }}>
      <Sheet.Content>
        <VerificationModal>
          <div className='title'>
            본인인증을 하시겠어요?
          </div>
          <div className='description'>
            본인인증을 하시면 이벤트 참여를 비롯한
            앱의 여러 기능을 이용할 수 있습니다.<br/>
            추후 마이페이지에서 본인인증이 가능합니다.
          </div>
          <div className='button-row'>
            <div className='button cancel' onClick={() => {
              setTimeout(() => {
                onSkip()
              }, 100)
            }}>
              건너뛰기
            </div>
            <div className='button' onClick={onContinue}>
              본인인증 하기
            </div>
          </div>
        </VerificationModal>
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop onTap={() => {
    }}/>
  </Sheet>
}

export default CertAskSheet;
