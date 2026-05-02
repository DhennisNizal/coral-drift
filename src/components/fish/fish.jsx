import { FishWrapper } from "./styles";
import FishIcon from "../../assets/fish.webp";

export default function Fish({ top, rotation }) {
  return <FishWrapper src={FishIcon} top={top} $rotation={rotation} />;
}
