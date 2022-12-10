import Image from "next/image";

interface CardInfoProps {
  url: string;
  name: string;
  ever_drawn_win_rate: number;
}

const colorPairs = ["WU", "WB", "WR", "WG", "UB", "UR", "UG", "BR", "BG", "RG"];

const CardInfo = ({
  url,
  name,
  ever_drawn_win_rate,
  ...rest
}: CardInfoProps) => (
  <div style={{ display: "flex" }}>
    <Image src={url} width={480 / 3} height={680 / 3} alt={name} />
    <ul>
      <li>
        over-all: {(Math.round(ever_drawn_win_rate * 10000) / 100).toFixed(2)}
      </li>
      {colorPairs
        .filter((pair) => rest[pair].ever_drawn_win_rate > 0.1)
        .sort(
          (a, b) => rest[b].ever_drawn_win_rate - rest[a].ever_drawn_win_rate
        )
        .map((pair) => (
          <li key={pair}>
            {pair}:{" "}
            {(Math.round(rest[pair].ever_drawn_win_rate * 10000) / 100).toFixed(
              2
            )}{" "}
            (
            {(
              Math.round(
                (rest[pair].ever_drawn_win_rate - ever_drawn_win_rate) * 10000
              ) / 100
            ).toFixed(2)}
            )
          </li>
        ))}
    </ul>
  </div>
);

export default CardInfo;
