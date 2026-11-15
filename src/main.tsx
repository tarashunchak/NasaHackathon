import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LocaleProvider } from "./i18n";
import { ThemeProvider } from "./theme";

createRoot(document.getElementById("root")!).render(<ThemeProvider><LocaleProvider><App /></LocaleProvider></ThemeProvider>);
