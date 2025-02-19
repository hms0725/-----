import styled from "styled-components";

const Wrapper = styled.div<{full?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${p => p.full && `
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 9999;
    top: 0;
    left: 0;
  `}
`;

const Loader = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid var(--Purple-300, #6436E7);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Loading({full}: {full?: boolean}) {
  return <Wrapper full={full}>
    <Loader />
  </Wrapper>
}

export default Loading