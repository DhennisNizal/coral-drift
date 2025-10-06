import { FishWrapper } from "./styles";
import FishIcon from "../../assets/fish.webp";

export default function Fish({ top }) {
  return <FishWrapper src={FishIcon} top={top} />;
}
