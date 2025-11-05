"use client";

import UnityGame from "@/components/unity-game";
import { getGameComponent } from "@/lib/games";
import { IWord } from "@/lib/interface";
import { color_container_primary, color_on_surface } from "@/theme";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function GameInstancePage({
  params,
}: {
  params: {
    game_name: string;
  };
}) {
  const searchParams = useSearchParams();
  const wordListId = searchParams.get("word-list-id");
  const isUnity: boolean = searchParams.get("is-unity") === "true";

  const router = useRouter();

  const { data } = useSWR(
    wordListId ? `/api/word-list?id=${wordListId}` : null,
    (url) => fetch(url).then((res) => res.json())
  );
  const {
    wordList,
    category,
  }: {
    wordList: IWord[];
    category: string;
  } = data ?? { wordList: [], category: "" };

  const [isHintOpen, setIsHintOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
    null
  );

  function getGame(gameName: string): JSX.Element {
    if (!isUnity) {
      // HTML game
      const Game = getGameComponent(params.game_name);
      return <Game wordListId={wordListId!} />;
    } else {
      // Unity game
      return <UnityGame wordListId={wordListId!} gameName={gameName} />;
    }
  }

  if (!wordListId) {
    notFound();
  }

  return (
    <Stack height={"100vh"} width={"100%"}>
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        paddingY={"4px"}
        paddingX={"8px"}
        height="48px"
      >
        <Box width="120px">
          <IconButton
            onClick={() => {
              router.push(`/game?word-list-id=${wordListId}`);
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant="h6">{category}</Typography>
        <Stack width="120px">
          {wordList.length > 0 && (
            <Button
              style={{
                background: color_container_primary,
                color: color_on_surface,
                textTransform: "none",
                marginRight: "16px",
              }}
              onClick={(event) => {
                setIsHintOpen(true);
                setPopoverAnchor(event.currentTarget);
              }}
            >
              Show words
            </Button>
          )}
          <Popover
            open={isHintOpen}
            anchorEl={popoverAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            onClose={() => setIsHintOpen(false)}
          >
            <Box paddingX="8px" paddingY="4px">
              <Typography>Possible words:</Typography>
              <Typography>
                {wordList.map((word) => word.word).join(", ")}
              </Typography>
            </Box>
          </Popover>
        </Stack>
      </Stack>
      <Stack paddingBottom={"8px"} height={"calc(100vh - 48px)"}>
        {getGame(params.game_name)}
      </Stack>
    </Stack>
  );
}
