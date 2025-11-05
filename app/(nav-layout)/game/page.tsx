"use client";

import EditCodeForm from "@/components/edit-code-form";
import GameSelector from "@/components/game-selector";
import Loading from "@/components/loading";
import WordList from "@/components/word-list";
import { IUserStat, IWord } from "@/lib/interface";
import { getUserStat } from "@/lib/util";
import {
  color_border,
  color_container_primary,
  color_on_surface,
  color_surface,
} from "@/theme";
import { ArrowBack, Close, Settings } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GamePage() {
  const searchParams = useSearchParams();
  const wordListId = searchParams.get("word-list-id");

  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: wordListData } = useSWR(
    `/api/word-list?id=${wordListId}`,
    fetcher
  );
  const {
    wordList,
    category,
  }: {
    wordList: IWord[];
    category: string;
  } = wordListData ?? { wordList: [], category: "" };
  const [isReviewing, setIsReviewing] = useState(false);
  const [isShowingAdminPanel, setIsShowingAdminPanel] = useState(false);

  const [userStat, setUserStat] = useState<IUserStat | null>(null);

  useEffect(() => {
    getUserStat().then((userStat) => setUserStat(userStat));
  }, []);

  useEffect(() => {
    if (!wordListId) {
      // 404 page
      setIsNotFound(true);
      setIsLoading(false);
    } else if (wordListId.split("?locale=").length > 1) {
      // redirect url if the gameid ends with "?locale=somecode
      const newGameId = wordListId.split("?locale=")[0];
      window.location.href = `/game?word-list-id=${newGameId}`;
    } else {
      // Check if the game exists
      fetch(`/api/word-list/exist?id=${wordListId}`).then((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
          return;
        }
        setIsLoading(false);
      });
    }
  }, [searchParams, wordListId]);

  useEffect(() => {
    if (isNotFound) {
      notFound();
    }
  }, [isNotFound]);

  function SettingsButton() {
    return (
      <Box
        style={{
          position: "absolute",
          top: "76px",
          left: "16px",
        }}
      >
        <IconButton onClick={() => setIsShowingAdminPanel(true)}>
          <Settings />
        </IconButton>
      </Box>
    );
  }

  function AdminPanel() {
    return (
      <Stack
        height={"100%"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingBottom={"48px"}
      >
        <Stack
          style={{
            background: color_surface,
            position: "relative",
            padding: "4px 64px",
            borderRadius: "8px",
            border: `1px solid ${color_border}`,
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
            }}
          >
            <IconButton onClick={() => setIsShowingAdminPanel(false)}>
              <ArrowBack />
            </IconButton>
          </Box>
          <Stack paddingBottom={"16px"}>
            <Typography fontSize={32} fontWeight={"bold"}>
              Edit Word List
            </Typography>
            <EditCodeForm gameId={wordListId!} />
          </Stack>
        </Stack>
      </Stack>
    );
  }

  function UserStats() {
    return (
      <Stack
        direction="row"
        style={{
          position: "absolute",
          top: "80px",
          right: "16px",
        }}
        spacing={"4px"}
      >
        <Stack direction="row" alignItems={"center"}>
          <Image
            width="32"
            height="32"
            alt="Coin"
            src="/currency256_style1_coin.png"
          />
          <Typography fontSize={18} fontWeight={"bold"}>
            {userStat?.gold ?? 0}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          <Image
            width="32"
            height="32"
            alt="Coin"
            src="/currency256_style1_gem33.png"
          />
          <Typography fontSize={18} fontWeight={"bold"}>
            {userStat?.gemBlue ?? 0}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          <Image
            width="32"
            height="32"
            alt="Coin"
            src="/currency256_style1_gem22.png"
          />
          <Typography fontSize={18} fontWeight={"bold"}>
            {userStat?.gemGreen ?? 0}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          <Image
            width="32"
            height="32"
            alt="Coin"
            src="/currency256_style1_gem11.png"
          />
          <Typography fontSize={18} fontWeight={"bold"}>
            {userStat?.gemPurple ?? 0}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack
      padding={"48px"}
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
    >
      {isReviewing ? (
        <Stack direction={"row"} paddingLeft={"48px"}>
          <WordList wordList={wordList} />
          <Box>
            <IconButton onClick={() => setIsReviewing(false)}>
              <Close />
            </IconButton>
          </Box>
        </Stack>
      ) : isShowingAdminPanel ? (
        <AdminPanel />
      ) : (
        <>
          <Stack
            spacing={"16px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Typography fontSize={36} fontWeight={"bold"}>
              {category}
            </Typography>
            <Typography fontSize={24} fontWeight={"bold"}>
              Select a game to practice your spelling and vocabulary skills
            </Typography>

            <Box width={"200px"}>
              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  fontSize: "18px",
                  background: color_container_primary,
                  color: color_on_surface,
                }}
                fullWidth
                onClick={() => setIsReviewing(true)}
              >
                Study Word List
              </Button>
            </Box>
            <GameSelector canSelect wordListId={wordListId ?? undefined} />
          </Stack>
          <SettingsButton />
          <UserStats />
        </>
      )}
    </Stack>
  );
}
