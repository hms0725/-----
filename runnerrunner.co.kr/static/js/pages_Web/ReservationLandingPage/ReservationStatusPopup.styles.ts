import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

export const Title = styled.h2`
  text-align: left;
  margin-bottom: 20px;
  color: var(--Black-500, #202020);
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  > thead {
    height: 25px;
    position: relative;
    z-index: 1;
  }
`;
    
export const TableHeader = styled.th`
  font-family: Pretendard;
  background: #DDD1FF;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  
  &:nth-child(1) {
    border-radius: 10px 0 0 10px;
    border-right: 1px solid #fff;
  }

  &:nth-child(2) {
    border-radius: 0 10px 10px 0;
  }
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
`;

export const TableCell = styled.td`
  padding: 0.5rem;
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-weight: 600;
  line-height: 14px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
