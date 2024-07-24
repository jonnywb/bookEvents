import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ionic.bookevents",
  appName: "bookevents",
  webDir: "dist",
  plugins: {
    GoogleMaps: {
      apiKey: "AIzaSyACGNlbIgk_6_P5UngLpNsEkoBoaQzmBkU",
    },
  },
};

export default config;
