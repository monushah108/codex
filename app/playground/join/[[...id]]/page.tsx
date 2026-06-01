import JoinRoom from "@/components/editor/joinRoom";

import { Metadata } from "next";

import { cookies } from "next/headers";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Join Room",
};

interface PageProps {
  params: Promise<{
    id: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const roomId = id?.[0];

  if (!roomId) {
    redirect("/");
  }

  const cookieStore = await cookies();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/playground/join/${roomId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },

      cache: "no-store",
    },
  );

  //
  // INVALID ROOM
  //

  if (response.status === 400 || response.status === 404) {
    redirect("/");
  }

  //
  // ALREADY MEMBER
  //

  if (response.status === 200) {
    redirect(`/playground/${roomId}`);
  }

  //
  // EXPIRED ROOM
  //

  if (response.status === 410) {
    redirect("/");
  }

  const data = await response.json();

  return <JoinRoom owner={data} roomId={roomId} />;
}
