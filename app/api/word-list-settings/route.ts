import { IWordListSettings } from "@/lib/interface";
import { createId } from "@/lib/util";
import { PrismaClient } from "@prisma/client";

// Create a new game settings
export async function POST(request: Request) {
  const body: IWordListSettings = await request.json();

  const client = new PrismaClient();

  // random id of 8 characters
  const newId = createId(10);
  // random password of 8 characters
  const newPwd = createId(10);

  // Create a new game settings
  const newSettings = await client.wordListSettings.create({
    data: {
      id: newId,
      inspirationWords: body.inspirationWords,
      categories: body.categories,
      selectedCategory: body.selectedCategory,
      customCategory: body.customCategory,
      wordList: {
        create: body.wordList.map((word) => ({
          word: word.word,
          exemplarUsage: word.exemplarUsage,
        })),
      },
      editCode: newPwd,
    },
  });

  // return new settings id
  return new Response(
    JSON.stringify({
      id: newSettings.id,
      editCode: newSettings.editCode,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// Get game settings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
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

  // Get the game settings
  const settings = await client.wordListSettings.findUnique({
    where: {
      id: id,
    },
    include: {
      wordList: true,
    },
  });

  return new Response(JSON.stringify(settings), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Update game settings
export async function PATCH(request: Request) {
  const body: IWordListSettings = await request.json();

  const client = new PrismaClient();

  // Update the game settings
  await client.wordListSettings.update({
    where: {
      id: body.id,
    },
    data: {
      inspirationWords: body.inspirationWords,
      categories: body.categories,
      selectedCategory: body.selectedCategory,
      customCategory: body.customCategory,
      wordList: {
        deleteMany: {},
        create: body.wordList.map((word) => ({
          word: word.word,
          exemplarUsage: word.exemplarUsage,
        })),
      },
    },
  });

  return new Response(
    JSON.stringify({
      code: 200,
      message: "Game settings updated successfully",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
