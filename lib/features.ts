import mime from "mime-types";

export const getOutputColor = (type: string) => {
  switch (type) {
    case "error":
      return "text-[#f48771]";
    case "success":
      return "text-[#89d185]";
    case "info":
      return "text-[#75beff]";
    case "input":
      return "text-[#cccccc]";
    default:
      return "text-[#cccccc]";
  }
};

export const getRandomImg = async () => {
  const res = await fetch("https://api.jikan.moe/v4/random/characters");
  const data = await res.json();
  return data.data.images.jpg.image_url;
};
// https://i.waifu.pics/8m-r1_O.png

export const formatte = (time: string) => {
  const date = new Date(time);
  return date.toLocaleTimeString("en-us", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  py: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
};

export function getType(fileName: string) {
  const type = mime.lookup(fileName);

  const ext = mime.extension(type);

  if (!ext) return languageMap[fileName.split(".")[1]] || "plaintext";

  return ext;
}
