import { color_border, color_surface } from "@/theme";
import { Box, Card, Stack, Typography } from "@mui/material";
import { IGameInfo } from "@/lib/games";
import Image from "next/image";
import { track } from "@vercel/analytics";

export default function GameCard({
  gameInfo,
  wordListId,
  canSelect = false,
}: {
  gameInfo: IGameInfo;
  wordListId?: string;
  canSelect?: boolean;
}) {
  function redirectGame() {
    if (!wordListId) {
      alert("Empty word list");
      return;
    }
    window.location.href = `/game/${gameInfo.id}?word-list-id=${wordListId}&is-unity=${gameInfo.isUnity}`;
    track("Game Loaded", {
      name: gameInfo.name,
    });
  }

  return (
    <Card
      style={{
        borderRadius: "16px",
        border: `1px solid ${color_border}`,
        cursor: canSelect ? "pointer" : "default",
        width: "240px",
        margin: "8px 16px"
      }}
      onClick={canSelect ? redirectGame : undefined}
    >
      <Stack
        width={"240px"}
        height={"298px"}
        spacing={"2px"}
        style={{
          background: color_surface,
        }}
      >
        <Box
          width={"100%"}
          height={"40px"}
          display={"flex"}
          alignItems={"end"}
          paddingX={"16px"}
          paddingY={"2px"}
        >
          <Typography fontSize={"16px"} fontWeight={"bold"}>
            {gameInfo.name}
          </Typography>
        </Box>
        <Box
          width={"100%"}
          height={"150px"}
          style={{
            background: "#D9D9D9",
          }}
          position={"relative"}
        >
          <Image src={gameInfo.image} alt={gameInfo.name} layout="fill" />
        </Box>

        <Box paddingX={"16px"}>
          <Typography fontSize={"12px"} fontWeight={"semibold"}>
            {gameInfo.description}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
