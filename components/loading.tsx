import { color_surface_variant } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { BeatLoader } from "react-spinners";

export default function Loading({
  size = 36,
  customText = "Loading",
}: {
  size?: number;
  customText?: string;
}) {
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      paddingBottom={"64px"}
      flex={1}
      style={{
        background: color_surface_variant,
      }}
    >
      <Typography fontSize={size} fontWeight={"semibold"}>
        {customText}
      </Typography>
      <BeatLoader size={size / 2} />
    </Stack>
  );
}
