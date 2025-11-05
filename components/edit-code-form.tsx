import { color_container_primary, color_on_surface } from "@/theme";
import { Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

export default function EditCodeForm({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [editCode, setEditCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function CheckEditCode() {
    const payload = {
      id: gameId,
      editCode: editCode,
    };
    setIsLoading(true);
    fetch(`/api/word-list-settings/check-edit-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status === 200) {
        // Redirect to the edit page
        res.json().then((data) => {
          const token = data.token;
          const newUrl = `/word-list-settings?id=${gameId}&token=${token}`;
          // force load the url 
          window.location.href = newUrl;
        });
      } else {
        // Show error message
        alert("Invalid edit code");
        setIsLoading(false);
      }
    });
  }

  return (
    <Stack spacing={"4px"} alignItems={"center"}>
      <TextField
        label="Edit Code"
        value={editCode}
        onChange={(e) => setEditCode(e.target.value)}
      />
      <Button
        variant="contained"
        style={{
          textTransform: "none",
          background: color_container_primary,
          color: color_on_surface,
        }}
        onClick={CheckEditCode}
      >
        Confirm
      </Button>
      {isLoading && <BeatLoader />}
    </Stack>
  );
}
