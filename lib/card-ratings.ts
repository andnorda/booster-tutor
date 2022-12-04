import cache from "./cache";
import queryString from "query-string";

interface CardRatingsQueryParams {
  expansion?: string;
  format?: string;
  colors?: string;
}

export const cardRatings: (
  params: CardRatingsQueryParams
) => Promise<CardRating[]> = async ({
  expansion = "BRO",
  format = "PremierDraft",
  ...rest
} = {}) => {
  const query = queryString.stringify({
    expansion,
    format,
    ...rest,
  });

  return await cache(query, async () => {
    console.log(`Fetching ${query} from 17lands`);
    return fetch(`https://www.17lands.com/card_ratings/data?${query}`)
      .then((res) => res.json())
      .then((cardRatings) => {
        switch (expansion) {
          case "BRO":
            return cardRatings.map((cardRating: CardRating, index: number) => ({
              ...cardRating,
              arena_id:
                index +
                82485 +
                (index >= 163 ? 1 : 0) +
                (index >= 238 ? 1 : 0) +
                (index >= 256 ? 1 : 0) +
                (index >= 267 ? 45 : 0),
            }));
          default:
            return cardRatings;
        }
      });
  });
};

export interface CardRating {
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
