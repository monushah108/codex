import JoinRoom from "@/components/editor/joinRoom";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;
  const roomId = id?.[0];

  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/join/${roomId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (res.status == 404) {
    redirect("/");
  }
  if (res.status == 403) {
    redirect(`/playground/join/${roomId}`);
  }

  if (res.status == 200) {
    redirect(`/playground/${roomId}`);
  }

  return <JoinRoom owner={data} roomId={roomId} />;
}
