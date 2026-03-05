import { LayoutProvider } from "@/context/layout-context";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "room",
};

export default function layout({ children }) {
  return (
    <div>
      <LayoutProvider>{children}</LayoutProvider>
    </div>
  );
}
