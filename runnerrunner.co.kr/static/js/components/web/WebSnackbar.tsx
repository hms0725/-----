import {SnackbarContent, CustomContentProps, enqueueSnackbar, closeSnackbar} from 'notistack'
import {forwardRef} from "react";
import styled from "styled-components";

const SnackbarWrapper = styled.div<{ variant: "default" | "error" | "success" | "warning" | "info" | "error-popup" }>`
  width: max-content;
  border-radius: 40px;
  padding: 8px 16px;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.28px;
  ${p => (p.variant === "error" || p.variant === "error-popup") && `
    color: #D91818;
    background: #FBE8E8;
  `}
  ${p => p.variant === "success" && `
    color: ${p.theme.color.purple300};
    background: ${p.theme.color.purple100};
  `}
  margin-bottom: 96px;
  z-index: 9999;
`
const WebSnackbar = forwardRef<HTMLDivElement, CustomContentProps>((props, ref) => {
  const {
    // You have access to notistack props and options 👇🏼
    id,
    message,
    ...other
  } = props

  return (
    <SnackbarContent ref={ref} role="alert" {...other} style={{
      justifyContent: "center",
    }} onClick={() => closeSnackbar(id)}>
      <SnackbarWrapper variant={props.variant}>
        {message}
      </SnackbarWrapper>
    </SnackbarContent>
  )
})

export default WebSnackbar;
