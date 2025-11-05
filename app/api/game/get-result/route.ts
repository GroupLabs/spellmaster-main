import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const id = params.get("id") ?? undefined;

  const client = new PrismaClient();

  const game = await client.game.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
      actualScore: true,
      totalScore: true,
      wrongWords: true,
      wordListSettingsId: true,
    },
  });

  if (!game) {
    return new Response(JSON.stringify({ error: "Game not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(game), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
