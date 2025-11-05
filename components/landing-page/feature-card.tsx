import {  Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function FeatureCard({
  role,
  imageSrc,
  title,
  description,
}: {
  role: string;
  imageSrc: string;
  title: string;
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
      height={"348px"}
      alignItems={"center"}
      marginX={"4px"}
    >
      <Image src={imageSrc} alt={title} width={280} height={130} />
      <Stack spacing={"4px"} paddingX={"8px"}>
        <Typography fontSize={"15px"} textAlign={"center"}>
          {role}
        </Typography>
        <Stack style={{ height: "64px" }} justifyContent={"center"}>
          <Typography
            fontWeight={"bold"}
            fontSize={"21px"}
            textAlign={"center"}
            // allow white spaces in title
            style={{ whiteSpace: "pre-line" }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography fontSize={"15px"} textAlign={"center"}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
