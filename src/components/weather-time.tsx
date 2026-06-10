"use client";

import { useEffect, useState } from "react";

type WeatherState =
  | { status: "idle" | "loading" | "error" }
  | { status: "ok"; tempF: number; tempC: number; icon: string };

function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

export default function WeatherTime() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState<WeatherState>({ status: "idle" });

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    setWeather({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`
          );
          const data = await res.json();
          const tempC = Math.round(data.current.temperature_2m);
          const tempF = Math.round((tempC * 9) / 5 + 32);
          setWeather({ status: "ok", tempC, tempF, icon: weatherIcon(data.current.weather_code) });
        } catch {
          setWeather({ status: "error" });
        }
      },
      () => setWeather({ status: "error" })
    );
  }, []);

  if (!time) return null;

  return (
    <div className="fixed top-4 right-4 z-50 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-sm text-xs font-mono text-zinc-500 dark:text-zinc-400 select-none">
      {weather.status === "ok" && (
        <span className="flex items-center gap-1">
          {weather.icon}
          <span>{weather.tempC}°C</span>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <span>{weather.tempF}°F</span>
          <span className="text-zinc-300 dark:text-zinc-600 mx-0.5">·</span>
        </span>
      )}
      <span className="tabular-nums">{time}</span>
    </div>
  );
}
