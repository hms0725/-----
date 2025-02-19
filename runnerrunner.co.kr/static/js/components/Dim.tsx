import {MEDIA_DESKTOP} from "../hooks/useScreenOrientation";
import styled from "styled-components";

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background: #000;
  z-index: 110;
`
export default Dim;
