import StoreProvider from "@/app/StoreProvider";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "room",
};

export default function layout({ children }) {
  return (
    <div>
      <StoreProvider>{children}</StoreProvider>
    </div>
  );
}
