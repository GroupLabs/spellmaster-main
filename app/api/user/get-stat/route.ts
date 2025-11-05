import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const searchParams = new URLSearchParams(request.url.split("?")[1]);
  const browserToken = searchParams.get("browserToken") ?? undefined;

  if (!browserToken) {
    return new Response(JSON.stringify({ error: "Browser token not found" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const client = new PrismaClient();

  const userStat = await client.user.findFirst({
    where: {
      browserToken,
    },
    select: {
      gold: true,
      gemBlue: true,
      gemGreen: true,
      gemPurple: true,
    },
  });

  if (!userStat) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(userStat), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
