import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useDialog from "../../../../hooks/useDialog";
import { enqueueSnackbar } from "notistack";
import { AddReview, RemoveReview, UpdateReview } from "../../../../api/cafe";
import { ReviewDataResponse } from "../../../../api/types";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import PhotoUploadPopup from "../../../../components/common/PhotoUploadPopup";
import { urlToFile } from "../../../../utils/common";
import useUserInfo from "../../../../hooks/useUserInfo";

import StarRating from "../../../../components/StarRating";
import useScreenOrientation, {
  MEDIA_DESKTOP,
} from "../../../../hooks/useScreenOrientation";
import {
  registerMarket,
  RemoveMarket,
  SecondHandMarketResponse,
  UpdateMarket,
} from "../../../../api/second-hand-market";
import {
  Area,
  areaCities,
  areaProvinces,
  areaStreets,
} from "../../../../api/area";

const WriteWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 12;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${MEDIA_DESKTOP} {
    padding: 0;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    border-radius: 12px;
    border: 1px solid black;
    background: #fff;
  }

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `}
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .row {
      padding: 12px 20px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > .photo-upload {
        cursor: pointer;
      }

      > .write-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;

        > .desc {
          color: var(--Black-300, #808080);
          text-align: right;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 16.8px */
          letter-spacing: -0.24px;
        }

        > .button {
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          height: 40px;
          border-radius: 4px;
          background: var(--Purple-300, #6436e7);
          color: #fff;
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        > .button:active {
          background: #502bb5;
        }
        > .button.delete {
          background: rgba(217, 24, 24, 0.1);
          color: #d91818;
        }
      }
    }
  }
  > .pc-title-row {
    border-radius: 12px;
    display: none;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 24px 20px 20px;
    @media ${MEDIA_DESKTOP} {
      display: flex;
    }
    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    > .wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      > .count {
        color: var(--Black-200, #b7b7b7);
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 18.2px */
      }
      > img {
        cursor: pointer;
        width: 24px;
        height: 24px;
      }
    }
  }
  > .header {
    top: 0;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;
    background: white;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      cursor: pointer;
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    > .button:active {
      background: #502bb5;
    }
  }
`;

