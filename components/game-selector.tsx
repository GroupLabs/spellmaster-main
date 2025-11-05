import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import GameCard from "@/components/game-card";
import { Box, Grid, IconButton, Stack } from "@mui/material";
import { listGames } from "@/lib/games";
import { useState } from "react";

export default function GameSelector({
  wordListId,
  canSelect = false,
}: {
  wordListId?: string;
  canSelect?: boolean;
}) {
  const games = listGames();

  return (
    <Grid
      minWidth={`${240 * 3 + 16 * 4}px`}
      width={`${240 * 3 + 16 * 4}px`}
      container
      xs={12}
      paddingX={"8px"}
      style={{
        overflowX: "auto",
      }}
    >
      {games.map((info) => (
        <Grid item key={info.name} xs={4}>
          <GameCard
            gameInfo={info}
            wordListId={wordListId}
            canSelect={canSelect}
          />
        </Grid>
      ))}
    </Grid>
  );
}
