import React from "react";
import styled from "styled-components";

interface PubIntroProps {
  icon: string;
  name: string;
  description: string;
}

const PubIntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 10px;
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #6e44ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  overflow: hidden;
`;

const IconImage = styled.img`
  width: 100%;
  height: 100%;
`;
const Name = styled.div`
  margin-top: 10px;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 700;
  line-height: 15.51px;
  letter-spacing: -0.02em;
  text-align: center;
`;

const Description = styled.div`
  margin-top: 4px;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: -0.02em;
  text-align: center;
`;

const PubIntro: React.FC<PubIntroProps> = ({ icon, name, description }) => {
  return (
    <PubIntroWrapper>
      <IconWrapper>
        <IconImage src={icon} alt="icon" />
      </IconWrapper>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </PubIntroWrapper>
  );
};

export default PubIntro;