const ConfirmButtonWrapper = styled.div`
  margin: 16px;
  border-radius: 8px;
  background: var(--Purple-300, #6436e7);
  display: flex;
  width: calc(100% - 32px);
  height: 48px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 48px;
  letter-spacing: -0.165px;
`;
const ImageGrid = styled.div<{ length: number }>`
  width: 100%;
  display: none;
  @media ${MEDIA_DESKTOP} {
    padding: 0 20px;
    ${(p) =>
      p.length > 1
        ? `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  `
        : ``}
    ${(p) =>
      p.length === 3
        ? `
    > img:nth-child(1) {
      grid-column: 1 / -1;
      aspect-ratio: 2 / 1;
    }
  `
        : ``}
  }
  > div {
    width: 100%;
    position: relative;

    > img {
      object-fit: cover;
      aspect-ratio: 1;
      border-radius: 8px;
      background: #e5e5e5;
      width: 100%;
    }
    > .delete-button {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
      border-radius: 15px;
      background: rgba(32, 32, 32, 0.5);
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
`;
const SelectFormStyle = styled.select`
  width: 100%;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.09px;
  text-align: left;

  color: rgba(128, 128, 128, 1);

  border: 1px solid var(--Black-100, rgba(240, 240, 240, 1));

  padding: 10px 12px 10px 12px;
  border-radius: 4px;
`;
const DeleteButton = styled.div`
  cursor: pointer;
  border-radius: 8px;
  background: rgba(217, 24, 24, 0.1);
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d91818;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.165px;
`;
const Box = styled.div<{ pcHide?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  margin: 20px 0;
  gap: 16px;
  background: white;
  @media ${MEDIA_DESKTOP} {
    margin: 0 0 20px;
  }
  ${(p) =>
    p.pcHide
      ? `
  @media ${MEDIA_DESKTOP} {
    display: none;
  }
  `
      : ``}
  &:last-child {
    padding-bottom: 48px;
  }

  > .select-wrapper {
    cursor: pointer;
    position: relative;
    padding: 0px;
    border-radius: 8px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .select {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .arrow {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    > .search-list {
      position: absolute;
      left: 0;
      top: 40px;
      width: 100%;
      max-height: 375px;
      overflow: auto;
      padding: 16px 12px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 3;

      > .item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;

        > .title {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 450;
          line-height: normal;

          > .match {
            color: var(--Purple-300, #6436e7);
          }
        }

        > .address {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }

      > .horizontal-bar {
        width: 100%;
        height: 1px;
        background: var(--Black-100, #f0f0f0);
      }
    }
  }

  > .title-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
    > .title {
      font-family: "Pretendard";
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
    }

    > .count {
      color: var(--Black-200, #b7b7b7);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 18.2px */
    }
  }

  textarea {
    width: 100%;
    resize: none;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 22.4px */
    @media ${MEDIA_DESKTOP} {
      min-height: 94px;
    }
  }
  input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
  > .photo-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;

    > .item {
      cursor: pointer;
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #d0d0d0;

      > .plus {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        filter: brightness(0.85);
      }

      > .photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      > .remove {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        width: 100%;
        padding: 4px 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 0px 0px 4px 4px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
`;

interface WritePageProps {
  onClose: () => void;
  mode: "write" | "edit";
  marketData?: SecondHandMarketResponse;
}

const WriteMarket: React.FC<WritePageProps> = ({
  mode,
  onClose,
  marketData,
}) => {
  const orientation = useScreenOrientation();
  const history = useHistory();
  const { user } = useUserInfo();
  const setLoading = useSetRecoilState(loadingState);

  const { openDialog } = useDialog();
  const [showPhotoUploadPopup, setShowPhotoUploadPopup] = useState(-1);
  const [contentCount, setContentCount] = useState(0);
  const [titleCount, setTitleCount] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [areaProvince, setAreaProvince] = useState<Area | null>(null);
  const [areaCity, setAreaCity] = useState<Area | null>(null);
  const [areaStreet, setAreaStreet] = useState<Area | null>(null);

  const [areaProvinceList, setAreaProvinceList] = useState<Area[]>([]);
  const [areaCityList, setAreaCityList] = useState<Area[]>([]);
  const [areaStreetList, setAreaStreetList] = useState<Area[]>([]);

  const editSetting = async () => {
    if (mode === "edit" && marketData) {
      setLoading(true);
      areaProvinces().then((res) => {
        const item: any = res?.find(
          (option: any) => option.id === marketData.areaProvinceId
        );
        setAreaProvince(item);
        setAreaProvinceList(res);
        areaCities({ id: item.id }).then((res) => {
          const item: any = res?.find(
            (option: any) => option.id === marketData.areaCityId
          );
          setAreaCity(item);
          setAreaCityList(res);
          areaStreets({ id: item.id }).then((res) => {
            const item: any = res?.find(
              (option: any) => option.id === marketData.areaStreetId
            );
            setAreaStreet(item);
            setAreaStreetList(res);
          });
        });
      });
      setContentCount(marketData.message.length);

      setTitleCount(marketData.title.length);
      if (marketData.imageList) {
        // URL에서 데이터를 가져와 File 객체로 만들어야 함
        const images: File[] = [];
        for (let url of marketData.imageList) {
          const file = await urlToFile(url, `coverImage.jpg`);
          images.push(file);
        }
        setImageFiles(images);
      }
      setLoading(false);
    } else {
      const res = await areaProvinces();
      setAreaProvinceList(res);
    }
  };
  useEffect(() => {
    editSetting();
  }, []);

  const getCities = async (item: Area, select?: boolean) => {
    const res = await areaCities(item);
    if (res) {
      setAreaCityList(res);
    }
    setAreaCity(null);
    if (item.id === 8 && res[0]) {
      const res_street = await areaStreets(res[0]);
      if (res_street) {
        setAreaStreetList(res_street);
      }
    }
  };

  const getStreet = async (item: Area, select?: boolean) => {
    const res = await areaStreets(item);
    if (res) {
      setAreaStreetList(res);
    }
  };

  const handleWrite = () => {
    const title = document.getElementById("title") as HTMLInputElement;
    if (title.value.length < 3) {
      alert("최소 3자 이상 입력해주세요.");
      return;
    }
    const content = document.getElementById("content") as HTMLTextAreaElement;
    if (content.value.length < 5) {
      alert("최소 5자 이상 입력해주세요.");
      return;
    }
    const price = document.getElementById("price") as HTMLInputElement;
    const priceValue = price.value.replace(/,/g, "");
    if (parseInt(priceValue) === 0 || !priceValue) {
      alert("가격을 입력해주세요.");
      return;
    }

    if (!areaCity || !areaProvince || !areaStreet) {
      alert("지역을 선택해주세요.");
      return;
    }

    if (imageFiles.length === 0) {
      alert("사진 최소 1장을 첨부해주세요.");
      return;
    }
    setLoading(true);
    const data = {
      title: title.value,
      message: content.value,
      price: parseInt(priceValue), // 쉼표가 제거된 값 사용
      areaProvinceId: areaProvince.id,
      areaCityId: areaCity.id,
      areaStreetId: areaStreet.id,
    };

    const promise = registerMarket(data, imageFiles);

    promise
      .then(() => {
        enqueueSnackbar("상품이 등록되었습니다.", { variant: "success" });
        onClose();
      })
      .catch((e) => {
        enqueueSnackbar(e.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = () => {
    openDialog({
      text: "해당 글을 수정하시겠습니까?",
      confirm: true,
      confirmText: "수정하기",
      type: "web",
      onConfirm: () => {
        if (!marketData) {
          return;
        }
        const title = document.getElementById("title") as HTMLInputElement;
        if (title.value.length < 3) {
          alert("최소 3자 이상 입력해주세요.");
          return;
        }
        const content = document.getElementById(
          "content"
        ) as HTMLTextAreaElement;
        if (content.value.length < 5) {
          alert("최소 5자 이상 입력해주세요.");
          return;
        }
        const price = document.getElementById("price") as HTMLInputElement;
        const priceValue = price.value.replace(/,/g, "");
        if (parseInt(priceValue) === 0 || !priceValue) {
          alert("가격을 입력해주세요.");
          return;
        }
        if (!areaCity || !areaProvince || !areaStreet) {
          alert("지역을 선택해주세요.");
          return;
        }

        if (imageFiles.length === 0) {
          alert("사진 최소 1장을 첨부해주세요.");
          return;
        }

        setLoading(true);

        const data = {
          title: title.value,
          message: content.value,
          price: parseInt(priceValue), // 쉼표가 제거된 값 사용
          areaProvinceId: areaProvince.id,
          areaCityId: areaCity.id,
          areaStreetId: areaStreet.id,
          onSale: true,
        };
        const promise = UpdateMarket(marketData.id, data, imageFiles);
        promise
          .then(() => {
            enqueueSnackbar("상품이 수정되었습니다.", {
              variant: "success",
            });
            onClose();
          })
          .catch((e) => {
            enqueueSnackbar(e.message, { variant: "error" });
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const handleDelete = () => {
    if (marketData) {
      openDialog({
        text: "해당 글을 삭제하시겠습니까?",
        confirm: true,
        confirmText: "삭제하기",
        type: "web",
        confirmColor: "#D91818",
        onConfirm: () => {
          setLoading(true);

          let promise = RemoveMarket(marketData.id);
          promise
            .then(() => {
              enqueueSnackbar("판매글이 삭제되었습니다.", {
                variant: "success",
              });
              onClose();
            })
            .catch((e) => {
              enqueueSnackbar(e.message, { variant: "error" });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });
    }
  };

  const handleClickFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.click();
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const fileList = Array.from(files);
        const newUploadImageList = [...imageFiles, ...fileList];
        setImageFiles(newUploadImageList);
      }
    };
  };

  const handleSelectedPhoto = useCallback((file: File) => {
    setImageFiles((p) => [...p, file]);
    setShowPhotoUploadPopup(-1);
  }, []);

  return (
    <>
      <PhotoUploadPopup
        showPhotoPopup={showPhotoUploadPopup}
        onSelectedPhoto={handleSelectedPhoto}
        onClose={() => setShowPhotoUploadPopup(-1)}
      />
      <WriteWrapper scrollLock={false}>
        <div className="pc-title-row">
          <div className="title">
            {mode === "edit" ? "판매글 수정" : "판매글 등록"}
          </div>
          <div className="wrapper">
            <div className="count">{contentCount}/1024</div>
            <img
              className="close"
              src="/image-web/Holdem%20Now/Icon/Close.svg"
              onClick={onClose}
            />
          </div>
        </div>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">
            {mode === "edit" ? "판매글 수정" : "판매글 작성"}
          </div>
        </div>
        <div className="inner">
          <Box pcHide={true}>
            <div className="title-row">
              <div className="title">상품 정보</div>
            </div>
            <div className="photo-row">
              <div
                className="item"
                onClick={() => setShowPhotoUploadPopup(new Date().getTime())}
              >
                <img className="plus" src="/image-web/Plus.svg" alt="plus" />
              </div>
              {imageFiles.map((file, index) => {
                return (
                  <div className="item" key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="photo"
                      className="photo"
                    />
                    <div
                      className="remove"
                      onClick={() => {
                        openDialog({
                          text: "사진을 삭제하시겠습니까?",
                          confirm: true,
                          confirmText: "삭제하기",
                          type: "web",
                          onConfirm: () => {
                            setImageFiles((p) => {
                              const temp = [...p];
                              temp.splice(index, 1);
                              return temp;
                            });
                          },
                        });
                      }}
                    >
                      삭제
                    </div>
                  </div>
                );
              })}
            </div>
          </Box>
          <ImageGrid length={imageFiles.length}>
            {imageFiles.map((file, index) => {
              return (
                <div key={index}>
                  <img
                    className="delete-button"
                    src="/image-web/Holdem Now/Delete.svg"
                    alt="delete"
                    onClick={() => {
                      const newUploadImageList = [...imageFiles];
                      newUploadImageList.splice(index, 1);
                      setImageFiles(newUploadImageList);
                    }}
                  />
                  <img src={URL.createObjectURL(file)} alt="upload" />
                </div>
              );
            })}
          </ImageGrid>
          <Box>
            <input
              id="title"
              name="title"
              className="content"
              placeholder="상품명"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              defaultValue={marketData ? marketData.title : ""}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setTitleCount(target.value.length);
                if (target.value.length > 20) {
                  target.value = target.value.slice(0, 20);
                  setTitleCount(20);
                }
              }}
            />
          </Box>
          <Box style={{ position: "relative" }}>
            <div className="title-row">
              <div className="title">내용</div>
            </div>
            <textarea
              id="content"
              name="content"
              className="content"
              placeholder="불쾌감을 주거나 광고성,음란성 컨텐츠를 포함한 게시물은 제재를 받을 수 있습니다.(최소 5자 이상)"
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingBottom: "30px",
                borderRadius: "8px",
                background: "var(--Black-100, rgba(240, 240, 240, 1))",
              }} // 아래 패딩 추가
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              defaultValue={marketData ? marketData.message : ""}
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setContentCount(target.value.length);
                if (target.value.length > 1024) {
                  target.value = target.value.slice(0, 1024);
                  setContentCount(1024);
                }
              }}
            />
            <div
              className="count"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "30px",
                fontSize: "12px",
                color: "#555",
              }}
            >
              {contentCount}/1024
            </div>
          </Box>
          <Box>
            <div className="title-row">
              <div className="title">가격</div>
            </div>
            <div style={{ position: "relative", width: "100%" }}>
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "16px",
                  color: "#555",
                }}
              >
                ￦
              </span>
              <input
                id="price"
                name="price"
                className="content"
                type="text" // number에서 text로 변경
                placeholder="가격을 입력해주세요."
                style={{ paddingLeft: "30px" }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
                defaultValue={
                  marketData ? marketData.price.toLocaleString() : ""
                } // toLocaleString() 추가
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  // 숫자와 쉼표만 입력 가능하도록
                  const value = target.value.replace(/[^\d]/g, "");
                  if (value) {
                    target.value = parseInt(value).toLocaleString();
                  } else {
                    target.value = "";
                  }
                }}
              />
            </div>
          </Box>

          <Box>
            <div className="title-row">
              <div className="title">지역정보</div>
            </div>
            <div className="select-wrapper">
              <SelectFormStyle
                value={areaProvince?.name}
                name="select"
                onChange={(e) => {
                  const item = areaProvinceList?.find(
                    (option) => option.name === e.target.value
                  );
                  if (item) {
                    setAreaCityList([]);
                    setAreaStreetList([]);
                    setAreaProvince(item);
                    setAreaCity(null);
                    setAreaStreet(null);
                    getCities(item);
                  }
                }}
              >
                <option value="" selected hidden>
                  시/도
                </option>
                {areaProvinceList?.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </SelectFormStyle>
            </div>
            <div className="select-wrapper">
              <SelectFormStyle
                value={areaCity?.name}
                aria-placeholder="시/구"
                name="select"
                onChange={(e) => {
                  const item = areaCityList?.find(
                    (option) => option.name === e.target.value
                  );
                  if (item) {
                    setAreaCity(item);
                    getStreet(item);
                  }
                }}
              >
                <option value="" selected hidden>
                  군/구
                </option>
                {areaCityList?.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </SelectFormStyle>
            </div>
            <div className="select-wrapper" style={{ marginBottom: "14px" }}>
              <SelectFormStyle
                value={areaStreet?.name}
                name="select"
                onChange={(e) => {
                  const item = areaStreetList?.find(
                    (option) => option.name === e.target.value
                  );
                  if (item) {
                    setAreaStreet(item);
                  }
                }}
              >
                <option value="" selected hidden>
                  동
                </option>
                {areaStreetList?.map((item, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </SelectFormStyle>
            </div>
          </Box>
          <ConfirmButtonWrapper
            onClick={() => {
              mode === "write" ? handleWrite() : handleEdit();
            }}
          >
            {mode === "edit" ? "수정" : "판매 등록"}
          </ConfirmButtonWrapper>
          {orientation === "landscape" && (
            <div className="row">
              <div className="photo-upload" onClick={handleClickFileUpload}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 15L17.914 11.914C17.5389 11.5391 17.0303 11.3284 16.5 11.3284C15.9697 11.3284 15.4611 11.5391 15.086 11.914L6 21M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z"
                    stroke="#808080"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="write-wrapper">
                <div
                  className="button delete"
                  id="delete-button"
                  onClick={handleDelete}
                >
                  삭제하기
                </div>
                <div className="button" id="write-button" onClick={handleEdit}>
                  수정하기
                </div>
              </div>
            </div>
          )}
          {orientation === "portrait" && mode === "edit" && (
            <Box>
              <DeleteButton onClick={handleDelete}>삭제하기</DeleteButton>
            </Box>
          )}
        </div>
      </WriteWrapper>
    </>
  );
};

export default WriteMarket;
