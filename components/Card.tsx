import Image from "next/image";

const Card = ({
  url,
  name,
  ever_drawn_win_rate,
}: {
  url: string;
  name: string;
  ever_drawn_win_rate: number;
}) => (
  <div
    style={{
      position: "relative",
    }}
  >
    <Image src={url} width={480 / 3} height={680 / 3} alt={name} />
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
      {(Math.round(ever_drawn_win_rate * 10000) / 100).toFixed(2)}
    </div>
  </div>
);

export default Card;
