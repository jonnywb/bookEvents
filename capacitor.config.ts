import type { CapacitorConfig } from "@capacitor/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CapacitorConfig = {
  appId: "ionic.bookevents",
  appName: "bookevents",
  webDir: "dist",
  plugins: {
    GoogleMaps: {
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    },
  },
};

export default config;
