import { GameType, PubType } from "../api/types";
import { RecruitState, RecruitType } from "../api/job";

export const PubTypeLabels: {
  type: PubType;
  label: string;
}[] = [
  {
    type: "",
    label: "전체",
  },
  {
    type: "AFFILIATE",
    label: "제휴",
  },
  {
    type: "NORMAL",
    label: "일반",
  },
];

export const GameTypeLabels: {
  type: GameType;
  label: string;
}[] = [
  {
    type: "",
    label: "전체",
  },
  {
    type: "TOURNAMENT",
    label: "토너먼트",
  },
  {
    type: "OTHER_GAME",
    label: "기타 게임",
  },
];

export const PubSortTypeLabels: {
  type: string;
  label: string;
}[] = [
  {
    type: "distance",
    label: "거리순",
  },
  {
    type: "buyInHigh",
    label: "바이인 높은 순",
  },
  {
    type: "buyInLow",
    label: "바이인 낮은 순",
  },
  {
    type: "prizeHigh",
    label: "프라이즈 높은 순",
  },
  {
    type: "prizeLow",
    label: "프라이즈 낮은 순",
  },
  {
    type: "reviewCount",
    label: "리뷰많은순",
  },
  {
    type: "like",
    label: "좋아요순",
  },
  {
    type: "score",
    label: "평점순",
  },
];

export const getPubTypeLabel = (type: PubType = "") => {
  return PubTypeLabels.find((x) => x.type === type)?.label || type;
};

export const getGameTypeLabel = (type: GameType = "") => {
  return GameTypeLabels.find((x) => x.type === type)?.label || type;
};

export const getPubSortLabel = (type: string = "") => {
  return PubSortTypeLabels.find((x) => x.type === type)?.label || type;
};

export const getGameTypeString = (gameTypes: GameType[]) => {
  return gameTypes
    .map((type) => {
      if (type === "TOURNAMENT") {
        return "토너먼트";
      } else if (type === "OTHER_GAME") {
        return "기타게임";
      }
    })
    .join(", ");
};

export const getFacilityContent = (
  type: string
): {
  title: string;
  img: string;
} | null => {
  if (type === "WIFI") {
    return {
      title: "와이파이",
      img: "Wifi",
    };
  } else if (type === "COFFEE") {
    return {
      title: "커피제공",
      img: "Coffee",
    };
  } else if (type === "FOOD") {
    return {
      title: "식사제공",
      img: "Food",
    };
  } else if (type === "PARKING") {
    return {
      title: "주차가능",
      img: "Parking",
    };
  } else if (type === "VALET") {
    return {
      title: "발렛파킹",
      img: "Valet",
    };
  } else if (type === "REST_AREA") {
    return {
      title: "휴게실",
      img: "Rest",
    };
  } else if (type === "PICK_UP") {
    return {
      title: "픽업 서비스",
      img: "Pickup",
    };
  } else if (type === "SMOKING") {
    return {
      title: "흡연실",
      img: "Smoking",
    };
  }

  return null;
};

export const RecruitTypeLabels: {
  type: RecruitType;
  label: string;
}[] = [
  {
    type: "",
    label: "전체",
  },
  {
    type: "DEALER",
    label: "딜러",
  },
  {
    type: "PRACTICE_DEALER",
    label: "연습딜러",
  },
  {
    type: "SERVANT",
    label: "서버",
  },
  {
    type: "ETC",
    label: "기타",
  },
];

export const RecruitStateLabels: {
  type: RecruitState;
  label: string;
}[] = [
  {
    type: "",
    label: "전체",
  },
  {
    type: "EMPLOYING",
    label: "채용중",
  },
  {
    type: "DONE",
    label: "채용완료",
  },
];

export const RecruitSortLabels: {
  type: string;
  label: string;
}[] = [
  {
    type: "newest",
    label: "최신순",
  },
  {
    type: "oldest",
    label: "오래된 순",
  },
  {
    type: "nearest",
    label: "가까운 순",
  },
  {
    type: "highNet",
    label: "시급 높은 순",
  },
];

