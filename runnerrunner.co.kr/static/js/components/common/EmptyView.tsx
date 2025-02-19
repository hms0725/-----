import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > img {
    width: 100px;
    margin-bottom: 20px;
    filter: brightness(0);
    opacity: 0.1;
  }

  > div {
    font-size: 16px;
  }
`;

function EmptyView({ children }: { children: any }) {
  return (
    <Wrapper>
      <img src="/image-web/Logo/Runnerrunner (Img).png" />
      <div>{children}</div>
    </Wrapper>
  );
}

export default EmptyView;
