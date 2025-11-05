"use client";

import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnityGame({
  wordListId,
  gameName,
}: {
  wordListId: string;
  gameName: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleGameOver = (event: MessageEvent) => {
      const { gameId } = event.data;
      if (gameId) {
        router.push(`/game/complete?gameId=${gameId}`);
      }
    };

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      handleGameOver(event);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  const [zoomScale, setZoomScale] = useState(0);

  useEffect(() => {
    const width = window.innerWidth - 8;
    const height = window.innerHeight - 52;
    const aspectRatio = width / height;

    if (aspectRatio > 16 / 9) {
      setZoomScale(height / 1080);
    } else {
      setZoomScale(width / 1920);
    }
  }, []);

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {zoomScale > 0 && (
        <div
          style={{
            width: 1920 * zoomScale,
            height: 1080 * zoomScale,
            overflow: "hidden",
          }}
        >
          <iframe
            src={`/unity-contained?word-list-id=${wordListId}&game-name=${gameName}`}
            style={{
              width: `${1920 / zoomScale}px`,
              height: `${1080 / zoomScale}px`,
              transform: `scale(${zoomScale})`,
              transformOrigin: "0 0",
              border: "none",
            }}
          />
        </div>
      )}
    </Stack>
  );
}
