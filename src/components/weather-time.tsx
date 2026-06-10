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

async function fetchWeather(lat: number, lon: number): Promise<WeatherState> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`
  );
  const data = await res.json();
  const tempC = Math.round(data.current.temperature_2m);
  const tempF = Math.round((tempC * 9) / 5 + 32);
  return { status: "ok", tempC, tempF, icon: weatherIcon(data.current.weather_code) };
}

export default function WeatherTime() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      // Try precise geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              const w = await fetchWeather(coords.latitude, coords.longitude);
              setWeather(w);
            } catch {
              setWeather({ status: "error" });
            }
          },
          async () => {
            // Permission denied or unavailable — fall back to IP location
            try {
              const geo = await fetch("https://ipapi.co/json/");
              const { latitude, longitude } = await geo.json();
              const w = await fetchWeather(latitude, longitude);
              setWeather(w);
            } catch {
              setWeather({ status: "error" });
            }
          },
          { timeout: 5000 }
        );
      } else {
        // No geolocation API — go straight to IP fallback
        try {
          const geo = await fetch("https://ipapi.co/json/");
          const { latitude, longitude } = await geo.json();
          const w = await fetchWeather(latitude, longitude);
          setWeather(w);
        } catch {
          setWeather({ status: "error" });
        }
      }
    };
    load();
  }, []);

  if (!time) return null;

  return (
    <>
      {/* Mobile — top left, compact */}
      <div className="md:hidden fixed top-4 left-4 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-sm text-xs font-mono text-zinc-500 dark:text-zinc-400 select-none">
        {weather.status === "ok" && (
          <span className="flex items-center gap-1">
            {weather.icon}
            <span>{weather.tempC}°C</span>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
          </span>
        )}
        <span className="tabular-nums">
          {time.split(":").slice(0, 2).join(":")}
        </span>
      </div>

      {/* Desktop — top right, full */}
      <div className="hidden md:flex fixed top-4 right-4 z-50 items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-sm text-xs font-mono text-zinc-500 dark:text-zinc-400 select-none">
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
    </>
  );
}
