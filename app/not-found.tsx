import notFoundSvg from "@/public/notFound.gif";
import Image from "next/image";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div>
          <Image
            alt="404"
            src={notFoundSvg.src}
            className="mx-auto"
            width="200"
            height="200"
            unoptimized
          />
        </div>
        <br />
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2">Page not found</p>
      </div>
    </div>
  );
}
