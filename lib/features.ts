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
