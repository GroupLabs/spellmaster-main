import { Avatar, Rating, Stack, Typography } from "@mui/material";

export default function ReviewCard({
  avatarSrc,
  name,
  stars,
  description,
}: {
  avatarSrc: string;
  name: string;
  stars: number;
  description: string;
}) {
  return (
    <Stack
      style={{
        borderRadius: "30px",
        background: "#ffffff",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
      spacing={"12px"}
      width={"300px"}
      height={"260px"}
      alignItems={"center"}
      marginX={"4px"}
      paddingX={"12px"}
      paddingY={"16px"}
    >
      <Avatar src={avatarSrc} alt={avatarSrc} />

      <Stack alignItems={"center"}>
        <Typography fontSize={"19px"} textAlign={"center"} fontWeight={"bold"}>
          {name}
        </Typography>

        <Rating value={stars} readOnly size="small" />
      </Stack>

      <Typography fontSize={"15px"} textAlign={"center"}>
        {description}
      </Typography>
    </Stack>
  );
}
