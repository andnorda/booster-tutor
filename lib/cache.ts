import fs from "fs";

export const cache = async <Type = any>(
  filename: string,
  query: () => Promise<Type>
): Promise<any> => {
  const path = `./${filename}.json`;
  if (!fs.existsSync(path)) {
    const data = await query();
    fs.writeFileSync(path, JSON.stringify(data));
    return data;
  } else {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  }
};
