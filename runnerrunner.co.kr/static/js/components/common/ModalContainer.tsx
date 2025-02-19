import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { MEDIA_DESKTOP } from "../../hooks/useScreenOrientation";

export const MODAL_TRANSITION_DURATION_MS = 100;

const FadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  max-width: 500px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  @media ${MEDIA_DESKTOP} {
    max-width: 100%;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all ${MODAL_TRANSITION_DURATION_MS}ms linear;
  padding: 32px;

  &[data-show="true"] {
    animation: ${FadeIn} ${MODAL_TRANSITION_DURATION_MS}ms linear;
  }

  &[data-show="false"] {
    opacity: 0;
    pointer-events: none;
    user-select: none;
  }
`;

const Dimmer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #101012;
  opacity: 0.5;
`;

const Content = styled.div`
  z-index: 1;
`;

function ModalContainer({
  show,
  children,
  onBackdropClick,
  type,
  confirm,
}: {
  show: boolean;
  children: any;
  onBackdropClick?: () => void;
  type?: string;
  confirm?: boolean;
}) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (show) {
      setGone(false);
    } else {
      setTimeout(() => {
        setGone(true);
      }, MODAL_TRANSITION_DURATION_MS);
    }
  }, [show]);

  const handleBackdropClick = () => {
    if (!(type === "app-update" && !confirm) && onBackdropClick) {
      onBackdropClick();
    }
  };

  if (gone) {
    return null;
  }

  return (
    <Container data-show={show}>
      <Dimmer onClick={handleBackdropClick} />
      <Content>{children}</Content>
    </Container>
  );
}

export default ModalContainer;
