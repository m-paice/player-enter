import type { FC } from "react";
import { memo, useCallback, useState } from "react";

import { Dustbin } from "./Dustbin";
import { ItemTypes } from "./ItemTypes";

interface DustbinState {
  accepts: string[];
  allItems: any;
}

interface BoxState {
  name: string;
  type: string;
  position: number;
}

interface History {
  name: string;
  time: Date;
  box: string;
}

export const Container: FC = memo(function Container() {
  const [dustbins, setDustbins] = useState<DustbinState[]>([
    { accepts: [ItemTypes.ALL_GROUP], allItems: [] },
    { accepts: [ItemTypes.ALL_GROUP], allItems: [] },
    { accepts: [ItemTypes.ALL_GROUP], allItems: [] },
  ]);

  const [boxes, setBox] = useState<BoxState[]>([
    { name: "Ana", type: ItemTypes.ALL_GROUP, position: 0 },
    { name: "João", type: ItemTypes.ALL_GROUP, position: 0 },
    { name: "Marcos", type: ItemTypes.ALL_GROUP, position: 0 },
  ]);

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

  const [history, setHistory] = useState<History[]>([]);

  const handleGetBox = (boxNumber: number) => {
    const boxesName = {
      0: "Sem atendimento",
      1: "Em atendimento",
      2: "Descanço",
    };

    return boxesName[boxNumber] || "não definido";
  };

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;

      // verificar se o usuario ja esta na box que soltou

      setDroppedBoxNames((prevState) => [...prevState, name]);

      setDustbins(
        dustbins.map((data, key) => {
          if (key === index) {
            return {
              ...data,
              allItems: [...data.allItems, { name }],
            };
          }

          return data;
        })
      );

      setBox(
        boxes.map((data) => {
          if (data.name === name) {
            return {
              ...data,
              position: index,
            };
          }

          return data;
        })
      );

      setHistory([
        ...history,
        { name, box: handleGetBox(index), time: new Date() },
      ]);
    },
    [droppedBoxNames, dustbins]
  );

  return (
    <div>
      <div style={{ overflow: "hidden", clear: "both" }}>
        {dustbins.map(({ accepts, allItems }, index) => (
          <Dustbin
            accept={accepts}
            allItems={allItems}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
            boxes={boxes.filter((item) => item.position === index)}
            droppedBoxNames={droppedBoxNames}
            boxName={handleGetBox(index)}
          />
        ))}
      </div>

      <div>
        {history.map((item, index) => (
          <div key={index}>
            <b>
              {" "}
              {item.name} - Entrou na box {item.box} as{" "}
              {`${item.time.getHours()}:${item.time.getMinutes()}:${item.time.getSeconds()}`}{" "}
            </b>
          </div>
        ))}
      </div>
    </div>
  );
});
