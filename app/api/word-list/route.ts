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

  // Find word list
  const settings = await client.wordListSettings.findUnique({
    where: {
      id: gameId,
    },
    include: {
      wordList: true,
    },
  });

  if (!settings) {
    return new Response(
      JSON.stringify({
        code: 404,
        message: "Word list not found",
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
      wordList: settings.wordList,
      category: settings.selectedCategory === -1? settings.customCategory : settings.categories[settings.selectedCategory],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
