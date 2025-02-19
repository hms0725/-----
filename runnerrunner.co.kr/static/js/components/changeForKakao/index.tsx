import { useState } from "react";
import {
  ChangeForKakaoButton,
  ChangeForKakaoInputLabel,
  ChangeForKakaoInputWrapper,
  ChangeForKakaoOverlay,
  ChangeForKakaoSubTitle,
  ChangeForKakaoTitle,
  ChangeForKakaoWrapper,
} from "./style";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/app";
import { changeForKakaoApi } from "../../api/auth";
import { clearCredential, LOCAL_STORAGE_ACCESS_KEY } from "../../utils/network";
import { enqueueSnackbar } from "notistack";

interface InputBoxProps {
  value: string;
  setValue: (value: string) => void;
  type: string;
  label: string;
}

const ChangeForKakaoInputBox = ({
  value,
  setValue,
  type,
  label,
}: InputBoxProps) => {
  return (
    <ChangeForKakaoInputWrapper>
      <input
        type={type}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={label}
      />
    </ChangeForKakaoInputWrapper>
  );
};

interface ChangeForKakaoProps {
  onClose: () => void;
}

const ChangeForKakao = ({ onClose }: ChangeForKakaoProps) => {
  const [textId, setTextId] = useState("");

  const [isValidId, setIsValidId] = useState(false);

  const setLoading = useSetRecoilState(loadingState);

  const idValidation = (textId: string): boolean => {
    const regex = /^[A-Za-z0-9]{4,15}$/;
    return regex.test(textId);
  };

  const handleIdChange = (value: string) => {
    setTextId(value);
    setIsValidId(idValidation(value));
  };

  const ChangeAccount = async () => {
    setLoading(true);
    try {
      await changeForKakaoApi({ textId });
      setLoading(false);
      enqueueSnackbar("아이디가 변경되었습니다.", { variant: "success" });
      onClose();
    } catch (e: any) {
      setLoading(false);
      if (e.code === 409) {
        setTextId("");
        setIsValidId(false);
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };
  const LabelSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <circle cx="6" cy="6" r="6" fill="#B7B7B7" />
        <path
          d="M4 6L5.77778 7.5L8 4.5"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <>
      <ChangeForKakaoOverlay />
      <ChangeForKakaoWrapper>
        <ChangeForKakaoTitle>
          2025년2월3일 카카오 서비스가 종료되었습니다.
          <br />
          이메일 주소를 제외한 아이디를 입력해 변경해주세요!
        </ChangeForKakaoTitle>
        <ChangeForKakaoSubTitle>
          *기존 카카오 계정의 데이터는 변경된 계정에 그대로 유지됩니다.
        </ChangeForKakaoSubTitle>
        <ChangeForKakaoInputBox
          value={textId}
          setValue={handleIdChange}
          type="text"
          label="아이디"
        />
        <ChangeForKakaoInputLabel success={isValidId}>
          {LabelSvg()}
          <span>영문, 숫자 4~15자리</span>
        </ChangeForKakaoInputLabel>
        <ChangeForKakaoButton
          success={isValidId}
          onClick={async () => {
            if (!isValidId) return;
            await ChangeAccount();
          }}
        >
          확인
        </ChangeForKakaoButton>
      </ChangeForKakaoWrapper>
    </>
  );
};

export default ChangeForKakao;
