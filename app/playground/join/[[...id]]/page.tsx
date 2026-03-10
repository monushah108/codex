import JoinRoom from "@/components/editor/joinRoom";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "join",
};

export default async function Page({ params }) {
  const { id } = await params;
  const roomId = id?.[0];

  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/playground/join/${roomId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (res.status == 404 || res.status == 400) {
    redirect("/");
  }

  if (res.status == 200) {
    redirect(`/playground/${roomId}`);
  }

  return <JoinRoom owner={data} roomId={roomId} />;
}
