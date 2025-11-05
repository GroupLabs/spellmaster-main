import { IUserStat } from "@/lib/interface";
import { PrismaClient, User } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.json();

  const paramUser: {
    username: string;
    browserToken: string;
    stat: IUserStat;
  } = body;

  if (!paramUser.browserToken || !paramUser.username || !paramUser.stat) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const client = new PrismaClient();

  const user = await client.user.findFirst({
    where: {
      browserToken: paramUser.browserToken,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
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
  } else {
    await client.user.update({
      where: {
        id: user.id,
      },
      data: {
        gold: paramUser.stat.gold,
        gemGreen: paramUser.stat.gemGreen,
        gemBlue: paramUser.stat.gemBlue,
        gemPurple: paramUser.stat.gemPurple,
      },
    });
  }

  return new Response(JSON.stringify({ message: "Stat updated" }), {
    headers: { "Content-Type": "application/json" },
  });
}
