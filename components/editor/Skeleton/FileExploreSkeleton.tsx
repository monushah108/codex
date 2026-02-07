import { Spinner } from "@/components/ui/spinner"; // or Loader depending on your shadcn setup

const FileExploreSkeleton = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#252526] border-r border-[#2d2d30]">
      <div className="flex flex-col items-center">
        <Spinner className="w-6 h-6 text-[#007acc]" />
      </div>
    </div>
  );
};

export default FileExploreSkeleton;
