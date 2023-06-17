import { useReducer } from "react";
import type { NextPage, GetStaticProps } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
let socket;

interface Zone {
  zoneId: number;
  type: string;
  objectInstanceIds?: number[];
  ownerSeatId?: number;
}

interface GameObject {
  instanceId: number;
  grpId: number;
  type: string;
  zoneId: number;
  subtypes: string[];
  ownerSeatId: number;
}

interface Message {
  type: string;
  zones: Zone[];
  gameObjects?: GameObject[];
}

interface State {
  cards: { [key: number]: GameObject };
  zones: { [key: number]: Zone };
  history: number[];
}

type Action =
  | {
      type: "message";
      message: Message;
    }
  | {
      type: "start-sideboard";
    };

const reducer: (state: State, action: Action) => State = (state, action) => {
  switch (action.type) {
    case "message":
      return {
        ...state,
        cards: (action.message.gameObjects ?? []).reduce(
          (cards, card) => ({
            ...cards,
            [card.instanceId]: card,
          }),
          state.cards
        ),
        zones: (action.message.zones ?? []).reduce(
          (zones, zone) => ({
            ...zones,
            [zone.zoneId]: zone,
          }),
          state.zones
        ),
      };
    case "start-sideboard":
      const history = Object.values(state.cards)
        .filter((card) => card.ownerSeatId === 2)
        .map((card) => card.grpId);
      console.log("start-sideboard", history);
      return {
        ...initialState,
        history,
      };
    default:
      throw new Error();
  }
};

const initialState = {
  cards: {},
  zones: [],
  history: [],
};

const Home: NextPage<{}> = ({}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("game-update", (messages: Message[]) => {
      messages.forEach((message) => dispatch({ type: "message", message }));
    });

    socket.on("start-sideboard", () => {
      dispatch({ type: "start-sideboard" });
    });
  };

  return (
    <ul>
      {Object.values(state.zones).map((zone) => (
        <li key={zone.zoneId}>
          <div>
            <div>
              {zone.type}, {zone.ownerSeatId}
            </div>
            <ul>
              {zone.objectInstanceIds?.map((cardId) => (
                <li key={cardId}>{Object.keys(state.cards[cardId] ?? {})}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default Home;
