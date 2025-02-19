import React, { useEffect, useState } from "react";
import {
  ReservationStatusPopupProps,
  Reservation,
} from "./ReservationStatusPopup.types";
import {
  ModalOverlay,
  ModalContent,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  CloseButton,
} from "./ReservationStatusPopup.styles";
import Pagination from "../../../components/web/Pagination";
import { getCurrentReservations } from "../../../api/revervation";

const ITEMS_PER_PAGE = 10;

const ReservationStatusPopup: React.FC<ReservationStatusPopupProps> = ({
  id,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pageList, setPageList] = useState<Reservation[]>([]);
  useEffect(() => {
    if (id) {
      getCurrentReservations(id).then((response) => {
        setTotalReservations(response.length);
        setCurrentPage(1);
        setTotalPages(Math.floor(response.length / ITEMS_PER_PAGE) + 1);
        setReservations(
          response.map((item, index) => {
            return {
              id: response.length - index + "",
              customerName: item.nickname,
            };
          })
        );
      });
    }
  }, [id]);

  useEffect(() => {
    setPageList(
      reservations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  }, [reservations, currentPage]);
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>예약 현황({totalReservations}명)</Title>
        <Table>
          <thead>
            <tr>
              <TableHeader>NO.</TableHeader>
              <TableHeader>닉네임</TableHeader>
            </tr>
          </thead>
          <tbody>
            {pageList.map((reservation: Reservation, index: number) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.customerName}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          size={22}
        ></Pagination>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReservationStatusPopup;
