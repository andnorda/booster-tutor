import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { cardRatings, CardRating } from "../lib/card-ratings";
import { colorPerformance, ColorPerformance } from "../lib/color-performance";
import Card from "../components/Card";

const decks = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

const Home: NextPage<{ cardRatings: CardRating[]; colorPerformance: any }> = ({
  cardRatings,
  colorPerformance,
}) => {
  const val = (n) => {
    const ns = decks
      .filter((deck) => n.color.split("").some((c) => deck.includes(c)))
      .map((deck) => n[deck] - colorPerformance[deck])
      .filter((n) => Math.abs(n) < 0.5);

    const res = Math.max(...ns) - Math.min(...ns);

    if (res > 0.5) {
      console.log(
        JSON.stringify({
          decks,
          ns,
          res,
        })
      );
    }

    return res;
  };

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
          .filter((card) => card.color.length <= 1)
          .filter((card) => {
            const ns = decks
              .filter((deck) =>
                card.color.split("").some((c) => deck.includes(c))
              )
              .map((deck) => card[deck])
              .filter(Boolean);

            return Math.max(...ns) > 0.56;
          })
          .sort((a, b) => {
            return val(b) - val(a);
          })
          .map((card, i) => (
            <li
              key={card.name}
              style={{
                display: card.name.toLowerCase().includes(filter.toLowerCase())
                  ? "block"
                  : "none",
              }}
            >
              <Card
                {...card}
                selectedDeck={selectedDeck}
                override={val(card)}
                colorPerformance={colorPerformance}
              />
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
      colorPerformance: (await colorPerformance())
        .filter((perf) => perf?.color_name?.match(/\((.+)\)/)?.[1].length === 2)
        .reduce(
          (prev, curr) => ({
            ...prev,
            [curr.color_name
              .match(/\((.+)\)/)[1]
              .split("")
              .sort((a, b) => {
                const order = "WUBRG";
                return order.indexOf(a) - order.indexOf(b);
              })
              .join("")]: curr.wins / curr.games,
          }),
          {}
        ),
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
