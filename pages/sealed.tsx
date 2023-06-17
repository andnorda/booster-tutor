import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
import { cardRatings, CardRating } from "../lib/card-ratings";
import Card from "../components/Card";
let socket;

interface Rating {
  ever_drawn_win_rate: number;
}

interface Card extends Rating {
  url: string;
  name: string;
  arena_id: number;
  WU: Rating | null;
  WB: Rating | null;
  WR: Rating | null;
  WG: Rating | null;
  UB: Rating | null;
  UR: Rating | null;
  UG: Rating | null;
  BR: Rating | null;
  BG: Rating | null;
  RG: Rating | null;
}

type ColorPair =
  | "WU"
  | "WB"
  | "WR"
  | "WG"
  | "UB"
  | "UR"
  | "UG"
  | "BR"
  | "BG"
  | "RG";

const Home: NextPage<{ colorPairRatings: CardRating[][]; cards: Card[] }> = ({
  colorPairRatings,
  cards,
}) => {
  const [selectedColors, setSelectedColors] = useState<ColorPair>(
    colorPairs[0]
  );

  const CardList = ({ children }: { children: Card[] }) => (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {children
        .filter((card) => card[selectedColors])
        .sort(
          (a, b) =>
            b[selectedColors].ever_drawn_win_rate -
            a[selectedColors].ever_drawn_win_rate
        )
        .map((card: CardRating, i) => (
          <>
            <li key={`${card.name},${i}`}>
              <Card {...card} selectedColors={selectedColors} />
            </li>
            {i === 22 && <div>hmmmm</div>}
          </>
        ))}
    </ul>
  );

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("sealed-deck", (sealed) => {
      setSealed(sealed);
    });
  };

  const [sealed, setSealed] = useState();
  console.log(sealed?.CardPool);

  const winRate = (colorPair: string) =>
    sealed?.CardPool.map(
      (arena_id: number) =>
        colorPairRatings[colorPairs.indexOf(colorPair)].find(
          (cardRating) => cardRating.arena_id === arena_id
        ) ?? colorPairRatings[0][0]
    )
      .filter((card) => card.game_count > 100)
      .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
      .slice(0, 23)
      .reduce((acc, curr) => acc + curr.ever_drawn_win_rate, 0);

  return (
    <>
      <ul>
        {colorPairs
          .map((colorPair, i) => ({
            colorPair,
            winRate: winRate(colorPair),
          }))
          .sort((a, b) => b.winRate - a.winRate)
          .map(({ colorPair: color, winRate }, i) => (
            <li key={color}>
              <label>
                <input
                  type="radio"
                  value={color}
                  checked={color === selectedColors}
                  onChange={() => setSelectedColors(color)}
                />
                {color} ({winRate})
              </label>
            </li>
          ))}
      </ul>
      <h1>deck</h1>
      {sealed && colorPairRatings && (
        <CardList>
          {sealed.CardPool.map(
            (arena_id: number) =>
              cards.find((card) => card.arena_id === arena_id) ?? cards[0]
          )}
        </CardList>
      )}
    </>
  );
};

const colorPairs: ColorPair[] = [
  "WU",
  "WB",
  "WR",
  "WG",
  "UB",
  "UR",
  "UG",
  "BR",
  "BG",
  "RG",
];

export const getStaticProps: GetStaticProps = async () => {
  const colorPairRatings = await Promise.all(
    colorPairs.map((colors: string) => cardRatings({ colors }))
  );

  return {
    props: {
      colorPairRatings,
      cards: (await cardRatings()).map(
        ({ name, url, arena_id, ever_drawn_win_rate }, i) => ({
          name,
          url,
          arena_id,
          ever_drawn_win_rate,
          ...colorPairs.reduce(
            (acc, colorPair, j) => ({
              ...acc,
              [colorPair]:
                colorPairRatings[j][i].game_count > 100
                  ? {
                      ever_drawn_win_rate:
                        colorPairRatings[j][i].ever_drawn_win_rate,
                    }
                  : null,
            }),
            {}
          ),
        })
      ),
    },
  };
};

export default Home;