export const MarketSortLabels: {
  index: number;
  label: string;
}[] = [
  {
    index: 4,
    label: "날짜순",
  },
  {
    index: 5,
    label: "거리순",
  },
  {
    index: 1,
    label: "저가순",
  },
  {
    index: 2,
    label: "고가순",
  },
];

export const HoldemNowSortLabels: {
  index: number;
  label: string;
}[] = [
  {
    index: 1,
    label: "최신순",
  },
  {
    index: 2,
    label: "조회순",
  },
];

export const OpenChatLabels: {
  textColor: string;
  backgroundColor: string;
  label: string;
  image: string;
  url: string;
}[] = [
  {
    textColor: "white",
    backgroundColor: "#6436E7",
    label: "서울",
    image: "/image-web/openChat/OpenChat=서울.svg",
    url: "https://open.kakao.com/o/gGnpFqvg",
  },
  {
    textColor: "white",
    backgroundColor: "#A43122",
    label: "경기도",
    image: "/image-web/openChat/OpenChat=경기도.svg",
    url: "https://open.kakao.com/o/gKof0qvg",
  },
  {
    textColor: "white",
    backgroundColor: "#E79F4A",
    label: "인천",
    image: "/image-web/openChat/OpenChat=인천.svg",
    url: "https://open.kakao.com/o/gyzUNqvg",
  },
  {
    textColor: "white",
    backgroundColor: "#4264A1",
    label: "강원도",
    image: "/image-web/openChat/OpenChat=강원도.svg",
    url: "https://open.kakao.com/o/gVYYfLwg",
  },
  {
    textColor: "black",
    backgroundColor: "#F8EBC0",
    label: "전북/전남",
    image: "/image-web/openChat/OpenChat=전라도.svg",
    url: "https://open.kakao.com/o/gK1DFLwg",
  },
  {
    textColor: "white",
    backgroundColor: "#1D3B3C",
    label: "경남/부산",
    image: "/image-web/openChat/OpenChat=경남부산.svg",
    url: "https://open.kakao.com/o/ga9vJJwg",
  },
  {
    textColor: "white",
    backgroundColor: "#99B8B7",
    label: "경북/대구",
    image: "/image-web/openChat/OpenChat=경북대구.svg",
    url: "https://open.kakao.com/o/gWj25Jwg",
  },
  {
    textColor: "white",
    backgroundColor: "#1C6F67",
    label: "충북/충남",
    image: "/image-web/openChat/OpenChat=충청도.svg",
    url: "https://open.kakao.com/o/gRJ20Lwg",
  },
  {
    textColor: "black",
    backgroundColor: "#BFF256",
    label: "대전/세종",
    image: "/image-web/openChat/OpenChat=대전세종.svg",
    url: "https://open.kakao.com/o/gZqPbLwg",
  },
  {
    textColor: "white",
    backgroundColor: "#FF7979",
    label: "제주도",
    image: "/image-web/openChat/OpenChat=제주도.svg",
    url: "https://open.kakao.com/o/guoxYLwg",
  },
];

export const getRecruitTypeLabel = (
  type?: RecruitType,
  etc?: string | null
) => {
  const label = RecruitTypeLabels.find((x) => x.type === type)?.label;
  return label || (etc ? etc : type);
};

export const getRecruitStateLabel = (type?: RecruitState) => {
  return RecruitStateLabels.find((x) => x.type === type)?.label || type;
};

export const getRecruitSortLabel = (type?: string) => {
  return RecruitSortLabels.find((x) => x.type === type)?.label || type;
};

export const getMarketLabel = (index?: number) => {
  return MarketSortLabels.find((x) => x.index === index)?.label || index;
};

export const getHoldemNowLabel = (index?: number) => {
  return HoldemNowSortLabels.find((x) => x.index === index)?.label || index;
};

export const getGenderLabel = (type?: string) => {
  if (type === "MALE") {
    return "남성";
  } else if (type === "FEMALE") {
    return "여성";
  } else if (type === "NO_MATTER") {
    return "무관";
  }

  return "-";
};
