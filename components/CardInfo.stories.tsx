import React from "react";
import { ComponentMeta } from "@storybook/react";
import CardInfo from "./CardInfo";
import sealed from "../sealed.json";
import cardRatings from "../cache/expansion=BRO&format=PremierDraft.json";

export default {
  title: "Card info",
  component: CardInfo,
} as ComponentMeta<typeof CardInfo>;

const colorPairs = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

const colorPairRatings = colorPairs.reduce(
  (acc, pair) => ({
    ...acc,
    [pair]:
      require(`../cache/colors=${pair}&expansion=BRO&format=PremierDraft.json`).find(
        (card) => card.arena_id === sealed.CardPool[13]
      ),
  }),
  {}
);

const card = cardRatings.find(
  (cardRating) => cardRating.arena_id === sealed.CardPool[13]
);

export const Default = () => {
  return <CardInfo {...card} {...colorPairRatings} />;
};
