import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import { cache } from "../lib/cache";

const Home: NextPage<{ cardRatings: CardRating[] }> = ({ cardRatings }) => {
  const [selectedRarities, setSelectedRarities] = useState([
    "mythic",
    "rare",
    "uncommon",
    "common",
    "basic",
  ]);
  const [selectedColors, setSelectedColors] = useState([
    "W",
    "U",
    "B",
    "R",
    "G",
    "colorless",
  ]);
  const [filter, setFilter] = useState("");
  return (
    <>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        autoFocus
      />
      {["mythic", "rare", "uncommon", "common", "basic"].map((rarity) => (
        <label key={rarity}>
          <input
            type="checkbox"
            checked={selectedRarities.includes(rarity)}
            onChange={(e) =>
              setSelectedRarities(
                e.target.checked
                  ? [...selectedRarities, rarity]
                  : selectedRarities.filter((r) => r !== rarity)
              )
            }
          />
          {rarity}
        </label>
      ))}
      {["W", "U", "B", "R", "G", "colorless"].map((color) => (
        <label key={color}>
          <input
            type="checkbox"
            checked={selectedColors.includes(color)}
            onChange={(e) =>
              setSelectedColors(
                e.target.checked
                  ? [...selectedColors, color]
                  : selectedColors.filter((c) => c !== color)
              )
            }
          />
          {color}
        </label>
      ))}
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {cardRatings
          .filter((card) => selectedRarities.includes(card.rarity))
          .filter((card) =>
            card.color === ""
              ? selectedColors.includes("colorless")
              : card.color
                  .split("")
                  .every((color) => selectedColors.includes(color))
          )
          .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
          .map((card) => (
            <li
              key={card.name}
              style={{
                position: "relative",
                display: card.name.toLowerCase().includes(filter.toLowerCase())
                  ? "block"
                  : "none",
              }}
            >
              <Image
                src={card.url}
                width={480 / 3}
                height={680 / 3}
                alt={card.name}
              />
              <div
                style={{
                  position: "absolute",
                  top: "33%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 42,
                  textShadow: "0 0 2px black",
                }}
              >
                {(Math.round(card.ever_drawn_win_rate * 10000) / 100).toFixed(
                  2
                )}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const cardRatings = await cache("card-ratings", () =>
    fetch(
      "https://www.17lands.com/card_ratings/data?expansion=BRO&format=PremierDraft"
    ).then((res) => res.json())
  );

  return {
    props: {
      cardRatings,
    },
  };
};

interface CardRating {
  seen_count: number;
  avg_seen: number;
  pick_count: number;
  avg_pick: number;
  game_count: number;
  win_rate: number;
  sideboard_game_count: number;
  sideboard_win_rate: number;
  opening_hand_game_count: number;
  opening_hand_win_rate: number;
  drawn_game_count: number;
  drawn_win_rate: number;
  ever_drawn_game_count: number;
  ever_drawn_win_rate: number;
  never_drawn_game_count: number;
  never_drawn_win_rate: number;
  drawn_improvement_win_rate: number;
  name: string;
  color: Color;
  rarity: Rarity;
  url: string;
  url_back: string;
}

type Color =
  | ""
  | "W"
  | "U"
  | "B"
  | "R"
  | "G"
  | "WU"
  | "UB"
  | "BR"
  | "RG"
  | "WG"
  | "WB"
  | "UR"
  | "BG"
  | "WR"
  | "UG"
  | "WBR"
  | "URG"
  | "WRG"
  | "WUR"
  | "UBR"
  | "BRG"
  | "WUG"
  | "WUB"
  | "UBG"
  | "WBG"
  | "WUBRG";

type Rarity = "mythic" | "rare" | "uncommon" | "common" | "basic";

export default Home;
