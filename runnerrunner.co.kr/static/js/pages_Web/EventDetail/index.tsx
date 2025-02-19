import styled from "styled-components";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {RunnerEvent, runnerEventDetail} from "../../../api/event";
import {enqueueSnackbar} from "notistack";
import {openUrl} from "../../../utils/common";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";

const EventWrapper = styled.div<{
  scrollLock: boolean
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${p => p.scrollLock ? `
      overflow-y: hidden;
  ` : `
     overflow-y: scroll;
  `}
  @media ${MEDIA_DESKTOP} {
    position: static;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 1060px;
    max-height: unset;
    padding-top: unset;
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
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      color: ${p => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
  }
`
const ContentWrapper = styled.div`
  width: 100%;
  padding: 0px 16px 112px;
  

  > .thumbnail {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    @media ${MEDIA_DESKTOP} {
      border-radius: 20px;
    }
    img {
      width: 100%;
      border-radius: 12px;
      @media ${MEDIA_DESKTOP} {
        aspect-ratio: 1060/440;
        border-radius: 20px;
      }
    }
  }

  .button {
    margin-top: 14px;
    width: 100%;
    height: 56px;
    border-radius: 8px;
    background: var(--Purple-300, #6436E7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #FFF;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
  }
  .button.mobile {
    display: flex;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }
  .button.pc {
    display: none;
    @media ${MEDIA_DESKTOP} {
      display: flex;
      margin-top: 0;
      width: 338px;
      flex-shrink: 0;
    }
  }
  
  >.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media ${MEDIA_DESKTOP} {
      gap: 42px;
      justify-content: space-between;
    }
    > .content-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      > .content {
        margin-top: 20px;
        margin-bottom: 10px;
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 19.6px */
      }

      > .detail-container {
        img {
          width: 100%;
        }
      }

    }
  }
`

const EventPage = () => {
  const history = useHistory();
  const params = useParams<{
    id: string
  }>();

  const [data, setData] = useState<RunnerEvent>();

  useEffect(() => {
    if (!params?.id) {
      history.replace('/');
    }

    runnerEventDetail(+params.id).then((res) => {
      setData(res)
    }).catch((e: any) => {
      enqueueSnackbar(e.message, {variant: 'error'});
    });
  }, [params?.id]);

  const handleClose = () => {
    if (history.action === 'PUSH') {
      history.goBack();
    } else {
      history.replace('/');
    }
  }

  const handleJoin = () => {
    if (!data?.link) {
      return;
    }

    openUrl(history, data.link)
  }

  return <>
    <EventWrapper scrollLock={false}>
      <div className="header">
        <div className="close" onClick={handleClose}>
          <img src="/image-web/Icon/Back.svg" alt="close"/>
        </div>
        <div className="title">{data?.title}</div>
      </div>
      <div className='inner'>
        <ContentWrapper>

          <div className='wrapper'>
            <div className='content-wrapper'>


              {data?.detail && (
                <div className='detail-container'>
                  <img src={data?.detail} alt='Event detail' />
                </div>
              )
            }
            </div>
            {
              data?.link && (
                <>
                  <div className='button pc' onClick={handleJoin}>이벤트 참여하기</div>
                  <div className='button mobile' onClick={handleJoin}>이벤트 참여하기</div>
                </>
              )

            }
          </div>

        </ContentWrapper>
      </div>
    </EventWrapper>
  </>
}

export default EventPage;
