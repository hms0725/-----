import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/auth";
import { getReservation } from "../../../api/revervation";
import { cafeDetail } from "../../../api/cafe";
import { Cafe, ReservationResponse } from "../../../api/types";
import {
  Container,
  TournamentImageWrapper,
  PubContainer,
  ReservationContainer,
  ValueLabel,
  ReservationButton,
  ButtonWrapper,
  ReservationInfoButton,
  Label,
  WarningWrapper,
  FloatButton,
  TournamentImage,
  ReservationHeader,
} from "./index.styles";
import ReservationStatusPopup from "./ReservationStatusPopup";
import ReservationPopup from "./ReservationPopup";
import { shareURL } from "../../../utils/common";
import Header from "../StoreDetail/Header";
import { isApp } from "../../../hooks/useNativeApp";
import ImageViewerModal from "../../../components/common/ImageViewerModal";

const ReservationLandingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user] = useRecoilState(userState);
  const history = useHistory();
  const [isReservationPopupOpen, setIsReservationPopupOpen] = useState(false);
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getReservation(id).then((reservation) => {
        setReservation(reservation);
        cafeDetail(reservation.cafeId).then(setCafe);
      });
    }
  }, [id]);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <Container>
      {reservation && (
        <ReservationContainer>
          <ReservationHeader>
            <div className="close" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 19L5 12M5 12L12 5M5 12H19"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="title">
              {cafe?.cafeName ? cafe.cafeName : "예약"}
            </div>
          </ReservationHeader>
          <TournamentImageWrapper>
            <TournamentImage
              alt="토너먼트"
              src={reservation.imageUrl}
              onClick={() => setSelectedImage(reservation.imageUrl)}
            ></TournamentImage>
            <FloatButton
              onClick={() =>
                shareURL(window.location.href, reservation.tournament.title)
              }
            >
              <img src="/image-web/reservation/share_button.svg" alt="To Map" />
            </FloatButton>
          </TournamentImageWrapper>
          <div className="title">{reservation.tournament.title}</div>
          {cafe && (
            <PubContainer>
              <div className="row">
                <Label>매장이름</Label>
                <ValueLabel>{cafe.cafeName}</ValueLabel>
              </div>
              <div className="row">
                <Label>주소</Label>
                <ValueLabel>{cafe.newAddress}</ValueLabel>
              </div>
              <div className="row">
                <Label>매장번호</Label>
                <ValueLabel>{cafe.vcn}</ValueLabel>
              </div>
            </PubContainer>
          )}
          <WarningWrapper>
            ※불가피하게 예약 취소를 원하시는 경우 매장 으로 전화 부탁 드립니다.
          </WarningWrapper>
          <ButtonWrapper>
            <ReservationInfoButton onClick={() => setIsStatusPopupOpen(true)}>
              예약현황
            </ReservationInfoButton>
            <ReservationButton onClick={() => setIsReservationPopupOpen(true)}>
              토너먼트 예약하기
            </ReservationButton>
          </ButtonWrapper>
        </ReservationContainer>
      )}

      <ReservationStatusPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        id={id}
      />
      <ReservationPopup
        isOpen={isReservationPopupOpen}
        onClose={() => setIsReservationPopupOpen(false)}
        reservationId={id || ""}
        userId={user?.id}
      />
      <ImageViewerModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      ></ImageViewerModal>
    </Container>
  );
};

export default ReservationLandingPage;
