import styled from "styled-components";
import {createRef, RefObject, useCallback, useEffect, useRef, useState} from "react";
import holdemWords from "./holdemWord.json";
import useScreenOrientation, {MEDIA_DESKTOP} from "../../../hooks/useScreenOrientation";


const DefaultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
  max-width: 100%;
  padding-left: 72px;
  @media ${MEDIA_DESKTOP} {
    padding-left: 0;
    gap: 30px;
    justify-content: space-between;
  }

  > .index-list {
    position: fixed;
    top: 108px;
    left: 0;
    width: var(--Pro2, 72px);
    height: calc(100vh - 108px);
    flex-shrink: 0;
    background: var(--Black-100, #F0F0F0);
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      position: static;
      height: unset;
      width: unset;
      overflow: unset;
      background: unset;
      top: unset;
    }

    > .inner {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
      padding: 20px 0;
      @media ${MEDIA_DESKTOP} {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }

      > .item {
        cursor: pointer;
        width: 100%;
        height: 36px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        @media ${MEDIA_DESKTOP} {
          width: var(--Pro2, 72px);
          height: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          border: 1px solid var(--Black-200, #B7B7B7);
        }
      }

      > .item.selected {
        background: #FFF;
        @media ${MEDIA_DESKTOP} {
          border-radius: 9px;
          border: 1px solid var(--Purple-200, #8359F7);
          background: var(--Purple-100, #F0EAFF);
          color: var(--Purple-300, #6436E7);
        }
      }
    }

  }

  > .content {
    flex-grow: 1;
    height: 100%;
    max-height: calc(100vh - 108px);
    padding: 20px 16px 0px;
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      max-height: calc(100vh - 252px);
    }

    > .inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 30px;

      > .word-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 30px;

        > .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--Purple-300, #6436E7);
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          border-radius: 8px;
          background: var(--Purple-100, #F0EAFF);
          @media ${MEDIA_DESKTOP} {
            display: none;
          }
        }
      }
    }
  }
`
const WordItemWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;

  > .title {
    width: 100%;
    max-width: 100%;
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 19.6px */
    letter-spacing: -0.28px;
    word-break: keep-all;
    @media ${MEDIA_DESKTOP} {
      font-size: 16px;
    }
  }

  > .description {
    width: 100%;
    max-width: 100%;
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 300;
    line-height: 140%; /* 18.2px */
    letter-spacing: -0.26px;
    word-break: keep-all;
    @media ${MEDIA_DESKTOP} {
      font-size: 14px;
    }
  }
`
const Word = () => {
  const orientation = useScreenOrientation()
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>('A');
  const [scrollRefs, setScrollRefs] = useState<RefObject<HTMLDivElement>[]>(
    Array.from({length: holdemWords.length}, () => createRef())
  );

  useEffect(() => {
    if(orientation === 'portrait'){
      //스크롤에 따라 selected alphabet 변경
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        const handleScroll = () => {
          const scrollTop = scrollElement.scrollTop;
          const target = holdemWords.find((v, i) => {
            if (scrollRefs[i] && scrollRefs[i].current) {
              return scrollTop >= (scrollRefs[i].current!!.offsetTop - 300)
                && (i === holdemWords.length - 1 || scrollTop < scrollRefs[i + 1].current!.offsetTop - 300)
            }
            return false;
          });
          if (target) {
            setSelected(target.alphabet);
          }
          //맨 아래인경우, 맨 마지막 array로 강제 지정
          if (scrollElement.scrollHeight - scrollElement.clientHeight === scrollTop) {
            setSelected(holdemWords[holdemWords.length - 1].alphabet);
          }
        }
        scrollElement.addEventListener('scroll', handleScroll);
        return () => {
          scrollElement.removeEventListener('scroll', handleScroll);
        }
      }
    }
  }, [orientation]);

  const handleClick = (alphabet: string) => {
    if (orientation === 'landscape') {
      setSelected(alphabet);
    } else if (orientation === 'portrait') {
      if (scrollRef.current) {
        //클릭시 해당 알파벳으로 스크롤 이동
        const scrollElement = scrollRef.current;
        const target = scrollRefs[holdemWords.findIndex((v) => v.alphabet === alphabet)]
        if (scrollElement && target && target.current) {
          scrollElement.scrollTo({
            top: target.current.offsetTop - 300,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  return <DefaultWrapper>
    <div className='index-list'>
      <div className='inner'>
        {
          holdemWords.map((v, i) => {
            return <div
              key={i}
              className={'item ' + (selected === v.alphabet ? 'selected' : '')}
              onClick={() => handleClick(v.alphabet)}>
              {v.alphabet}
            </div>
          })
        }
      </div>
    </div>
    <div className='content' ref={scrollRef}>
      <div className='inner'>
        {
          holdemWords.filter(x => {
            if(orientation === 'landscape') {
              return x.alphabet === selected;
            }else{
              return true;
            }
          }).map((holdemWord, i) => {
            return <div className='word-item' ref={scrollRefs[i]}>
              <div key={i} className='main'>
                {holdemWord.alphabet}
              </div>
              {
                holdemWord.wordList.map((word, j) => {
                  return <WordItemWrapper>
                    <div className='title'>{word.word}</div>
                    <div className='description' dangerouslySetInnerHTML={{
                      __html: word.description
                    }}/>
                  </WordItemWrapper>
                })
              }
            </div>
          })
        }
      </div>
    </div>
  </DefaultWrapper>
}

export default Word;
