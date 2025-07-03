'use client'
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [converted, setConverted] = useState(null);

const handleConvert = async () => {
  setConverted(null);

  try {
    const res = await fetch("/api/audd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: inputUrl })
    });
    const data = await res.json();

    if (!data.result) {
      setConverted({ error: "No se encontró la canción o el link es inválido." });
      return;
    }

    const { title, artist } = data.result;
    setConverted({
      title,
      artist,
      services: {
  spotify: data.result.spotify?.external_urls?.spotify,
  apple: data.result.apple_music?.url,
  youtube: data.result.youtube?.url || data.result.youtube_video?.url,
  deezer: data.result.deezer?.link,
      }
    });
  } catch {
    setConverted({ error: "Ocurrió un error al buscar la canción." });
  }
};


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">🎵 Convierte enlaces de música</h1>
      <div className="flex gap-2 w-full max-w-xl">
        <Input
          placeholder="Pega aquí un link de Spotify, Apple Music, etc."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <Button onClick={handleConvert}>Convertir</Button>
      </div>
{converted && converted.error && (
  <div className="text-red-600 mt-4">{converted.error}</div>
)}
      {converted && (
        <Card className="mt-8 w-full max-w-xl">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">{converted.title}</h2>
            <p className="text-gray-500 mb-4">{converted.artist}</p>
            <div className="flex flex-col gap-2">
              <a href={converted.services.spotify} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Abrir en Spotify</a>
              <a href={converted.services.apple} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Abrir en Apple Music</a>
              <a href={converted.services.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Abrir en YouTube Music</a>
            </div>
          </CardContent>
        </Card>

      )}
    </main>
  );
}
