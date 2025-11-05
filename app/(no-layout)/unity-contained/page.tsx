"use client";

import Loading from "@/components/loading";
import { IUserStat } from "@/lib/interface";
import {
  getUserStat,
  requestNewGame,
  submitGameResult,
  updateUserStat,
} from "@/lib/util";
import { Stack } from "@mui/material";
import { track } from "@vercel/analytics";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function UnityContained() {
  const params = useSearchParams();
  const wordListId = params.get("word-list-id");
  const gameName = params.get("game-name");
  const isMiniGame = params.get("is-mini-game");

  const [gameId, setGameId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { unityProvider, sendMessage, addEventListener } = useUnityContext({
    loaderUrl: `unity/${gameName}/Build/${gameName}.loader.js`,
    dataUrl: `unity/${gameName}/Build/${gameName}.data`,
    frameworkUrl: `unity/${gameName}/Build/${gameName}.framework.js`,
    codeUrl: `unity/${gameName}/Build/${gameName}.wasm`,
  });

  // Send signal to start game
  useEffect(() => {
    if (isMiniGame) {
      getUserStat().then((stat) => {
        sendMessage("GameController", "StartGame", JSON.stringify(stat));
      });
    } else if (wordListId) {
      requestNewGame(wordListId).then((game) => {
        setGameId(game.gameId);

        if (game.wordList && game.category) {
          sendMessage(
            "GameManager",
            "StartGame",
            JSON.stringify({
              wordList: game.wordList,
              category: game.category,
            })
          );
          console.log(
            "GameManager",
            "StartGame",
            JSON.stringify({
              wordList: game.wordList,
              category: game.category,
            })
          );
        }
      });
    }
  }, [wordListId, sendMessage, isMiniGame]);

  // Receive messages from Unity game
  useEffect(() => {
    // Mini game
    if (isMiniGame) {
      addEventListener("SendToReact", (data) => {
        console.log("Received", data);
        const data_json = JSON.parse(data?.toString() ?? "{}");
        if (data_json.type === "mini-game-over") {
          const newStat: IUserStat = data_json.miniGameOverMessage;
          updateUserStat(newStat);
          // Send a message to the parent window
          window.parent.postMessage("mini-game-over", window.location.origin);
        } else if (data_json.type === "loaded") {
          track("Mini Game Loaded", {
            gameName: gameName,
          });
          setIsLoaded(true);
        }
      });
    }
    // Regular game
    else if (gameId !== "") {
      addEventListener("SendToReact", (data) => {
        console.log("Game ID", gameId);
        console.log("Received", data);
        const data_json = JSON.parse(data?.toString() ?? "{}");
        if (data_json.type === "game-over") {
          const { actualScore, totalScore, wrongWords } =
            data_json.gameOverMessage;
          submitGameResult(gameId, actualScore, totalScore, wrongWords);
        } else if (data_json.type === "tts") {
          const { text } = data_json.ttsMessage;
          const utterance = new SpeechSynthesisUtterance(text);
          speechSynthesis.speak(utterance);
        } else if (data_json.type === "loaded") {
          setIsLoaded(true);
        }
      });
    }
  }, [addEventListener, gameId, isMiniGame]);

  if (!wordListId && !isMiniGame) {
    notFound();
  } else if (!gameName) {
    notFound();
  }

  return (
    <Stack
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {!isLoaded && (
        <Loading
          size={64}
          customText={isMiniGame ? "Loading Bonus Game!" : "Loading Game"}
        />
      )}

      <Unity
        unityProvider={unityProvider}
        style={{
          width: "1920px",
          height: "1080px",
          display: isLoaded ? "block" : "none",
        }}
      />
    </Stack>
  );
}
