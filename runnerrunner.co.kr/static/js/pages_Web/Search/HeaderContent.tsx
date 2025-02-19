import React from "react";
import { Header, AddressBar, FloatButton } from "./Style/SearchStyles";
import { useUI } from "./Hook/UIContext";
import { useHistory } from "react-router-dom";
import RegisterPreminumPubInfo from "./Components/RegisterPreminumPubInfo";
import LocationSheet from "../../../components/web/LocationSheet";
import PubMore from "./Components/PubMore";

const HeaderContent: React.FC = () => {
  const history = useHistory();
  const {
    showStoreList,
    setShowSearch,
    toggleShowList,
    isScrolled,
    showRegisterPremium,
    setShowRegisterPremium,
  } = useUI();

  const handleBackClick = () => history.goBack();
  const handleFloatButtonClick = () => {
    setShowSearch(false);
    toggleShowList();
  };

  return (
    <>
      {showStoreList && (
        <FloatButton onClick={handleFloatButtonClick} id="to-map">
          <img src="/image-web/search/to-map.svg" alt="To Map" id="to-map" />
        </FloatButton>
      )}
      <Header>
        <AddressBar show={showStoreList} isScrolled={isScrolled}>
          <div className="close" onClick={handleBackClick}>
            <img
              src="/image-web/Icon/Back.svg"
              id="홀덤펍 찾기 뒤로가기"
              alt="close"
            />
          </div>
          <input
            className={`box ${!showStoreList ? "map " : ""}flex`}
            readOnly
            placeholder="홀덤 펍 검색"
            onClick={() => setShowSearch(true)}
          />
        </AddressBar>
      </Header>
      {showRegisterPremium && (
        <RegisterPreminumPubInfo
          onClose={() => setShowRegisterPremium(false)}
        />
      )}
      <LocationSheet />
    </>
  );
};

export default HeaderContent;
