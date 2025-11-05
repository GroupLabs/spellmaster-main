"use client";

import {
  color_header_and_footer,
  color_sign_up,
  color_surface_variant,
} from "@/theme";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import BrandBlock from "./brand-block";
import Link from "next/link";
import { Feedback } from "@mui/icons-material";

const NavTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab
          label="Games"
          style={{
            textTransform: "none",
            fontSize: "16px",
          }}
        />
        <Tab
          label="Teacher"
          style={{
            textTransform: "none",
            fontSize: "16px",
          }}
        />
        <Tab
          label="How to use"
          style={{
            textTransform: "none",
            fontSize: "16px",
          }}
        />
        <Tab
          label="About us"
          style={{
            textTransform: "none",
            fontSize: "16px",
          }}
        />
      </Tabs>
    </Box>
  );
};

const AuthBlock = () => {
  return (
    <Stack
      width={"200px"}
      direction={"row"}
      spacing={"16px"}
      justifyContent={"end"}
      paddingRight={"16px"}
      alignItems={"center"}
    >
      <Typography>Login</Typography>

      <Button
        style={{
          background: color_sign_up,
          padding: "8px 16px",
          borderRadius: "16px",
          textTransform: "none",
        }}
      >
        <Typography color={"white"}>Sign up</Typography>
      </Button>
    </Stack>
  );
};

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack height={"100%"} minHeight={"100vh"} width={"100%"}>
      <Box
        height={"64px"}
        width={"100%"}
        style={{
          background: color_header_and_footer,
          padding: "16px 16px",
        }}
      >
        <Stack
          height={"100%"}
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <BrandBlock />
          {/* <NavTabs />
          <AuthBlock /> */}
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSftXhK4gLIJ66vuDvDU6Wgu3U-ZDON-PD6T4YmR2fENML5bLQ/viewform?usp=sf_link"
            target="_blank"
          >
            <Stack
              direction={"row"}
              spacing={"4px"}
              marginX={"16px"}
              alignItems={"center"}
            >
              <Feedback />
              <Typography fontSize={18}>Feedback</Typography>
            </Stack>
          </Link>
        </Stack>
      </Box>
      <Box
        minHeight={"calc(100vh - 64px)"}
        width={"100%"}
        style={{
          background: color_surface_variant,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
