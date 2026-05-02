import styled from "styled-components";

export const FishWrapper = styled.img`
  position: absolute;
  left: 80px;
  top: ${(props) => props.top}px;
  width: 3rem;
  height: 3rem;
  transform: rotate(${(props) => props.$rotation}deg);
  transition: top 0.1s linear, transform 0.3s ease;
`;
