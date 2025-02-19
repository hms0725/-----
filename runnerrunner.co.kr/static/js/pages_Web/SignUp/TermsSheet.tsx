import Sheet from "react-modal-sheet";
import styled from "styled-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import Agreement, {TermsType} from "../Agreement";
import {enqueueSnackbar} from "notistack";
import useDialog from "../../../hooks/useDialog";


const AgreementModal = styled.div`
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
    width: 100%;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;

    > .horizontal-line {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.color.black100};
    }

    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 12px;

      > .checkbox {
        width: 20px;
        height: 20px;
        flex-shrink: 0;

        > circle {
          transition: all 0.3s;
          fill: ${p => p.theme.color.black200};
        }
      }

      > .checkbox.checked {
        > circle {
          fill: ${p => p.theme.color.purple300};
        }
      }

      > .text {
        flex-grow: 1;
        color: var(--Black-500, #202020);
        text-align: left;
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      > .button {
        padding-top: 2px;
        cursor: pointer;
        flex-shrink: 0;
        color: var(--Black-200, #B7B7B7);
        text-align: right;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.26px;
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

function TermsSheet
({
   show,
   onContinue,
   onClose,
    onError,
 }: {
  show: boolean
  onContinue: (agreements: boolean[]) => void
  onClose: () => void
  onError: () => void
}) {
  const {openDialog} = useDialog();
  const [termsType, setTermsType] = useState<TermsType>(null)
  const [checkedAgreement, setCheckedAgreement] = useState([false, false, false, false, false]);

  const termsTypes = useMemo<{
    type: TermsType,
    label: string
  }[]>(() => [
    {
      type: 'service',
      label: '(필수) 이용약관 동의'
    },
    {
      type: 'privacy',
      label: '(필수) 개인정보 처리방침 약관 동의'
    },
    {
      type: 'location',
      label: '(필수) 위치정보 약관 동의'
    },
    {
      type: 'teenager',
      label: '(필수) 청소년 보호 약관 동의'
    },
    {
      type: 'marketing',
      label: '(선택) 마케팅에 관한 개인정보 수집 및 이용 동의'
    },
  ], []);

  const handleClickAllAgreement = () => {
    const newCheckedAgreement = checkedAgreement.map(() => !checkedAgreement[0])
    setCheckedAgreement(newCheckedAgreement)
  }

  const handleContinue = useCallback(() => {
    for (let i in checkedAgreement) {
      if (termsTypes[i].label.includes('필수') && !checkedAgreement[i]) {
        onError();
        return;
      }
    }

    setTimeout(() => {
      onContinue([...checkedAgreement].reverse());
    }, 100)
  }, [checkedAgreement]);


  return <Sheet
    id='terms-sheet'
    style={{
      width: '100%',
      maxWidth: 500,
      left: '50%',
      transform: 'translateX(-50%)',
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
        <AgreementModal>
          <div className='title'>
            약관에 동의해주세요
          </div>
          <div className='description'>
            <div className='row' onClick={handleClickAllAgreement}>
              <svg className={'checkbox ' + (checkedAgreement.some(x => !x) ? '' : 'checked')}
                   xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                   fill="none">
                <circle cx="10" cy="10" r="10" fill="#8359F7"/>
                <path d="M6 10L8.96296 12.5L13.6667 7.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
              <div className='text'>
                전부 동의
              </div>
            </div>
            <div className='horizontal-line'/>
            {
              termsTypes.map((item, i) => {
                const handleClickAgreement = () => {
                  const newCheckedAgreement = [...checkedAgreement]
                  newCheckedAgreement[i] = !newCheckedAgreement[i]
                  setCheckedAgreement(newCheckedAgreement)
                }
                return <div className='row' key={i}>
                  <svg onClick={handleClickAgreement} className={'checkbox ' + (checkedAgreement[i] ? 'checked' : '')}
                       xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                       fill="none">
                    <circle cx="10" cy="10" r="10" fill="#8359F7"/>
                    <path d="M6 10L8.96296 12.5L13.6667 7.5" stroke="white" strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                  </svg>
                  <div onClick={handleClickAgreement} className='text'>
                    {item.label}
                  </div>
                  <div className='button' onClick={() => setTermsType(item.type)}>
                    보기
                  </div>
                </div>
              })
            }
          </div>
          <div className='button-row'>
            <div className='button' onClick={handleContinue}>
              회원가입
            </div>
          </div>
        </AgreementModal>
        {
          termsType !== null && (
            <Agreement type={termsType} onClose={() => setTermsType(null)}/>
          )
        }
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop onTap={onClose}/>
  </Sheet>
}

export default TermsSheet;
