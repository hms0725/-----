import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { isApp } from "../../../hooks/useNativeApp";
import {
  registerReservation,
  TournamentReservationParams,
} from "../../../api/revervation";
import {
  DialogWrapper,
  FormContainer,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  ActionWrapper,
  CloseButton,
  SubmitButton,
  Header,
} from "./PopupStyles";
import { ReservationData } from "./index.types";

interface ReservationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  userId?: number;
}

const ReservationPopup: React.FC<ReservationPopupProps> = ({
  isOpen,
  onClose,
  reservationId,
  userId,
}) => {
  const [formData, setFormData] = useState<ReservationData>({
    nickname: "",
    phoneNumber: "",
    id: reservationId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: TournamentReservationParams = {
      reservationId: reservationId,
      nickName: formData.nickname,
      phoneNumber: formData.phoneNumber,
      userId: userId,
      root: isApp ? "APP" : "WEB",
    };
    try {
      const response = await registerReservation(body);
      onClose();
      enqueueSnackbar(response.message);
    } catch (error: any) {
      onClose();
      enqueueSnackbar(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <DialogWrapper>
      <FormContainer>
        <Header>
          <Title>토너먼트 예약하기</Title>
          <CloseButton onClick={onClose}>
            <img alt="X" src="/image-web/X.svg"></img>
          </CloseButton>
        </Header>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력하세요."
              value={formData.nickname}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <ActionWrapper>
            <SubmitButton type="submit">예약하기</SubmitButton>
          </ActionWrapper>
        </Form>
      </FormContainer>
    </DialogWrapper>
  );
};

export default ReservationPopup;
