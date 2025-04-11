import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/sidebar-animation.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

document.documentElement.classList.add("no-transitions");
//
const theme = localStorage.getItem("theme-store")
  ? JSON.parse(localStorage.getItem("theme-store")!).state.theme
  : "system";

if (theme === "system") {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  document.documentElement.classList.add(systemTheme);
} else {
  document.documentElement.classList.add(theme);
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("no-transitions");
  });
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);