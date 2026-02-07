import { memo } from "react";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

const TabBar = memo(function TabBar({ setOutput, code }) {
  return (
    <div className="h-[35px] bg-[#2d2d30] border-b border-[#2d2d30] ">
      <div>
        <Button>
          <Play className="size-4 mr-2" />
          Run Code
        </Button>
      </div>
    </div>
  );
});

export default TabBar;
