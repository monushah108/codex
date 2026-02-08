import PlayHeader from "@/components/editor/playHeader";
import Playsidebar from "@/components/editor/playSidebar";

export default function layout({ children }) {
  return (
    <div className="grid grid-cols-[70px_1fr]  h-full ">
      <PlayHeader />
      {/* <Playsidebar /> */}
      {children}
      {/* <div className="bg-blue-600 h-full ">pa</div> */}
    </div>
  );
}
