import { PrismaClient } from "@prisma/client";
import { SignJWT, errors, jwtVerify } from "jose";

// Check if the edit code is correct and request token
export async function POST(request: Request) {
  const {
    id,
    editCode,
  }: {
    id: string;
    editCode: string;
  } = await request.json();

  if (!id || !editCode) {
    return new Response(
      JSON.stringify({
        message: "id and editCode are required",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
  const prisma = new PrismaClient();

  // Check if the edit code is correct
  const settings = await prisma.wordListSettings.findUnique({
    where: {
      id: id,
    },
  });

  if (settings?.editCode !== editCode) {
    return new Response(
      JSON.stringify({
        message: "Invalid edit code",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  // create a jwt that expires in 10 minutes using jose
  const encoder = new TextEncoder();
  // get the current location's origin
  const origin = new URL(request.url).origin;
  const token = await new SignJWT({
    editCode: editCode,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(origin)
    .setExpirationTime("10m")
    .sign(encoder.encode(id));

  return new Response(
    JSON.stringify({
      token: token,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// Check if the token is valid
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? undefined;
  const token = searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({
        message: "Authorization header is required",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  const prisma = new PrismaClient();

  // get the edit code from the database
  const settings = await prisma.wordListSettings.findUnique({
    where: {
      id: id,
    },
  });

  const actualEditCode = settings?.editCode;

  const encoder = new TextEncoder();
  // verify the token
  var verifiedToken;
  try {
    verifiedToken = await jwtVerify(token, encoder.encode(id));
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
      return new Response(
        JSON.stringify({
          message: "Token expired",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 401,
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Invalid token",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  const { payload } = verifiedToken;

  // check if the edit code is correct
  if (payload.editCode !== actualEditCode) {
    return new Response(
      JSON.stringify({
        message: "Invalid token",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Token is valid",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
