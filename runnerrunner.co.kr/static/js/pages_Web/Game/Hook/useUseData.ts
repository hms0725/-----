import useUserInfo from "../../../../hooks/useUserInfo";
import { useState, useEffect } from "react";
import {
  getUserTicketInfo,
  UserTicketInfoInterface,
} from "../../../../api/game";

export const useUserData = () => {
  const { user, setUser, refreshUser } = useUserInfo(true);
  const [userTicketInfo, setUserTicketInfo] =
    useState<UserTicketInfoInterface | null>(null);
  const getUserTicket = () => {
    if (user) {
      getUserTicketInfo({ userId: user.id })
        .then((res) => setUserTicketInfo(res.data))
        .catch((e) => {});
    }
  };
  useEffect(() => {
    getUserTicket();
  }, [user, user?.id]);

  return { user, setUser, refreshUser, userTicketInfo, getUserTicket };
};
