"use client";
import { Nunito, Cabin_Sketch } from "next/font/google";
import { createTheme } from "@mui/material/styles";

/* Fonts */
export const font_nunito = Nunito({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const font_cabin_sketch = Cabin_Sketch({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const font_cabin_sketch_str = font_cabin_sketch.style.fontFamily;

/* Color palettes */
export const color_on_surface = "#000000";
export const color_surface = "#f9f9f9";
export const color_surface_variant = "#fff8e5";
export const color_header_and_footer = "#ffffff";
export const color_container_primary = "#fab900";
export const color_container_success = "#0caf60";
export const color_border = "#a8a8a8";
export const color_error = "#ff1d25";
export const color_table_header = "#d8d8d8";

export const color_sign_up = "#362B0E";
/* Theme */
export const theme = createTheme({
  typography: {
    fontFamily: font_nunito.style.fontFamily,
  },
});
