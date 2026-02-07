import { Spinner } from "@/components/ui/spinner";
const EditorSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-[#d4d4d4]">
      <Spinner className="w-10 h-10 text-[#007acc]" />
    </div>
  );
};

export default EditorSkeleton;
