'use client'
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

export default function SongPage({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/song?id=${params.id}`)
      .then(res => res.json())
      .then(setData);
  }, [params.id]);

  if (!data) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (data.error) return <div className="flex items-center justify-center min-h-screen text-red-500">{data.error}</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center py-10 px-2">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          {data.cover && (
            <img
              src={data.cover}
              alt="Portada"
              className="rounded-xl shadow w-32 h-32 object-cover"
            />
          )}
          <h2 className="text-2xl font-bold text-center">{data.title}</h2>
          <p className="text-lg text-gray-500">{data.artist}</p>
          <div className="flex flex-col gap-3 mt-2 w-full">
            {data.services?.spotify && (
              <a href={data.services.spotify} target="_blank" rel="noopener noreferrer"
                className="w-full block text-center py-3 rounded-xl bg-green-500 text-white font-bold text-lg shadow hover:bg-green-600 transition">
                Abrir en Spotify
              </a>
            )}
            {data.services?.apple && (
              <a href={data.services.apple} target="_blank" rel="noopener noreferrer"
                className="w-full block text-center py-3 rounded-xl bg-pink-500 text-white font-bold text-lg shadow hover:bg-pink-600 transition">
                Abrir en Apple Music
              </a>
            )}
            {data.services?.youtube && (
              <a href={data.services.youtube} target="_blank" rel="noopener noreferrer"
                className="w-full block text-center py-3 rounded-xl bg-red-500 text-white font-bold text-lg shadow hover:bg-red-600 transition">
                Abrir en YouTube
              </a>
            )}
            {data.services?.deezer && (
              <a href={data.services.deezer} target="_blank" rel="noopener noreferrer"
                className="w-full block text-center py-3 rounded-xl bg-blue-500 text-white font-bold text-lg shadow hover:bg-blue-600 transition">
                Abrir en Deezer
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
