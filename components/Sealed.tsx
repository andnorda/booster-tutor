import Card from "./Card";

interface Rating {
  ever_drawn_win_rate: number;
  game_count: number;
}

interface Card extends Rating {
  url: string;
  name: string;
  arena_id: number;
  color: string;
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

interface SealedProps {
  sealedPool: Card[];
}

const TopCards = ({ sealedPool }: SealedProps) => (
  <>
    <h2>Top cards</h2>
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {sealedPool
        .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
        .filter((card) => card.ever_drawn_win_rate > 0.58)
        .map((card, i) => (
          <li key={`${card.arena_id},${i}`}>
            <Card {...card} small />
          </li>
        ))}
    </ul>
  </>
);

const Sealed = ({ sealedPool }: SealedProps) => {
  return (
    <>
      <h2>WU</h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {sealedPool
          .filter(
            (card) => !["B", "R", "G"].some((c) => card.color.includes(c))
          )
          .sort((a, b) => b.WU.ever_drawn_win_rate - a.WU.ever_drawn_win_rate)
          .slice(0, 25)
          .map((card, i) => (
            <li key={`${card.arena_id},${i}`}>
              <Card {...card} small selectedColors="WU" />
            </li>
          ))}
      </ul>
      <TopCards sealedPool={sealedPool} />
      {["", "W", "U", "B", "R", "G"].map((color) => (
        <>
          <h2>
            {color} ({sealedPool.filter((card) => card.color === color).length})
          </h2>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {sealedPool
              .filter((card) => card.color === color)
              .sort((a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate)
              .map((card, i) => (
                <li key={`${card.arena_id},${i}`}>
                  <Card {...card} small />
                </li>
              ))}
          </ul>
        </>
      ))}
    </>
  );
};

export default Sealed;
