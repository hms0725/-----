import styled from "styled-components";
import {useHistory, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import PlayGuide from "./PlayGuide";
import Ranking from "./Ranking";
import Word from "./Word";
import {MEDIA_DESKTOP} from "../../../hooks/useScreenOrientation";

const HoldemGuideWrapper = styled.div<{ scrollLock: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  height: 100svh;
overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 108px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${p => p.scrollLock ? `
      overflow-y: hidden;
  ` : `
    overflow-y: scroll;
  `}
  @media ${MEDIA_DESKTOP}{
    position: static;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 1060px;
    padding-top: 30px;
  }
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
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
    justify-content: flex-start;
    padding: 0 20px;
    z-index: 11;
    background: white;
    gap: 8px;
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
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
`
const InfoMenuWrapper = styled.div`
  position: fixed;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  background: white;
  padding: 12px 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  height: 60px;
  z-index: 101;
  @media ${MEDIA_DESKTOP} {
    max-width: unset;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    box-shadow: unset;
    justify-content: flex-start;
    gap: 24px;
    margin-top: 30px;
    padding: 0;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #F0F0F0;
      z-index: -1;
    }
  }

  > .item {
    cursor: pointer;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP}{
      padding-bottom: 16px;
      border-bottom: 2px solid transparent;
    }
  }

  > .item.selected {
    color: var(--Black-400, #444);
    @media ${MEDIA_DESKTOP}{
      border-bottom: 2px solid #444;
    }
  }
`

interface HoldemGuideProps {
  onClose?: () => void;
}

type InfoMenuType = 'play' | 'rank' | 'word'

const HoldemGuide = ({onClose}: HoldemGuideProps) => {
  const history = useHistory();
  const param = useParams()
  const [infoMenu, setInfoMenu] = useState<InfoMenuType>('play');
    const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (history.length > 1){
        history.goBack();
      }else{
        history.push('/')
      }
    }
  }

  return <>
    <HoldemGuideWrapper scrollLock={true}>
      <div className='header'>
        <div className="close" onClick={handleClose}>
          <img src="/image-web/Icon/Back.svg" alt="close"/>
        </div>
        <div className="title">홀덤 가이드</div>
      </div>
      <InfoMenuWrapper>
        <div
          onClick={() => setInfoMenu('play')}
          className={'item ' + (infoMenu === 'play' ? 'selected' : '')}>
          플레이 방법
          <div className='line'/>
        </div>
        <div
          onClick={() => setInfoMenu('rank')}
          className={'item ' + (infoMenu === 'rank' ? 'selected' : '')}>
          족보 & 핸드랭킹
          <div className='line'/>
        </div>
        <div
          onClick={() => setInfoMenu('word')}
          className={'item ' + (infoMenu === 'word' ? 'selected' : '')}>
          텍사스 홀덤 용어
          <div className='line'/>
        </div>
      </InfoMenuWrapper>
      <div className='inner'>
        {
          infoMenu === 'play' && <PlayGuide/>
        }
        {
          infoMenu === 'rank' && <Ranking/>
        }
        {
          infoMenu === 'word' && <Word/>
        }
      </div>
    </HoldemGuideWrapper>
  </>
}
export default HoldemGuide;
