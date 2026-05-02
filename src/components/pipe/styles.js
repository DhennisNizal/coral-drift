import styled from "styled-components";
import { color } from "../../styles";

export const PipeContainer = styled.div`
  position: absolute;
  left: ${(props) => props.left}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PipeSection = styled.div`
  width: 5rem;
  background: linear-gradient(to bottom, ${color.limeGreen}, ${color.green});
  border: 2px solid ${color.darkCyan};
  border-radius: 4px;
`;
