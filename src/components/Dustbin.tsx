import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useDrop } from "react-dnd";
import { Box } from "./Box";

const style: CSSProperties = {
  height: "12rem",
  width: "12rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
};

interface Box {
  name: string;
  type: string;
  position: number;
}

export interface DustbinProps {
  accept: string[];
  allItems?: any;
  onDrop: (item: any) => void;

  boxes: Box[];
  droppedBoxNames: string[];
  boxName: string;
}

export const Dustbin: FC<DustbinProps> = memo(function Dustbin({
  accept,
  allItems,
  onDrop,

  boxes,
  droppedBoxNames,
  boxName,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  function isDropped(boxName: string) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const isActive = isOver && canDrop;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      <h4> {boxName} </h4>
      <div style={{ overflow: "hidden", clear: "both" }}>
        {boxes.map(({ name, type }, index) => (
          <Box
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
});
