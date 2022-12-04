import { useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
import { cardRatings, CardRating } from "../lib/card-ratings";
import Card from "../components/Card";
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
          <li key={card.name}>
            <Card {...card} />
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
  return {
    props: {
      cardRatings: await cardRatings(),
    },
  };
};

export default Home;
