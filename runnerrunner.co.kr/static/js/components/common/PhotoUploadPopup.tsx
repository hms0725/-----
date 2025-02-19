import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

const PhotoUploadPopupWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 101;
  background: black;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `}
  > .inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    object-fit: contain;
  }

  > .floating-button-wrapper {
    background: black;
    position: fixed;
    bottom: 0;
    padding: 30px 24px 48px;
    width: 100%;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);

    > .button {
      cursor: pointer;
      width: 100%;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
      text-align: center;
      padding: 15px 0;
      background: var(--Purple-300, #6436e7);
    }

    > .button:active {
      background: #502bb5;
    }
  }

  > .header {
    top: 0;
    position: fixed;
    width: 100%;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;

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
  }
`;

interface PhotoUploadPopupProps {
  onClose: () => void;
  onSelectedPhoto: (photo: File) => void;
  showPhotoPopup: number;
}

const PhotoUploadPopup = ({
  onClose,
  onSelectedPhoto,
  showPhotoPopup,
}: PhotoUploadPopupProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (showPhotoPopup > 0) {
      setPhoto(null);
      setPreview(null);
      inputRef.current?.click();
    } else {
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [inputRef, showPhotoPopup]);

  const handleSelectedPhoto = () => {
    if (photo) {
      onSelectedPhoto(photo);
    }
  };
  const handleSelectFileCancel = () => {
    onClose();
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (error) => reject(error);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas context not available"));
        }

        const maxWidth = 1280;
        let { width, height } = img;
        console.log(width);
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Image resizing failed"));
          }
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={async (e) => {
          console.log("onChange");
          const file = e.target.files?.[0];
          console.log("file", file);
          if (file) {
            try {
              const resizedFile = await resizeImage(file);
              setPhoto(resizedFile);
              const reader = new FileReader();
              reader.onload = (e) => {
                setPreview(e.target?.result as string);
              };
              reader.readAsDataURL(resizedFile);
            } catch (error) {
              console.error("Error resizing image:", error);
              handleSelectFileCancel();
            }
          } else {
            handleSelectFileCancel();
          }
        }}
      />
      {preview && showPhotoPopup > 0 && (
        <PhotoUploadPopupWrapper scrollLock={false}>
          <div className="header">
            <div className="close" onClick={onClose}>
              <img src="/image-web/Icon/Close.svg" alt="close" />
            </div>
          </div>

          <img src={preview} className="inner" />
          <div className="floating-button-wrapper">
            <div className="button" onClick={handleSelectedPhoto}>
              등록하기
            </div>
          </div>
        </PhotoUploadPopupWrapper>
      )}
    </>
  );
};

export default PhotoUploadPopup;
