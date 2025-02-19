import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";
import { MEDIA_DESKTOP } from '../../hooks/useScreenOrientation';

const AgreementWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 125px);
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  @media ${MEDIA_DESKTOP} {
    top: 125px;
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .content {
      padding: 20px 16px 30px;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 18.2px */
      letter-spacing: -0.26px;
    }
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

    @media ${MEDIA_DESKTOP} {
      position: absolute;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
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
    }
  }
`

export type TermsType = 'service' | 'privacy' | 'location' | 'marketing' | 'teenager' | null

interface AgreementProps {
  type: TermsType
  onClose: () => void;
}

const Agreement = ({
                     type,
                     onClose
                   }: AgreementProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (type === 'service') {
      setTitle('서비스 이용약관');
    } else if (type === 'privacy') {
      setTitle('개인정보처리방침');
    } else if (type === 'location') {
      setTitle('위치정보 이용약관')
    } else if (type === 'teenager') {
      setTitle('청소년보호방침');
    } else if (type === 'marketing') {
      setTitle('개인정보 수집 및 이용');
    }

    axios.get(`/terms/${type}.txt`).then((res) => {
      setContent(res.data.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>'));
    }).catch((e: any) => {
      setContent('약관을 불러오지 못했습니다.')
    })
  }, [type]);

  return <AgreementWrapper>
    <div className="header">
      <div className="close" onClick={onClose}>
        <img src="/image-web/Icon/Close_gray.svg" alt="close"/>
      </div>
      <div className="title">{title || '약관 보기'}</div>
    </div>
    <div className='inner'>
      <div className='content'>
        <span dangerouslySetInnerHTML={{__html: content}}></span>
      </div>
    </div>
  </AgreementWrapper>

}

export default Agreement;
