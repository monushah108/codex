import { memo } from "react";

import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TabBar = memo(function TabBar({ setOutput, code }) {
  return (
    <div className="h-[35px] bg-[#2d2d30] border-b border-[#2d2d30] flex items-center justify-between px-3 ">
      <div>
        <Button
          variant="none"
          className=" border-t-4 bg-blue-700/20 border-blue-600 rounded-xs"
        >
          index.js
          <X />
        </Button>
      </div>
      <div>
        <Button variant="none" className="play-btns">
          <Play className="size-4 " />
          Run Code
        </Button>
      </div>
    </div>
  );
});

export default TabBar;
