import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || !session.user)
    return new Response("User not found.", { status: 401 });

  return new Response(JSON.stringify(session.user), { status: 200 });
}