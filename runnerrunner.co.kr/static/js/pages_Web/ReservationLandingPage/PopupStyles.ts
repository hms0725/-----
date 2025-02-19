import styled from "styled-components";

export const DialogWrapper = styled.div`
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;

export const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: calc(100% - 80px);
  left: 40px;
  max-width: 400px;
`;

export const Title = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  line-height: 22.4px;
  text-align: left;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.label`
  flex: 1;
  color: var(--Black-300, rgba(128, 128, 128, 1));
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 500;
  line-height: 11.93px;
  text-align: left;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 4;
  height: 30px;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.32px;
  text-align: left;
`;

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const SubmitButton = styled.button`
  background: var(--Purple-300, rgba(100, 54, 231, 1));
  padding: 15px;
  color: white;
  border: none;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
`;

export const CloseButton = styled.div``;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
