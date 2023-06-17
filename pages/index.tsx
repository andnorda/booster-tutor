import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { cardRatings, CardRating } from "../lib/card-ratings";
import Card from "../components/Card";

const decks = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

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
  const [selectedDeck, setSelectedDeck] = useState<string>();

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
      <select
        value={selectedDeck}
        onChange={(e) =>
          setSelectedDeck(
            e.target.value === "Select deck" ? undefined : e.target.value
          )
        }
      >
        {["Select deck", ...decks].map((deck) => (
          <option key={deck} value={deck}>
            {deck}
          </option>
        ))}
      </select>
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
          .filter((card) =>
            selectedDeck
              ? card.color === "" ||
                card.color
                  .split("")
                  .some((color) => selectedDeck.split("").includes(color))
              : true
          )
          .sort((a, b) =>
            selectedDeck
              ? b[selectedDeck] - a[selectedDeck]
              : b.ever_drawn_win_rate - a.ever_drawn_win_rate
          )
          .map((card, i) => (
            <li
              key={card.name}
              style={{
                display: card.name.toLowerCase().includes(filter.toLowerCase())
                  ? "block"
                  : "none",
              }}
            >
              <Card {...card} selectedDeck={selectedDeck} />
            </li>
          ))}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const deckRatings = (
    await Promise.all(decks.map((deck) => cardRatings({ colors: deck })))
  ).reduce(
    (prev, curr, i) => ({
      ...prev,
      [decks[i]]: curr,
    }),
    {}
  );
  return {
    props: {
      cardRatings: (await cardRatings()).map((c, i) => ({
        ...c,
        ...decks.reduce(
          (prev, curr) => ({
            ...prev,
            [curr]:
              deckRatings[curr][i].ever_drawn_game_count > 200
                ? deckRatings[curr][i].ever_drawn_win_rate
                : 0,
          }),
          {}
        ),
      })),
    },
  };
};

export default Home;
