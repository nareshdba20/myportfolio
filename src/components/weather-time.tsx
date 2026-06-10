"use client";

import { useEffect, useState } from "react";

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ok"; temp: number; icon: string; city: string };

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
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
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
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
            ),
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            ),
          ]);

          const weatherData = await weatherRes.json();
          const geoData = await geoRes.json();

          const temp = Math.round(weatherData.current.temperature_2m);
          const code = weatherData.current.weather_code;
          const city =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.county ||
            geoData.address?.state ||
            "Your location";

          setWeather({ status: "ok", temp, icon: weatherIcon(code), city });
        } catch {
          setWeather({ status: "error" });
        }
      },
      () => setWeather({ status: "error" })
    );
  }, []);

  if (!time) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-6">
      <span className="tabular-nums">{time}</span>
      {weather.status === "loading" && (
        <span className="text-zinc-300 dark:text-zinc-600">· loading weather…</span>
      )}
      {weather.status === "ok" && (
        <span>
          · {weather.icon} {weather.temp}°F · {weather.city}
        </span>
      )}
    </div>
  );
}
