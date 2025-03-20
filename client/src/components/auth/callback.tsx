import { useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(() => {
        router.push("/dashboard"); // Перенаправление на нужную страницу
      });
    } else {
      router.push("/"); // Если токенов нет, отправляем на главную
    }
  }, []);

  return <p>Авторизация...</p>;
}