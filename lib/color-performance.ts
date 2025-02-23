import cache from "./cache";
import queryString from "query-string";

interface CardRatingsQueryParams {
  expansion?: string;
}

export const colorPerformance: (
  params?: CardRatingsQueryParams
) => Promise<ColorPerformance[]> = async ({ expansion = "DSK" } = {}) => {
  const query = queryString.stringify({
    expansion,
    event_type: "PremierDraft",
    combine_splash: true,
    start_date: "2024-09-24",
    end_date: "2024-10-03",
  });

  return await cache(query, async () => {
    console.log(`Fetching ${query} from 17lands`);
    return fetch(`https://www.17lands.com/color_ratings/data?${query}`).then(
      (res) => res.json()
    );
  });
};

export interface ColorPerformance {
  color_name: string;
  games: number;
  is_summary: boolean;
  wins: number;
}
