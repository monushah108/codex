import { getUserId } from "@/lib/getUserId";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
}
