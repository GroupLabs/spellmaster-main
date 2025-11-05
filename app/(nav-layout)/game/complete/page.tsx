"use client";

import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  Stack,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import {
  color_border,
  color_container_primary,
  color_on_surface,
  color_surface,
  color_surface_variant,
} from "@/theme";
import CompletionTip from "@/components/completion-tip";
import { useEffect, useState } from "react";
import { IGameResult } from "@/lib/interface";
import { readGameResult } from "@/lib/util";
import Loading from "@/components/loading";
import MiniGame from "@/components/mini-game";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function CompletePage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const [gameResult, setGameResult] = useState<IGameResult | null>(null);
  const [isMiniGameDone, setIsMiniGameDone] = useState(false);

  const miniGames = [
    "claw-machine",
    "coin-drop",
    "hit-reward",
    "lucky-wheel",
    "slot-machine",
    "treasure-hunt",
  ];

  useEffect(() => {
    if (gameId) {
      readGameResult(gameId).then((result) => {
        setGameResult(result);
      });
    }
  }, [gameId]);

  const router = useRouter();

  if (!isMiniGameDone) {
    return (
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <MiniGame
          gameName={miniGames[Math.floor(Math.random() * miniGames.length)]}
          onGameOver={() => {
            setIsMiniGameDone(true);
          }}
        />
      </Stack>
    );
  } else if (!gameResult) {
    return <Loading />;
  }

  return (
    <Stack
      alignItems={"center"}
      paddingTop={"80px"}
      spacing={"24px"}
      style={{
        background: color_surface_variant,
      }}
    >
      <Typography fontWeight={"bold"} fontSize={"36px"}>
        Results:
      </Typography>
      <Stack spacing={"16px"}>
        <Stack
          direction={"row"}
          style={{
            background: color_surface,
            border: `1px solid ${color_border}`,
            borderRadius: "8px",
            width: "400px",
            height: "56px",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Typography fontSize={"24px"}>Correct</Typography>
          <CircularProgressWithLabel
            variant="determinate"
            value={(gameResult.actualScore / gameResult.totalScore) * 100}
            color="success"
          ></CircularProgressWithLabel>
        </Stack>
        <Stack
          direction={"row"}
          style={{
            background: color_surface,
            border: `1px solid ${color_border}`,
            borderRadius: "8px",
            width: "400px",
            height: "56px",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Typography fontSize={"24px"}>Wrong</Typography>
          <CircularProgressWithLabel
            variant="determinate"
            value={100 - (gameResult.actualScore / gameResult.totalScore) * 100}
            color="warning"
          ></CircularProgressWithLabel>
        </Stack>
      </Stack>
      <Typography fontWeight={"bold"} fontSize={"36px"}>
        Tips:
      </Typography>
      {gameResult.wrongWords.length === 0 ? (
        <Typography>No tips available. You did great!</Typography>
      ) : (
        <Stack spacing={"16px"} direction={"row"}>
          {gameResult.wrongWords.map((word, index) => (
            <CompletionTip key={index} word={word} />
          ))}
        </Stack>
      )}
      <Stack direction="row" spacing={"16px"}>
        <Button
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "140px",
            height: "36px",
          }}
          onClick={() => {
            // Capture screenshot
            window.print();
          }}
        >
          Print
        </Button>
        <Button
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "140px",
            height: "36px",
          }}
          onClick={() => {
            router.push(`/game?word-list-id=${gameResult.wordListSettingsId}`);
          }}
        >
          Finish
        </Button>
      </Stack>
    </Stack>
  );
}
