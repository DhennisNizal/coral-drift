import { PipeContainer, PipeSection } from "./styles";

export default function Pipe({ left, gapTop, gap }) {
  return (
    <PipeContainer left={left}>
      <PipeSection style={{ height: `${gapTop}px` }} />
      <div style={{ height: `${gap}px` }} />
      <PipeSection
        style={{ height: `${window.innerHeight * 0.8 - gapTop - gap}px` }}
      />
    </PipeContainer>
  );
}
