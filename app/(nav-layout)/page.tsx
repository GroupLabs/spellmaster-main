import { Stack } from "@mui/material";
import { Welcome } from "@/components/landing-page/welcome";

export default function HomePage() {
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      style={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Welcome />
    </Stack>
  );
}
