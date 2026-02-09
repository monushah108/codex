import PlayHeader from "@/components/editor/playHeader";
import Playsidebar from "@/components/editor/playSidebar";

export default function layout({ children }) {
  return (
    <div className=" h-full ">
      {/* <PlayHeader /> */}

      {children}
    </div>
  );
}
