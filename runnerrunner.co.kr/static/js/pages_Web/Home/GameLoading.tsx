import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10000;
  background: black;
  .center-text {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
    color: white;
    .red-text {
      color: red;
    }
  }
  .grac {
    position: absolute;
    top: 0;
    padding: 5px;
    right: 0px;
    display: flex;
    gap: 5px;
    .img-1 {
    }

    .img-1 {
    }
  }
`;

const GameLoading = () => {
  return (
    <Wrapper>
      <div className="grac">
        <img alt="1" className="img-1" src="/image-web/game/grac_1.png"></img>
        <img alt="2" className="img-2" src="/image-web/game/grac_2.png"></img>
      </div>
      <div className="center-text">
        이 게임물은 <span className="red-text">청소년 이용불가</span> 게임물로
        <br />
        <br />
        19세 미만의 청소년은 이용할 수 없습니다.
      </div>
    </Wrapper>
  );
};
export default GameLoading;
