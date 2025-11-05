import { color_border, color_surface } from "@/theme";
import { Stack } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";

export default function CompletionTip({ word }: { word: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const [tip, setTip] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/genai/tip", {
      method: "POST",
      body: JSON.stringify({ word }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTip(data.tip);
        setIsLoading(false);
      });
  }, [word]);

  return (
    <Stack
      style={{
        background: color_surface,
        padding: "16px",
        border: `1px solid ${color_border}`,
        borderRadius: "8px",
        height: "240px",
        width: "220px",
      }}
    >
      {isLoading ? (
        <Stack height={"100%"} alignItems="center" justifyContent={"center"}>
          <BeatLoader />
        </Stack>
      ) : (
        tip
      )}
    </Stack>
  );
}
