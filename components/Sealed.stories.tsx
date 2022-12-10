import React from "react";
import { ComponentMeta } from "@storybook/react";
import Sealed from "./Sealed";
import sealed from "../sealed.json";
import cardRatings from "../cache/expansion=BRO&format=PremierDraft.json";
import { CardRating } from "../lib/card-ratings";

export default {
  title: "Sealed",
  component: Sealed,
} as ComponentMeta<typeof Sealed>;

const colorPairs = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

const colorPairRatings: { [key: string]: CardRating[] } = colorPairs.reduce(
  (acc, pair) => ({
    ...acc,
    [pair]: require(`../cache/colors=${pair}&expansion=BRO&format=PremierDraft.json`),
  }),
  {}
);

export const Default = () => (
  <Sealed
    sealedPool={sealed.CardPool.map((arena_id) => ({
      ...cardRatings.find((card) => card.arena_id === arena_id),
      ...colorPairs.reduce(
        (acc, pair) => ({
          ...acc,
          [pair]: colorPairRatings[pair].find(
            (card) => card.arena_id === arena_id
          ),
        }),
        {}
      ),
    }))}
  />
);
