import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { cardRatings, CardRating } from "../lib/card-ratings";
import Card from "../components/Card";

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
                display: card.name.toLowerCase().includes(filter.toLowerCase())
                  ? "block"
                  : "none",
              }}
            >
              <Card {...card} />
            </li>
          ))}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      cardRatings: await cardRatings(),
    },
  };
};

export default Home;
