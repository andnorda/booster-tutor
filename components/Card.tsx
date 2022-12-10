import Image from "next/image";

const Card = ({
  url,
  name,
  ever_drawn_win_rate,
  selectedColors,
  small = false,
  ...rest
}: {
  url: string;
  name: string;
  ever_drawn_win_rate: number;
  selectedColors: string;
}) => (
  <div
    style={{
      position: "relative",
      color: "white",
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
      {selectedColors
        ? (
            Math.round(rest[selectedColors].ever_drawn_win_rate * 10000) / 100
          ).toFixed(2)
        : (Math.round(ever_drawn_win_rate * 10000) / 100).toFixed(2)}
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
        ({(Math.round(ever_drawn_win_rate * 10000) / 100).toFixed(2)})
      </div>
    )}
  </div>
);

export default Card;
