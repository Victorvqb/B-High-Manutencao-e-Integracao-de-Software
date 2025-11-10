import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaYoutube } from "react-icons/fa";

// Componente para um único cartão de vídeo
const VideoCard = ({ video }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.video_id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="block group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <div className="relative">
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
        <FaYoutube className="text-white text-5xl opacity-80 group-hover:opacity-100" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 dark:text-white leading-tight truncate">
        {video.title}
      </h3>
    </div>
  </a>
);

// Componente principal da página
export default function YouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/youtube-videos/");
        setVideos(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar vídeos do YouTube:", err);
        setError("Não foi possível carregar os vídeos. Verifique a configuração da API Key no backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
        Canal B-High Education
      </h1>

      {loading && <p className="text-gray-600 dark:text-gray-400">A carregar vídeos...</p>}
      
      {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-md">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}