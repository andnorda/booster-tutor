import fs from "fs";

const cache = async <Type = any>(
  filename: string,
  query: () => Promise<Type>
): Promise<any> => {
  if (!fs.existsSync("cache")) {
    fs.mkdirSync("cache");
  }
  const path = `./cache/${filename}.json`;
  if (!fs.existsSync(path)) {
    const data = await query();
    fs.writeFileSync(path, JSON.stringify(data));
    return data;
  } else {
    console.log(`Resolved ${filename} from cache`);
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  }
};

export default cache;
