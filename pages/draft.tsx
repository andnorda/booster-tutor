import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import { cache } from "../lib/cache";
import { useEffect } from "react";
import io from "socket.io-client";
let socket;

const Home: NextPage<{ cardRatings: CardRating[] }> = ({ cardRatings }) => {
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
            cardRatings.find(({ arena_id }) => arena_id === n) ?? cardRatings[0]
        )
        .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
        .map((card: CardRating) => (
          <li
            key={card.name}
            style={{
              position: "relative",
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
              {(Math.round(card.ever_drawn_win_rate * 10000) / 100).toFixed(2)}
            </div>
          </li>
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

    socket.on("draft-pack", (pack) => {
      setPack(pack);
    });

    socket.on("draft-deck", (deck) => {
      setDeck(deck);
    });

    socket.on("test-deck", (deck) => {
      setTestDeck(deck);
    });
  };

  const [pack, setPack] = useState([]);
  const [deck, setDeck] = useState();
  const [testDeck, setTestDeck] = useState();

  return (
    <>
      <h1>pack</h1>
      {<CardList>{pack}</CardList>}
      <h1>deck</h1>
      {deck && (
        <CardList>
          {deck.CourseDeck.MainDeck.map(({ cardId }) => cardId)}
        </CardList>
      )}
      <h1>test deck</h1>
      {testDeck && (
        <CardList>
          {testDeck.Deck.MainDeck.map(({ cardId }) => cardId)}
        </CardList>
      )}
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
      cardRatings: cardRatings.map((cardRating: CardRating, index: number) => ({
        ...cardRating,
        arena_id:
          index +
          82485 +
          (index >= 163 ? 1 : 0) +
          (index >= 238 ? 1 : 0) +
          (index >= 256 ? 1 : 0) +
          (index >= 267 ? 45 : 0),
      })),
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
  arena_id?: number;
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
