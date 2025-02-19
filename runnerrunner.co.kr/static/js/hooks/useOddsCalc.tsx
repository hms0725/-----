// hooks/useOddsCalc.ts

import { useState, useEffect } from "react";
import { TexasHoldem } from "poker-odds-calc";
import { CARD_INFO } from "../dataset";
import { produce } from "immer";
import { useHistory } from "react-router-dom";
interface Percentages {
  [key: string]: string;
}

interface PlayerHand {
  userIndex: number;
  hands: number[];
  win: string;
  draw: string;
  flush?: string;
  fullHouse?: string;
  highCards?: string;
  onePair?: string;
  quads?: string;
  royalFlush?: string;
  straight?: string;
  straightFlush?: string;
  treeOfAKind?: string;
  twoPairs?: string;
}

interface SelectMode {
  type: string;
  index: number;
  player?: number;
}

export const useOddsCalc = () => {
  const [winningRates, setWinningRates] = useState<PlayerHand[]>([]);
  const [flop, setFlop] = useState<number[]>([-1, -1, -1]);
  const [turn, setTurn] = useState<number | null>(null);
  const [river, setRiver] = useState<number | null>(null);
  const [isCardSelect, setIsCardSelect] = useState(false);
  const [selectMode, setSelectMode] = useState<SelectMode | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isIconSelect, setIsIconSelect] = useState<string>("heart");

  useEffect(() => {
    const user = [
      { userIndex: 1, hands: [-1, -1], win: "", draw: "" },
      { userIndex: 2, hands: [-1, -1], win: "", draw: "" },
    ];
    setWinningRates(user);
  }, []);

  const calculate = (players: PlayerHand[]) => {
    const Table = new TexasHoldem();
    const playerIndexMap = new Map();
    let count = 0;

    players.forEach((player, idx) => {
      const playerCards: string[] = [];
      player.hands.forEach((index) => {
        if (index !== -1) {
          playerCards.push(CARD_INFO[index]);
        }
      });
      if (playerCards.length === 2) {
        playerIndexMap.set(count, idx);
        count++;
        Table.addPlayer(playerCards as [string, string]);
      }
    });
    if (count < 2) {
      return;
    }
    Table.boardAction((board: any) => {
      if (!flop.includes(-1)) {
        const boards = [
          ...flop.map((index) => (index !== -1 ? CARD_INFO[index] : "")),
        ];
        board.setFlop(boards);
      }

      if (turn !== null) {
        board.setTurn(CARD_INFO[turn]);
      }

      if (river !== null) {
        board.setRiver(CARD_INFO[river]);
      }
    });

    const Result = Table.calculate();
    setWinningRates(
      produce((draft: PlayerHand[]) => {
        Result.getPlayers().forEach((player, index) => {
          const mappedIndex = playerIndexMap.get(index);
          if (mappedIndex !== undefined) {
            const rawRanks = player.getRawRanks();
            const totalHands = Object.values(rawRanks).reduce(
              (acc, value) => acc + value,
              0
            );

            const percentages: Percentages = {};
            for (const [hand, count] of Object.entries(rawRanks)) {
              percentages[hand] = ((count / totalHands) * 100).toFixed(2) + "%";
            }
            draft[mappedIndex].flush = percentages.FLUSH;
            draft[mappedIndex].fullHouse = percentages.FULL_HOUSE;
            draft[mappedIndex].highCards = percentages.HIGH_CARDS;
            draft[mappedIndex].onePair = percentages.ONE_PAIR;
            draft[mappedIndex].quads = percentages.QUADS;
            draft[mappedIndex].royalFlush = percentages.ROYAL_FLUSH;
            draft[mappedIndex].straight = percentages.STRAIGHT;
            draft[mappedIndex].straightFlush = percentages.STRAIGHT_FLUSH;
            draft[mappedIndex].treeOfAKind = percentages.TREE_OF_A_KIND;
            draft[mappedIndex].twoPairs = percentages.TWO_PAIRS;
            let winPercentage = player
              .getWinsPercentageString()
              .replace("~", "");
            let drawPercentage = player
              .getTiesPercentageString()
              .replace("~", "");
            draft[mappedIndex].win = winPercentage;
            draft[mappedIndex].draw = drawPercentage;
          }
        });
      })
    );
  };

  useEffect(() => {
    calculate(winningRates);
  }, [river, turn, flop]);

  const handleAddPlayer = () => {
    if (winningRates.length >= 9) {
      return;
    }

    setWinningRates(
      produce((draft) => {
        draft.push({
          userIndex: draft.length + 1,
          hands: [-1, -1],
          win: "",
          draw: "",
        });
      })
    );
  };

  const selectPlayerCard = (index: number) => {
    if (!selectMode || selectMode.player === undefined) {
      return;
    }
    const playerIndex = selectMode.player;
    const cardIndex = selectMode.index;
    const currentHand = winningRates[playerIndex].hands;

    if (currentHand[cardIndex] !== -1) {
      setSelectedCards((prev) =>
        prev.filter((card) => card !== currentHand[cardIndex])
      );
    }
    let newWinningRates = produce(winningRates, (draft) => {
      draft[playerIndex].hands[cardIndex] = index;
    });
    setWinningRates(newWinningRates);

    setSelectedCards((prev) => [...prev, index]);

    if (cardIndex === 0) {
      setSelectMode({ ...selectMode, index: 1 });
    } else {
      setSelectMode(null);
      setIsCardSelect(false);
    }

    calculate(newWinningRates);
  };

  const selectFlopCard = (index: number) => {
    if (!selectMode || selectMode.type !== "flop") {
      return;
    }

    if (selectedCards.includes(index)) {
      return;
    }

    const cardIndex = selectMode.index;
    const currentFlop = [...flop];

    let newSelectedCards = [...selectedCards];
    if (currentFlop[cardIndex] !== -1) {
      newSelectedCards = newSelectedCards.filter(
        (card) => card !== currentFlop[cardIndex]
      );
    }

    currentFlop[cardIndex] = index;
    setFlop(currentFlop);

    newSelectedCards.push(index);
    setSelectedCards(newSelectedCards);

    if (cardIndex < 2) {
      setSelectMode({ ...selectMode, index: cardIndex + 1 });
    } else {
      // 플랍 선택이 끝나면 선택 모드를 종료합니다.
      setSelectMode(null);
      setIsCardSelect(false);
    }
  };

  const selectTurnCard = (index: number) => {
    if (!selectMode || selectMode.type !== "turn") {
      return;
    }

    if (turn !== null) {
      setSelectedCards((prev) => prev.filter((card) => card !== turn));
    }

    setTurn(index);
    setSelectedCards((prev) => [...prev, index]);

    // 턴 선택이 끝나면 선택 모드를 종료합니다.
    setSelectMode(null);
    setIsCardSelect(false);
  };

  const selectRiverCard = (index: number) => {
    if (!selectMode) {
      return;
    }

    if (river !== null) {
      setSelectedCards((prev) => prev.filter((card) => card !== river));
    }

    setRiver(index);
    setSelectedCards((prev) => [...prev, index]);

    setSelectMode(null);
    setIsCardSelect(false);
  };

  const handleCardClick = (index: number) => {
    if (selectMode?.type === "player" && selectMode.player !== undefined) {
      selectPlayerCard(index);
    }
    if (selectMode?.type === "flop") {
      selectFlopCard(index);
    }
    if (selectMode?.type === "turn") {
      selectTurnCard(index);
    }
    if (selectMode?.type === "river") {
      selectRiverCard(index);
    }
  };

  const selectCardForPlayer = (playerIndex: number, cardIndex: number) => {
    setSelectMode({
      type: "player",
      index: cardIndex,
      player: playerIndex,
    });

    setIsCardSelect(true);
  };

  const selectCardForFlop = (cardIndex: number) => {
    setSelectMode({
      type: "flop",
      index: cardIndex,
    });
    setIsCardSelect(true);
  };

  const selectCardForTurn = () => {
    if (flop.includes(-1)) {
      alert("플랍을 먼저 선택해주세요.");
      return;
    }
    setSelectMode({
      type: "turn",
      index: 0,
    });
    setIsCardSelect(true);
  };

  const selectCardForRiver = () => {
    if (flop.includes(-1)) {
      alert("플랍을 먼저 선택해주세요.");
      return;
    }
    if (turn === null) {
      alert("턴을 먼저 선택해주세요.");
      return;
    }
    setSelectMode({
      type: "river",
      index: 0,
    });
    setIsCardSelect(true);
  };

  const clear = () => {
    setSelectMode(null);
    setFlop([-1, -1, -1]);
    const user: PlayerHand[] = [
      {
        userIndex: 1,
        hands: [-1, -1],
        win: "",
        draw: "",
      },
      {
        userIndex: 2,
        hands: [-1, -1],
        win: "",
        draw: "",
      },
    ];
    setWinningRates(user);
    setSelectedCards([]);
    setTurn(null);
    setRiver(null);
    setIsCardSelect(false);
  };

  const handleOverlayClick = () => {
    setIsCardSelect(false);
    setSelectMode(null);
  };

  const history = useHistory();

  const handleClose = () => {
    history.push("/");
  };

  return {
    winningRates,
    flop,
    turn,
    river,
    isCardSelect,
    selectMode,
    selectedCards,
    handleAddPlayer,
    handleCardClick,
    selectCardForPlayer,
    selectCardForFlop,
    selectCardForTurn,
    selectCardForRiver,
    clear,
    handleOverlayClick,
    handleClose,
    isIconSelect,
    setIsIconSelect,
  };
};
