import styled from "styled-components";
import {useEffect, useState} from "react";
import Agreement from "../Agreement";
import {Faq, getFAQList} from "../../../api/faq";
import {useSetRecoilState} from "recoil";
import {loadingState} from "../../../recoil/app";
import {MEDIA_DESKTOP} from "../../../hooks/useScreenOrientation";

const FAQWrapper = styled.div<{ scrollLock: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  overflow-y: scroll;

  ${p => p.scrollLock ? `
      overflow-y: hidden;
  ` : `
  
  `}
  @media ${MEDIA_DESKTOP}{
    position: static;
    max-width: unset;
    top: unset;
    left: unset;
    padding-top: 0;
    height: unset;
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
    @media ${MEDIA_DESKTOP}{
      position: static;
      bottom: unset;
      right: unset;
      left: unset;
      top: unset;
      transform: unset;
      height: unset;
      padding: 0;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP}{
        display: none;
      }
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${p => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      @media ${MEDIA_DESKTOP}{
        bottom: unset;
        right: unset;
        left: unset;
        top: unset;
        position: static;
        transform: unset;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }

  > .content {
    background: white;
    display: flex;
    flex-direction: column;
    padding: 20px 16px 30px;
    @media ${MEDIA_DESKTOP}{
      margin-top: 20px;
      width: 100%;
      padding: 20px 0;
      border-top: 2px solid #808080;
      border-bottom: 1px solid #f0f0f0;
    }
  }
`


const FAQItemWrapper = styled.div<{ fold: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid var(--Black-100, #F0F0F0);
  padding: 20px 0;
  gap: 12px;
  @media ${MEDIA_DESKTOP}{
    &:last-child {
      border-bottom: none;
    }
  }
  > .wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;

    > .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.32px;
      }

      > .date {
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

    > .fold {
      width: 24px;
      height: 24px;
      object-fit: contain;
      transition: transform 0.1s ease-in-out;
    }

    > .fold.unfold {
      transform: rotate(180deg);
    }
  }

  > .content {
    ${p => p.fold ? `
      display: none;
    ` : `
      width: 100%;
    `}
    padding: 16px;
    border-radius: 8px;
    background: var(--Black-100, #F0F0F0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 18.2px */
    letter-spacing: -0.26px;
  }

  &:first-child {
    padding-top: 0;
  }
`
const FAQItem = ({item, index}:{item: Faq, index: number}) => {
  const [isFold, setIsFold] = useState(true)
  return <FAQItemWrapper onClick={() => setIsFold(!isFold)} fold={isFold}>
    <div className='wrapper'>
      <div className='info'>
        <div className='title'>
          Q{index}. {item.title}
        </div>
        <div className='date'>
          {item.createdAt}
        </div>
      </div>
      <img className={'fold ' + (isFold ? 'unfold' : '')} src='/image-web/customerMenu/Arrow%20down.svg'/>
    </div>
    <div className='content' dangerouslySetInnerHTML={{
      __html: item.description.replace(/\n/g, "<br />")
    }}/>
  </FAQItemWrapper>
}

interface FAQProps {
  onClose: () => void;
}

const FAQ = ({onClose}: FAQProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const [faqList, setFAQList] = useState<Faq[]>([])
  useEffect(() => {
    setLoading(true)
    getFAQList().then(res => {
      setFAQList(res)
    }).finally(()=>{
      setLoading(false)
    })
  }, []);
  return <>
    <FAQWrapper scrollLock={false}>
      <div className="header">
        <div className="close" onClick={onClose}>
          <img src="/image-web/Icon/Back.svg" alt="close"/>
        </div>
        <div className="title">자주 묻는 질문</div>
      </div>
      <div className='content'>
        {
          faqList.map((_, index) => <FAQItem key={index} index={index+1} item={_}/>)
        }
      </div>

    </FAQWrapper>
  </>
}

export default FAQ;
