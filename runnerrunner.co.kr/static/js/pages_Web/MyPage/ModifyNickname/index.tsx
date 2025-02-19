import styled from "styled-components";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useCallback, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { enqueueSnackbar } from "notistack";
import { editNickname } from "../../../../api/auth";

const EditNicknameWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 11;
  background: white;
  transition: all 0.5s ease-in-out;

  > .header {
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
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;

const EditContent = styled.div`
  margin: 68px 24px 0;

  > .title {
    font-family: Pretendard;
    font-size: 24px;
    font-weight: 600;
    text-align: left;
    color: var(--Black-500, #202020);
    margin-bottom: 32px;
  }
`;

const EditNicknameInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  > input {
    border: none;
    border-bottom: 2px solid var(--Black-200, #b7b7b7);
    padding: 10.5px 5px;
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
  }

  > input:focus {
    border: none;
    border-bottom: 2px solid var(--Purple-300, #6436e7);
    outline: none;
  }

  > input::placeholder {
    color: var(--Black-200, #b7b7b7);
  }

  > .info {
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 500;
    color: #b7b7b7;
  }
`;
const EditNicknameButton = styled.div<{ isEnd: boolean }>`
  background: var(--Purple-300, #6436e7);
  opacity: ${(prop) => (prop.isEnd ? "1" : "0.3")};
  color: #fff;
  height: 56px;
  line-height: 56px;
  text-align: center;
  border-radius: 8px;
  margin-top: 30px;
`;

export interface UserData {
  id?: string;
  password?: string;
  nickname?: string;
  verification?: string | null;
  referral?: string;
  marketingAgreement?: boolean;
}

interface SignupProps {
  onClose: () => void;
  refreshUser: () => void;
}

const ModifyNickname = ({ onClose, refreshUser }: SignupProps) => {
  const { user } = useUserInfo(true);
  const [newNickname, setNewNickname] = useState<string>("");
  const currentNickname = user?.nickname;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const handleNickname = async () => {
    if (!user || newNickname === "") return;

    if (newNickname.length > 7) {
      enqueueSnackbar("닉네임은 7글자 이내로 입력해주세요.", {
        variant: "error",
      });
      return;
    }
    if (newNickname.length < 2) {
      enqueueSnackbar("닉네임은 2글자 이상으로 입력해주세요.", {
        variant: "error",
      });
      return;
    }
    if (specialCharRegex.test(newNickname)) {
      enqueueSnackbar("닉네임에는 특수문자를 사용할 수 없습니다.", {
        variant: "error",
      });
      return;
    }

    if (/\s/.test(newNickname)) {
      enqueueSnackbar("닉네임에는 띄어쓰기를 사용할 수 없습니다.", {
        variant: "error",
      });
      return;
    }

    if (newNickname === currentNickname) {
      enqueueSnackbar("기존 닉네임과 동일한 닉네임입니다. ", {
        variant: "error",
      });
      return;
    }

    try {
      const res = await editNickname({ nickname: newNickname });
      await refreshUser();
      onClose();
      enqueueSnackbar("닉네임 변경이 완료되었습니다. ", { variant: "success" });
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
      return;
    }
  };

  return (
    <EditNicknameWrapper>
      <div className="header">
        <img
          className="close"
          src="/image-web/Icon/Back.svg"
          onClick={onClose}
          alt="close"
        />
        <div className="title">닉네임 변경</div>
      </div>
      <EditContent>
        <div className="title">
          변경할 닉네임을 <br /> 입력해주세요
        </div>
        <EditNicknameInput>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => {
              setNewNickname(e.target.value);
            }}
            placeholder="닉네임 입력(최대 7글자)"
          />
          <div className="info">현재 닉네임: {currentNickname}</div>
        </EditNicknameInput>
        <EditNicknameButton
          isEnd={newNickname !== ""}
          onClick={() => handleNickname()}
        >
          변경하기
        </EditNicknameButton>
      </EditContent>
    </EditNicknameWrapper>
  );
};

export default ModifyNickname;
