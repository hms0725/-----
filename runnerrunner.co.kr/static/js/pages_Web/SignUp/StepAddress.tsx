import styled from "styled-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserData } from "./index";
import useCities from "../../../hooks/useCities";
import { Area, areaCities, areaCitiesWithCafeCount } from "../../../api/area";
import LocationSelect from "./LocationSelect";
import { enqueueSnackbar } from "notistack";

interface StepWrapperProps {
  $canNext: boolean;
}

const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  height: 100%;
  padding: 20px 24px;
  background: white;
  display: flex;
  flex-direction: column;

  > .title {
    margin-top: 28px;
    color: ${(p) => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
  }

  > .sub-title {
    margin-top: 12px;
    color: ${(p) => p.theme.color.black300};
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .character-section {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    gap: 16px;

    > .character-card {
      width: 100px;
      height: 120px;
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      &.selected {
        background: ${(p) => p.theme.color.purple300};
      }

      > img {
        width: 76px;
        height: 76px;
        border-radius: 50%;
      }

      > span {
        margin-top: 8px;
        color: ${(p) => p.theme.color.black500};
        font-family: Pretendard;
        font-size: 14px;
        font-weight: 500;

        &.selected {
          color: white;
        }
      }
    }
  }

  > .location-section {
    margin-top: 30px;
    > .location-title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin-bottom: 18px;
    }
    > .location-dropdowns {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }

  > .confirm-button {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px 24px;
    background: white;

    > button {
      width: 100%;
      height: 56px;
      border-radius: 8px;
      background: ${(p) => p.theme.color.purple300};
      color: white;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      opacity: ${(p) => (p.$canNext ? 1 : 0.3)};
      pointer-events: ${(p) => (p.$canNext ? "auto" : "none")};
    }
  }
`;

const characters = [
  { id: "ROLE_USER", name: "일반", image: "/image-web/signup/normal.png" },
  { id: "ROLE_DEALER", name: "딜러", image: "/image-web/signup/dealer.png" },
  { id: "ROLE_SELLER", name: "점주", image: "/image-web/signup/owner.png" },
];

interface StepProps {
  onNext: (data: Omit<UserData, "ROLE_USER"> & { role: string }) => void;
}

const StepAddress = ({ onNext }: StepProps) => {
  const { provinces } = useCities();
  const [selectedProvince, setSelectedProvince] = useState<Area>();
  const [selectedCity, setSelectedCity] = useState<Area>();
  const [selectedCharacter, setSelectedCharacter] = useState("ROLE_USER");
  const [cities, setCities] = useState<Area[]>([]);

  useEffect(() => {
    if (selectedProvince) {
      areaCities({ id: selectedProvince.id })
        .then(setCities)
        .catch(console.error);
    }
  }, [selectedProvince]);

  const canNext = useMemo(() => {
    return (
      selectedProvince != null &&
      selectedCity != null &&
      selectedCharacter != null
    );
  }, [selectedCity, selectedProvince, selectedCharacter]);

  const handleNext = useCallback(() => {
    const data = {
      areaProvinceId: selectedProvince?.id,
      areaCityId: selectedCity?.id,
      role: selectedCharacter,
    };
    enqueueSnackbar(selectedCharacter);
    onNext(data);
  }, [onNext, selectedProvince, selectedCity, selectedCharacter]);

  const handleProvinceChange = (province: Area) => {
    setSelectedProvince(province);
    setSelectedCity(undefined);
  };

  return (
    <StepWrapper $canNext={canNext}>
      <div className="title">
        활동 하시는
        <br />
        지역을 선택해주세요.
      </div>
      <div className="sub-title">한 번 정한 뒤에는 수정이 불가합니다.</div>

      <div className="character-section">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`character-card ${
              selectedCharacter === char.id ? "selected" : ""
            }`}
            onClick={() => setSelectedCharacter(char.id)}
          >
            <img src={char.image} alt={char.name} />
            <span className={selectedCharacter === char.id ? "selected" : ""}>
              {char.name}
            </span>
          </div>
        ))}
      </div>

      <div className="location-section">
        <div className="location-title">지역정보</div>
        <div className="location-dropdowns">
          <LocationSelect
            label="province"
            options={provinces}
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="시/도"
          />
          <LocationSelect
            label="city"
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="구/군"
          />
        </div>
      </div>

      <div className="confirm-button">
        <button onClick={handleNext}>확인</button>
      </div>
    </StepWrapper>
  );
};

export default StepAddress;
