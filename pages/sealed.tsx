import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
import { cardRatings, CardRating } from "../lib/card-ratings";
import Card from "../components/Card";
let socket;

const Home: NextPage<{ colorPairRatings: CardRating[][] }> = ({
  colorPairRatings,
}) => {
  const [selectedColors, setSelectedColors] = useState(colorPairs[0]);
  const CardList = ({ children }) => (
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
        .map(
          (n) =>
            colorPairRatings[colorPairs.indexOf(selectedColors)].find(
              ({ arena_id }) => arena_id === n
            ) ?? colorPairRatings[0][0]
        )
        .filter((card) => card.game_count > 100)
        .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
        .map((card: CardRating, i) => (
          <>
            <li key={`${card.name},${i}`}>
              <Card {...card} />
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

  const winRates = colorPairs.map((color) =>
    sealed?.CardPool.map(
      (n) =>
        colorPairRatings[colorPairs.indexOf(color)].find(
          ({ arena_id }) => arena_id === n
        ) ?? colorPairRatings[0][0]
    )
      .filter((card) => card.game_count > 1000)
      .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
      .slice(0, 23)
      .map((e, i, a) => (i === 0 && console.log(a), e))
      .reduce((acc, curr) => acc + curr.ever_drawn_win_rate, 0)
  );

  return (
    <>
      <ul>
        {colorPairs
          .map((colorPair, i) => ({
            colorPair,
            winRate: winRates[i],
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
                {color}({winRate})
              </label>
            </li>
          ))}
      </ul>
      <h1>deck</h1>
      {sealed && colorPairRatings && <CardList>{sealed.CardPool}</CardList>}
    </>
  );
};

const colorPairs = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      colorPairRatings: await Promise.all(
        colorPairs.map((colors: string) => cardRatings({ colors }))
      ),
    },
  };
};

export default Home;
