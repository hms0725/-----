import styled from "styled-components";

export const ReservationContainer = styled.div`
  position: relative;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  > .title {
    margin: 20px 16px;
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 700;
    line-height: 23.87px;
    text-align: left;
  }
`;

export const ReservationHeader = styled.div`
z-index: 101;
  transition: all 0.1s ease-in-out;
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
  gap: 8px;

  .close {
    cursor: pointer;
    width: 24px;
    height: 24px;

    svg path {
      stroke: var(--Black-400, #444);
    }
  }

  .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 600;
  }`

export const TournamentImageWrapper = styled.div`
  position: relative;
  top: 0px;
  width: 100%;
`;

export const TournamentImage = styled.img`
  position: relative;
  top: 0px;
  width: 100%;
`;

export const Container = styled.div`
  position: relative;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
`;

export const PubContainer = styled.div`
  position: relative;
  background: #f0f0f0;
  border-radius: 8px;
  margin-left: 16px;
  padding: 20px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  max-width: 400px;
  .row {
    display: flex;
    flex-direction: row;
  }
`;

export const ValueLabel = styled.label`
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 400;
  line-height: 20.8px;
  letter-spacing: -0.02em;
  text-align: left;

  flex: 3;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 50px 16px;
`;

export const ReservationInfoButton = styled.button`
  padding: 0.75rem;
  background: rgba(240, 240, 240, 1);
  color: black;
  border: none;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
`;

export const ReservationButton = styled.button`
  padding: 0.75rem;
  background: var(--Purple-300, rgba(100, 54, 231, 1));
  color: white;
  border: none;
  border-radius: 8px;
  flex: 2;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
`;

export const Label = styled.label`
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 600;
  line-height: 20.8px;
  letter-spacing: -0.02em;
  text-align: left;

  flex: 1;
`;
export const WarningWrapper = styled.div`
  margin: 5px 16px;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #8c8a8a;
`;

export const FloatButton = styled.div`
  position: absolute;
  right: 16px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
