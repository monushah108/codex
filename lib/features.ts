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
