import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { uploadArticleImage, uploadBoard } from "../../../../api/article";
import { enqueueSnackbar } from "notistack";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { registerBoard, uploadBoardImage } from "../../../../api/community";

const Wrapper = styled.div`
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  width: 100%;
  height: 48px;
  color: ${(p) => p.theme.color.black400};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  gap: 8px;

  > .close {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }

  > .title {
    flex: 1;
  }

  > .button {
    cursor: pointer;
    color: var(--Black-200, #b7b7b7);
    text-align: right;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.26px;
  }
`;

const Body = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  > .input-title {
    width: 100%;
    > input {
      width: 100%;
      color: black;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      padding: 10px 12px;
      border-radius: 4px;
      height: 40px;
      border: 1px solid var(--Black-100, #f0f0f0);
    }
  }

  > .input-drop-down {
    position: relative;
    margin-top: 20px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    height: 40px;
    border: 1px solid var(--Black-100, #f0f0f0);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    > span {
      color: black;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .content-wrapper {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin-bottom: 16px;
    }
  }
  > .button-wrapper {
    width: 100%;
    padding: 0 16px;
    position: absolute;
    bottom: 48px;
    left: 0;
    > .button {
      display: flex;
      width: 100%;
      padding: 15px 140px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: var(--Purple-300, #6436e7);
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }
  }

  .toastui-editor-dropdown-toolbar {
    width: 100%;
    height: auto;

    flex-direction: column;
    @media only screen and (max-width: 480px) {
      max-widht: 500px;
      right: 0;
    }
  }

  .toastui-editor-popup {
    @media only screen and (max-width: 480px) {
      margin-left: 0;
    }
  }
`;

const DropDownBoxWrapper = styled.div`
  position: absolute;
  top: 52px;
  z-index: 5;
  left: 0px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 4px;

  > .item {
    padding: 10px 12px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: #808080;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .item.active {
    color: #fff;
    border: none;
    background: #6436e7;
  }
`;
interface FilterType {
  name: string;
  type: string;
}
const WritePage = (props: {
  onClose: any;
  boardType: "ROLE_USER" | "ROLE_DEALER" | "ROLE_SELLER";
}) => {
  const editorRef = useRef<Editor>(null);
  const boardType = props.boardType;
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tab, setTab] = useState<FilterType>({
    type: "DAILY",
    name: "일상",
  });
  const filter: FilterType[] =
    boardType === "ROLE_USER"
      ? [
          {
            type: "DAILY",
            name: "일상",
          },
          {
            type: "NORMAL",
            name: "핸드스토리",
          },
        ]
      : [
          {
            type: "DAILY",
            name: "일상",
          },
        ];
  const setLoading = useSetRecoilState(loadingState);
  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.getInstance().getHTML() !== value
    ) {
      editorRef.current.getInstance().setHTML(value);
    }
  }, [value]);

  const handleChange = useCallback(() => {
    if (editorRef.current) {
      const htmlValue = editorRef.current.getInstance().getHTML();
      console.log(htmlValue);
      setValue(htmlValue);
    }
  }, [setValue]);

  const uploadImage = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob);

    try {
      setLoading(true);
      const response = await uploadBoardImage(formData);
      if (!response) {
        setLoading(false);
        return;
      }
      const imageUrl = response; // 서버에서 반환된 이미지 URL
      setLoading(false);
      return imageUrl;
    } catch (error) {
      setLoading(false);
      console.error("Image upload failed:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();

      editorInstance.removeHook("addImageBlobHook");
      editorInstance.addHook("addImageBlobHook", async (blob, callback) => {
        try {
          const imageUrl = await uploadImage(blob);
          callback(imageUrl, "alt text"); // 이미지 URL과 alt 텍스트 설정
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      });
    }
  }, []);
  const upload = async () => {
    if (!editorRef || !editorRef.current) {
      return;
    }
    if (title === "" || editorRef.current.getInstance().getHTML() === "") {
      enqueueSnackbar("입력칸을 채워주세요.", {
        variant: "error",
      });
    }

    const route =
      boardType === "ROLE_USER"
        ? "hand"
        : boardType === "ROLE_DEALER"
        ? "dealer"
        : "seller";

    try {
      setLoading(true);

      const response = await registerBoard(
        {
          title,
          content: editorRef.current.getInstance().getHTML(),
          type: tab.type,
        },
        route
      );

      if (response.code === 200) {
        setLoading(false);
        props.onClose(false);
      }
      setLoading(false);
    } catch (e: any) {
      if (e.code === 405) {
        enqueueSnackbar(e.message, {
          variant: "error",
        });
      }
      setLoading(false);
    }
  };

  const headerTitle =
    boardType === "ROLE_USER"
      ? "핸드"
      : boardType === "ROLE_DEALER"
      ? "딜러"
      : "업주";
  return (
    <Wrapper>
      <Header>
        <div className="close" onClick={() => props.onClose(false)}>
          <img src="/image-web/Icon/Back.svg" alt="close" />
        </div>

        <span className="title">{headerTitle} 게시판</span>
      </Header>
      <Body>
        <div className="input-title">
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div
          className="input-drop-down"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <span>{tab.name}</span>
          <img src="/image-web/community/more.svg" alt="drop-down" />
          {filterOpen && (
            <DropDownBoxWrapper>
              {filter.map((item) => (
                <div
                  className={`item ${tab.type === item.type ? "active" : ""}`}
                  onClick={() => setTab(item)}
                >
                  {item.name}
                </div>
              ))}
            </DropDownBoxWrapper>
          )}
        </div>
        <div className="content-wrapper">
          <div className="title">내용</div>
        </div>
        <Editor
          initialValue={value}
          previewStyle="tab"
          height="50%"
          placeholder="불쾌감을 주거나 광고성,음란성 컨텐츠를 포함한 게시물은 제재를 받을 수 있습니다."
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          ref={editorRef}
          onChange={handleChange}
          linkAttributes={{
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        />
        <div className="button-wrapper">
          <div className="button" onClick={() => upload()}>
            등록
          </div>
        </div>
      </Body>
    </Wrapper>
  );
};

export default WritePage;
