import styled from "styled-components";
import BackgroundIMG from "../../assets/ocean-background.webp";
import { color } from "../../styles";

export const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80dvh;
  overflow: hidden;
  background-image: url(${BackgroundIMG});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  .game-over {
    position: absolute;
    text-align: center;
    color: ${color.white};
    font-weight: bold;
    background: rgba(0, 0, 0, 0.4);
    padding: 20px;
    border-radius: 8px;
  }
`;

export const Score = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: clamp(18px, 3vw, 28px);
  color: ${color.white};
  font-weight: bold;
  z-index: 999;
`;

export const Bottom = styled.img`
  display: block;
  width: 100vw;
  height: 20dvh;
  object-fit: cover;
`;
