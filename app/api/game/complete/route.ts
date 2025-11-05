import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    id: gameId,
    actualScore,
    totalScore,
    wrongWords,
  }: {
    id: string;
    actualScore: number;
    totalScore: number;
    wrongWords: string[];
  } = body;

  const client = new PrismaClient();

  const res = await client.game.update({
    where: {
      id: gameId,
    },
    data: {
      status: "completed",
      actualScore,
      totalScore,
      wrongWords: wrongWords,
    },
  });

  if (!res) {
    return new Response(JSON.stringify({ error: "Game not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify({
      message: "Added game results.",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
