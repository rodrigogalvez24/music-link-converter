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

      const { title, artist, song_link, spotify, apple_music, deezer, youtube, youtube_video } = data.result;
      let youtubeUrl = youtube?.url;
      if (!youtubeUrl && Array.isArray(youtube)) {
        youtubeUrl = youtube[0]?.url;
      }
      if (!youtubeUrl && youtube_video?.url) {
        youtubeUrl = youtube_video.url;
      }

      setConverted({
        title,
        artist,
        album: data.result.album,
        cover: data.result.spotify?.album?.images?.[0]?.url ||
               data.result.apple_music?.artwork?.url?.replace('{w}x{h}', '200x200'),
        song_link,
        services: {
          spotify: spotify?.external_urls?.spotify,
          apple: apple_music?.url,
          youtube: youtubeUrl,
          deezer: deezer?.link,
        }
      });
    } catch {
      setConverted({ error: "Ocurrió un error al buscar la canción." });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-start py-10 px-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🎵</span>
        <span className="font-extrabold text-2xl tracking-tight">MusicLinker</span>
      </div>
      <p className="text-center text-gray-600 mb-6 max-w-lg">
        Pega el link de cualquier canción y te damos los equivalentes en todas tus plataformas favoritas.<br />
        <span className="text-xs text-gray-400">Funciona con Spotify, Apple Music, YouTube y Deezer.</span>
      </p>

      {/* Formulario */}
      <Card className="w-full max-w-xl shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6">
          <Input
            placeholder="Pega aquí un link de Spotify, Apple Music, etc."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="text-lg"
          />
          <Button
            onClick={handleConvert}
            className="w-full text-lg py-3 bg-gradient-to-r from-blue-500 to-purple-500 font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Convertir
          </Button>
          {converted && converted.error && (
            <div className="text-red-600 mt-2">{converted.error}</div>
          )}
        </CardContent>
      </Card>

      {/* Resultado */}
      {converted && !converted.error && (
        <div className="w-full max-w-xl mt-8 animate-fade-in-up">
          <Card className="shadow-2xl rounded-2xl">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              {converted.cover && (
                <img
                  src={converted.cover}
                  alt="Portada"
                  className="rounded-xl shadow w-32 h-32 object-cover"
                />
              )}
              <h2 className="text-2xl font-bold text-center">{converted.title}</h2>
              <p className="text-lg text-gray-500">{converted.artist}</p>
              <div className="flex flex-col gap-3 mt-2 w-full">
                {converted.services.spotify && (
                  <a href={converted.services.spotify} target="_blank" rel="noopener noreferrer"
                    className="w-full block text-center py-3 rounded-xl bg-green-500 text-white font-bold text-lg shadow hover:bg-green-600 transition">
                    Abrir en Spotify
                  </a>
                )}
                {converted.services.apple && (
                  <a href={converted.services.apple} target="_blank" rel="noopener noreferrer"
                    className="w-full block text-center py-3 rounded-xl bg-pink-500 text-white font-bold text-lg shadow hover:bg-pink-600 transition">
                    Abrir en Apple Music
                  </a>
                )}
                {converted.services.youtube && (
                  <a href={converted.services.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-full block text-center py-3 rounded-xl bg-red-500 text-white font-bold text-lg shadow hover:bg-red-600 transition">
                    Abrir en YouTube
                  </a>
                )}
                {converted.services.deezer && (
                  <a href={converted.services.deezer} target="_blank" rel="noopener noreferrer"
                    className="w-full block text-center py-3 rounded-xl bg-blue-500 text-white font-bold text-lg shadow hover:bg-blue-600 transition">
                    Abrir en Deezer
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Animación Tailwind personalizada */}
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px);}
            100% { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </main>
  );
}
