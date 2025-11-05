import { PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("id");

  if (!gameId) {
    return new Response(
      JSON.stringify({
        code: 400,
        message: "id is required",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const client = new PrismaClient();

  // Check if the game exists
  const game = await client.wordListSettings.findUnique({
    where: {
      id: gameId,
    },
  });

  if (!game) {
    return new Response(
      JSON.stringify({
        code: 404,
        message: "Game not found",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Found",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
