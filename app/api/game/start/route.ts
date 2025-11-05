import { Category } from "@mui/icons-material";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();

  const { wordListId } = body;

  const client = new PrismaClient();

  const wordListSettings = await client.wordListSettings.findUnique({
    where: {
      id: wordListId,
    },
    select: {
      wordList: true,
      selectedCategory: true,
      categories: true,
      customCategory: true,
    },
  });

  if (!wordListSettings) {
    return new Response(JSON.stringify({ error: "Word list not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const gameId = await client.game.create({
    data: {
      wordListSettings: {
        connect: {
          id: wordListId,
        },
      },
    },
  });

  const wordList = wordListSettings.wordList.map((word) => ({
    word: word.word.toLowerCase(),
    exemplarUsage: word.exemplarUsage,
  }));
  const randomWordList = wordList.sort(() => Math.random() - 0.5);
  const res = {
    gameId: gameId.id,
    wordList: randomWordList,
    category:
      wordListSettings.selectedCategory === -1
        ? wordListSettings.customCategory
        : wordListSettings.categories[wordListSettings.selectedCategory],
  };

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
