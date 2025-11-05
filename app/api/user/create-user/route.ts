import { IUserStat } from "@/lib/interface";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();

  const paramUser: {
    username: string;
    browserToken: string;
    stat: IUserStat;
  } = body;

  const client = new PrismaClient();

  await client.user.create({
    data: {
      username: paramUser.username,
      browserToken: paramUser.browserToken,
      gold: paramUser.stat.gold,
      gemGreen: paramUser.stat.gemGreen,
      gemBlue: paramUser.stat.gemBlue,
      gemPurple: paramUser.stat.gemPurple,
    },
  });

  return new Response(
    JSON.stringify({
      message: "User created successfully",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
