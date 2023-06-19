import { Tooltip } from "react-tooltip";
import Image from "next/image";

const p = (n) => (Math.round(n * 10000) / 100).toFixed(2);

const decks = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

const Card = ({
  url,
  name,
  ever_drawn_win_rate,
  selectedColors,
  selectedDeck,
  small = false,
  override,
  ...rest
}: {
  url: string;
  name: string;
  ever_drawn_win_rate: number;
  selectedColors: string;
  selectedDeck?: string;
  small?: boolean;
  override?: number;
}) => (
  <>
    <div
      data-tooltip-id={`${url}-tooltip-id`}
      data-tooltip-content={decks
        .filter((deck) => rest.color.split("").some((c) => deck.includes(c)))
        .filter((deck) => rest[deck])
        .map(
          (deck) => `${deck}: ${p(rest[deck] - rest.colorPerformance[deck])}`
        )
        .join(", ")}
      data-tooltip-place="top"
      style={{
        position: "relative",
        color: "white",
        marginTop: 40,
      }}
    >
      <Image
        src={url}
        width={480 / (small ? 6 : 3)}
        height={680 / (small ? 6 : 3)}
        alt={name}
      />
      <div
        style={{
          position: "absolute",
          top: "33%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: small ? 24 : 42,
          textShadow: "0 0 2px black",
        }}
      >
        {override
          ? p(override)
          : selectedColors
          ? p(selectedDeck ? rest[selectedDeck] : ever_drawn_win_rate)
          : p(selectedDeck ? rest[selectedDeck] : ever_drawn_win_rate)}
      </div>
      {selectedColors && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: small ? 18 : 30,
            textShadow: "0 0 2px black",
          }}
        >
          ({p(ever_drawn_win_rate)})
        </div>
      )}
    </div>
    <Tooltip id={`${url}-tooltip-id`} />
  </>
);
export default Card;
