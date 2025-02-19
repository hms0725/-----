import { useState, useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import { Cafe } from "../../api/types";
import { cafeDetail, cafeTournament } from "../../api/cafe";

export const useStoreData = (initialData: Cafe) => {
  const [data, setData] = useState<Cafe>(initialData);

  const fetchData = useCallback((id: number) => {
    return cafeDetail(id)
      .then((res) => {
        res.reviewData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return cafeTournament(id).then((tournamentResponse) => {
          res.pubTournamentList = tournamentResponse;
          setData(res);
          return res;
        });
      })
      .catch((e: any) => {
        enqueueSnackbar("펍 정보를 가져올 수 없습니다: " + e.message, {
          variant: "error",
        });
        throw e;
      });
  }, []);

  return { data, setData, fetchData };
};
