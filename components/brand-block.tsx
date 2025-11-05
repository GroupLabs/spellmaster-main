import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BrandBlock() {
  const router = useRouter();

  return (
    <Stack
      width={"200px"}
      height={"48px"}
      direction={"row"}
      spacing={"8px"}
      onClick={() => {
        router.push("/");
      }}
      // Add hover effect
      style={{
        cursor: "pointer",
      }}
    >
      <Image width={48} height={48} src={"/logo.png"} alt="logo" />
      <Typography fontWeight={"bold"} fontSize={24} alignContent={"center"} style={{ whiteSpace: "nowrap" }}>
        Spokabulary (beta)
      </Typography>
    </Stack>
  );
}
