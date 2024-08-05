import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

const container = document.getElementById("root");
const root = createRoot(container!);
defineCustomElements(window);
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
