'use client'
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [converted, setConverted] = useState(null);
  const [musicLink, setMusicLink] = useState(""); // Nuevo state para el link compartible

  // Detectar el servicio del link pegado
  const getServiceFromUrl = (url) => {
    if (!url) return null;
    if (url.includes('spotify.com')) return 'Spotify';
    if (url.includes('apple.com')) return 'Apple Music';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('deezer.com')) return 'Deezer';
    return 'Desconocido';
  };

  const isAppleMusicSongLink = (url) => {
    // Busca el parámetro ?i= en el link, típico de canción individual en Apple Music
    return url.includes('music.apple.com') && url.includes('?i=');
  };

  const serviceName = getServiceFromUrl(inputUrl);

  const handleConvert = async () => {
    setConverted(null);
    setMusicLink(""); // Limpiar link al reconvertir

    if (!inputUrl) {
      setConverted({ error: "Por favor pega un link de canción." });
      return;
    }

    if (serviceName === "Desconocido") {
      setConverted({ error: "Solo se permiten links de Spotify, Apple Music, YouTube o Deezer." });
      return;
    }

    // Mensaje especial para Apple Music (no canción individual)
    if (serviceName === "Apple Music" && !isAppleMusicSongLink(inputUrl)) {
      setConverted({
        error: "Por favor usa el link de una canción individual de Apple Music, no de un álbum ni playlist."
      });
      return;
    }

    try {
      const res = await fetch("/api/audd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl })
      });
      const data = await res.json();
      console.log("Respuesta AudD:", data);

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

  // Nueva función para crear el link compartible
  const handleCreateMusicLink = async () => {
    if (!converted) return;
    const res = await fetch("/api/song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(converted),
    });
    const data = await res.json();
    setMusicLink(`${window.location.origin}/song/${data.id}`);
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
        <span className="text-xs text-gray-400">Funciona con Spotify, Apple Music (canción individual), YouTube y Deezer.</span>
      </p>

      {/* Formulario */}
      <Card className="w-full max-w-xl shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6">
          <Input
            placeholder="Pega aquí un link de cualquier servicio (Spotify, Apple Music, YouTube, Deezer...)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="text-lg"
          />
          {/* Mostrar el servicio detectado */}
          {inputUrl && (
            <div className="text-xs text-gray-500 mt-1">
              Servicio detectado: <span className="font-semibold">{serviceName}</span>
              {serviceName === "Apple Music" && !isAppleMusicSongLink(inputUrl) && (
                <span className="text-red-600 ml-2">— Pega un link de canción individual, no álbum/playlist.</span>
              )}
            </div>
          )}
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
              {/* Botón para crear Music Link */}
              <Button
                onClick={handleCreateMusicLink}
                className="mt-4 w-full bg-indigo-600 text-white font-bold text-lg py-2 rounded-xl hover:bg-indigo-700"
              >
                Crear Music Link para compartir
              </Button>
              {musicLink && (
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600 mb-2">¡Listo! Comparte este link:</div>
                  <div className="p-2 bg-gray-100 rounded-lg select-all break-all mb-2">{musicLink}</div>
                  <Button
                    onClick={() => navigator.clipboard.writeText(musicLink)}
                    className="bg-green-500 hover:bg-green-600 w-full mt-1"
                  >
                    Copiar link
                  </Button>
                </div>
              )}
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
